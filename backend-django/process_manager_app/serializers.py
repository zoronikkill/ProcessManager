"""
Сериализаторы для Django REST framework, которые преобразуют модели в JSON и обратно.
Эти сериализаторы должны быть добавлены в файл serializers.py в вашем Django-приложении.
"""
from rest_framework import serializers
from .models import (
    Department, Employee, ProcessTemplate, Process, 
    TaskType, Task, TaskConnection, TaskComment, Notification, Project
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
    role = serializers.CharField(required=False, default='employee')
    employee_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'employee_profile', 'role', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'is_staff': {'write_only': True, 'required': False},
            'is_superuser': {'write_only': True, 'required': False}
        }
    
    def validate_email(self, value):
        """
        Проверяем уникальность email.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value
    
    def validate(self, data):
        """
        Проверяем и корректируем данные перед созданием пользователя.
        """
        role = data.get('role', 'employee')
        
        # Если роль admin, устанавливаем соответствующие права
        if role == 'admin':
            data['is_staff'] = True
            data['is_superuser'] = True
        else:
            # Для не-админов явно устанавливаем False
            data['is_staff'] = False
            data['is_superuser'] = False
        
        return data
    
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
        role = validated_data.pop('role', 'employee')
        is_staff = validated_data.pop('is_staff', False)
        is_superuser = validated_data.pop('is_superuser', False)
        
        # Создаем пользователя с правами администратора, если роль admin
        if role == 'admin':
            is_staff = True
            is_superuser = True
        
        # Создаем пользователя с установленными правами
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=is_staff,
            is_superuser=is_superuser
        )
        
        return user

    def to_representation(self, instance):
        """
        Преобразует объект пользователя в словарь.
        Добавляет роль на основе прав пользователя.
        """
        ret = super().to_representation(instance)
        # Определяем роль на основе прав пользователя
        ret['role'] = 'admin' if instance.is_staff else 'employee'
        return ret

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

    def validate(self, data):
        if data['source_task'] == data['target_task']:
            raise serializers.ValidationError("Задача не может быть связана сама с собой")
        return data

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError(str(e))

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
    task_type = serializers.PrimaryKeyRelatedField(queryset=TaskType.objects.all(), required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        required_fields = ['name', 'process', 'status', 'priority']
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError({field: "Обязательное поле"})
        return data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.task_type:
            data['task_type'] = instance.task_type.id
        return data

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

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'priority', 
                 'start_date', 'end_date', 'budget', 'manager', 'team',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']