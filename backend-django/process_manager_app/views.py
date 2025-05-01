"""
Представления (views) для Django REST framework, обрабатывающие запросы API.
Эти представления должны быть добавлены в файл views.py в вашем Django-приложении.
"""
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Department, Employee, ProcessTemplate, Process, 
    TaskType, Task, TaskConnection, TaskComment, Notification
)
from .serializers import (
    DepartmentSerializer, EmployeeSerializer, ProcessTemplateSerializer,
    ProcessSerializer, ProcessDetailSerializer, TaskTypeSerializer,
    TaskSerializer, TaskConnectionSerializer, TaskCommentSerializer,
    NotificationSerializer, UserSerializer
)
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

# Стандартный пагинатор для всех списков
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class DepartmentViewSet(viewsets.ModelViewSet):
    """
    API для управления отделами компании.
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['name']
    ordering_fields = ['name']

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API для управления сотрудниками компании.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['name', 'position', 'email', 'department__name']
    filterset_fields = ['department', 'position']
    ordering_fields = ['name', 'position', 'department__name', 'created_at']

    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        """
        Получить все задачи, назначенные сотруднику.
        """
        employee = self.get_object()
        tasks = Task.objects.filter(assignee=employee)
        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = TaskSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskTypeViewSet(viewsets.ModelViewSet):
    """
    API для управления типами задач.
    """
    queryset = TaskType.objects.all()
    serializer_class = TaskTypeSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']

class ProcessTemplateViewSet(viewsets.ModelViewSet):
    """
    API для управления шаблонами бизнес-процессов.
    """
    queryset = ProcessTemplate.objects.all()
    serializer_class = ProcessTemplateSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['created_by']
    ordering_fields = ['name', 'created_at', 'updated_at']

    @action(detail=True, methods=['post'])
    def create_process(self, request, pk=None):
        """
        Создать бизнес-процесс на основе шаблона.
        """
        template = self.get_object()
        serializer = ProcessSerializer(data=request.data)
        if serializer.is_valid():
            process = serializer.save(
                template=template,
                created_by_id=request.data.get('created_by'),
                data=template.data  # Используем данные шаблона в новом процессе
            )
            return Response(ProcessDetailSerializer(process).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def clone(self, request, pk=None):
        """
        Клонировать шаблон процесса.
        """
        template = self.get_object()
        name = request.data.get('name', f"Копия {template.name}")
        
        new_template = ProcessTemplate.objects.create(
            name=name,
            description=template.description,
            created_by_id=request.data.get('created_by', template.created_by_id),
            data=template.data
        )
        
        return Response(ProcessTemplateSerializer(new_template).data, status=status.HTTP_201_CREATED)

class ProcessViewSet(viewsets.ModelViewSet):
    """
    API для управления бизнес-процессами.
    """
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title', 'description']
    filterset_fields = ['status', 'created_by', 'template']
    ordering_fields = ['title', 'status', 'created_at', 'updated_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProcessDetailSerializer
        return ProcessSerializer

    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        """
        Получить все задачи процесса.
        """
        process = self.get_object()
        tasks = Task.objects.filter(process=process)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        """
        Обновить статус процесса.
        """
        process = self.get_object()
        status_value = request.data.get('status')
        if status_value and status_value in dict(Process.STATUS_CHOICES):
            process.status = status_value
            process.save()
            return Response(ProcessSerializer(process).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """
        Получить статистику по процессу.
        """
        process = self.get_object()
        tasks = Task.objects.filter(process=process)
        
        # Подсчет задач по статусам
        status_counts = {
            'not_started': tasks.filter(status='not_started').count(),
            'in_progress': tasks.filter(status='in_progress').count(),
            'completed': tasks.filter(status='completed').count(),
            'blocked': tasks.filter(status='blocked').count(),
            'total': tasks.count()
        }
        
        # Подсчет задач по приоритетам
        priority_counts = {
            'low': tasks.filter(priority='low').count(),
            'medium': tasks.filter(priority='medium').count(),
            'high': tasks.filter(priority='high').count(),
            'critical': tasks.filter(priority='critical').count()
        }
        
        # Список исполнителей
        assignees = Employee.objects.filter(assigned_tasks__process=process).distinct()
        assignee_data = []
        for assignee in assignees:
            assignee_tasks = tasks.filter(assignee=assignee)
            assignee_data.append({
                'id': assignee.id,
                'name': assignee.name,
                'tasks_count': assignee_tasks.count(),
                'completed_tasks': assignee_tasks.filter(status='completed').count()
            })
        
        return Response({
            'status_counts': status_counts,
            'priority_counts': priority_counts,
            'assignees': assignee_data,
            'process_status': process.status
        })

class TaskViewSet(viewsets.ModelViewSet):
    """
    API для управления задачами.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['process', 'assignee', 'status', 'priority', 'task_type']
    ordering_fields = ['name', 'status', 'priority', 'deadline', 'created_at', 'updated_at']

    @action(detail=True, methods=['get'])
    def subtasks(self, request, pk=None):
        """
        Получить подзадачи для задачи.
        При необходимости эта логика должна быть реализована в соответствии с вашей бизнес-логикой.
        """
        # Пример: в данном случае считаем, что подзадачи - это просто связанные задачи
        task = self.get_object()
        connections = TaskConnection.objects.filter(source_task=task)
        subtasks = [conn.target_task for conn in connections]
        serializer = TaskSerializer(subtasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        """
        Обновить статус задачи.
        """
        task = self.get_object()
        status_value = request.data.get('status')
        if status_value and status_value in dict(Task.STATUS_CHOICES):
            task.status = status_value
            task.save()
            return Response(TaskSerializer(task).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """
        Назначить сотрудника на задачу.
        """
        task = self.get_object()
        employee_id = request.data.get('employee_id')
        
        if not employee_id:
            return Response({'error': 'employee_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            employee = Employee.objects.get(pk=employee_id)
            task.assignee = employee
            task.save()
            return Response(TaskSerializer(task).data)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

class TaskConnectionViewSet(viewsets.ModelViewSet):
    """
    API для управления связями между задачами.
    """
    queryset = TaskConnection.objects.all()
    serializer_class = TaskConnectionSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['source_task', 'target_task', 'connection_type']

class TaskCommentViewSet(viewsets.ModelViewSet):
    """
    API для управления комментариями к задачам.
    """
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['text']
    filterset_fields = ['task', 'author']
    ordering_fields = ['created_at']

class NotificationViewSet(viewsets.ModelViewSet):
    """
    API для управления уведомлениями.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]  # Изменено с IsAuthenticated на AllowAny
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title', 'message']
    filterset_fields = ['recipient', 'notification_type', 'is_read', 'related_task', 'related_process']
    ordering_fields = ['created_at']

    def get_queryset(self):
        """
        Пользователь видит только свои уведомления.
        """
        employee = Employee.objects.filter(user=self.request.user).first()
        if employee:
            return Notification.objects.filter(recipient=employee)
        return Notification.objects.none()

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """
        Отметить все уведомления как прочитанные.
        """
        employee = Employee.objects.filter(user=request.user).first()
        if employee:
            Notification.objects.filter(recipient=employee, is_read=False).update(is_read=True)
            return Response({'status': 'success'})
        return Response({'error': 'Employee profile not found'}, status=status.HTTP_404_NOT_FOUND)