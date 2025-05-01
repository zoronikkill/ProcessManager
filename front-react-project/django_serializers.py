"""
Сериализаторы для Django REST framework, которые преобразуют модели в JSON и обратно.
Эти сериализаторы должны быть добавлены в файл serializers.py в вашем Django-приложении.
"""
from rest_framework import serializers
from .models import (
    Department, Employee, ProcessTemplate, Process, 
    TaskType, Task, TaskConnection, TaskComment, Notification
)
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = ('id', 'name', 'position', 'department', 'department_name', 'email', 'phone', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = '__all__'

class ProcessTemplateSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.name', read_only=True)
    
    class Meta:
        model = ProcessTemplate
        fields = ('id', 'name', 'description', 'created_by', 'created_by_name', 'created_at', 'updated_at', 'data')
        read_only_fields = ('id', 'created_at', 'updated_at')

class TaskConnectionSerializer(serializers.ModelSerializer):
    source_task_name = serializers.ReadOnlyField(source='source_task.name')
    target_task_name = serializers.ReadOnlyField(source='target_task.name')
    
    class Meta:
        model = TaskConnection
        fields = ('id', 'source_task', 'source_task_name', 'target_task', 'target_task_name', 'connection_type', 'created_at')
        read_only_fields = ('id', 'created_at')

class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.ReadOnlyField(source='assignee.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    class Meta:
        model = Task
        fields = (
            'id', 'name', 'description', 'process', 'task_type', 
            'assignee', 'assignee_name', 'status', 'status_display', 
            'priority', 'priority_display', 'deadline', 
            'created_at', 'updated_at', 'position_x', 'position_y'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class TaskCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.name', read_only=True)
    
    class Meta:
        model = TaskComment
        fields = ('id', 'task', 'author', 'author_name', 'text', 'created_at')
        read_only_fields = ('id', 'created_at')

class ProcessSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    tasks_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Process
        fields = (
            'id', 'title', 'description', 'template', 'status', 
            'status_display', 'created_by', 'created_by_name', 
            'created_at', 'updated_at', 'data', 'tasks_count'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'tasks_count')
    
    def get_tasks_count(self, obj):
        return obj.tasks.count()

class ProcessDetailSerializer(ProcessSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta(ProcessSerializer.Meta):
        fields = ProcessSerializer.Meta.fields + ('tasks',)

class NotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.ReadOnlyField(source='recipient.name', read_only=True)
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = (
            'id', 'recipient', 'recipient_name', 'notification_type', 
            'notification_type_display', 'title', 'message', 
            'related_task', 'related_process', 'is_read', 'created_at'
        )
        read_only_fields = ('id', 'created_at')