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
    """
    Сериализатор для пользователей Django.
    Используется для регистрации и получения информации о пользователе.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    employee_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'employee_profile']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }
    
    def get_employee_profile(self, obj):
        """
        Получает данные профиля сотрудника для пользователя.
        """
        try:
            employee = Employee.objects.get(user=obj)
            return {
                'id': employee.id,
                'name': employee.name,
                'position': employee.position,
                'department': employee.department.name if employee.department else None,
                'department_id': employee.department.id if employee.department else None,
            }
        except Employee.DoesNotExist:
            return None
    
    def create(self, validated_data):
        """
        Создает нового пользователя с зашифрованным паролем.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    user_email = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = Employee
        fields = '__all__'

class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = '__all__'

class ProcessTemplateSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.name')
    
    class Meta:
        model = ProcessTemplate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class TaskConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskConnection
        fields = '__all__'

class TaskCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.name')
    
    class Meta:
        model = TaskComment
        fields = '__all__'
        read_only_fields = ['created_at']

class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.ReadOnlyField(source='assignee.name')
    task_type_name = serializers.ReadOnlyField(source='task_type.name')
    comments = TaskCommentSerializer(many=True, read_only=True, source='taskcomment_set')
    
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ProcessSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.name')
    template_name = serializers.ReadOnlyField(source='template.name')
    
    class Meta:
        model = Process
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ProcessDetailSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.name')
    template_name = serializers.ReadOnlyField(source='template.name')
    tasks = TaskSerializer(many=True, read_only=True, source='task_set')
    
    class Meta:
        model = Process
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.ReadOnlyField(source='recipient.name')
    related_task_name = serializers.ReadOnlyField(source='related_task.name')
    related_process_name = serializers.ReadOnlyField(source='related_process.title')
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['created_at']