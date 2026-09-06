"""
Модели данных для приложения Менеджер бизнес-процессов.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
import json

class Department(models.Model):
    """Модель для отделов компании"""
    name = models.CharField(max_length=100, verbose_name="Название отдела")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    
    class Meta:
        verbose_name = "Отдел"
        verbose_name_plural = "Отделы"
        
    def __str__(self):
        return self.name

class Employee(models.Model):
    """Модель для сотрудников компании"""
    ROLE_CHOICES = [
        ('admin', 'Администратор'),
        ('employee', 'Сотрудник'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile', null=True, blank=True)
    name = models.CharField(max_length=100, verbose_name="ФИО")
    position = models.CharField(max_length=100, verbose_name="Должность")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees', verbose_name="Отдел")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee', verbose_name="Роль")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        
    def __str__(self):
        return self.name

class ProcessTemplate(models.Model):
    """Модель для шаблонов бизнес-процессов"""
    name = models.CharField(max_length=200, verbose_name="Название шаблона")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='created_templates', verbose_name="Создатель")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    data = models.JSONField(default=dict, verbose_name="Данные шаблона", help_text="Содержит структуру шаблона в формате JSON")
    
    class Meta:
        verbose_name = "Шаблон процесса"
        verbose_name_plural = "Шаблоны процессов"
        
    def __str__(self):
        return self.name

class Process(models.Model):
    """Модель для конкретных бизнес-процессов"""
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('active', 'Активный'),
        ('completed', 'Завершен'),
        ('cancelled', 'Отменен'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name="Название процесса")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    template = models.ForeignKey(ProcessTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name='processes', verbose_name="Шаблон")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Статус")
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='created_processes', verbose_name="Создатель")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    data = models.JSONField(default=dict, verbose_name="Данные процесса", help_text="Содержит структуру процесса в формате JSON")
    
    class Meta:
        verbose_name = "Процесс"
        verbose_name_plural = "Процессы"
        
    def __str__(self):
        return self.title
    
    def get_tasks(self):
        """Получает все задачи этого процесса"""
        return Task.objects.filter(process=self)

class TaskType(models.Model):
    """Модель для типов задач"""
    name = models.CharField(max_length=100, verbose_name="Название типа задачи")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    
    class Meta:
        verbose_name = "Тип задачи"
        verbose_name_plural = "Типы задач"
        
    def __str__(self):
        return self.name

class Task(models.Model):
    """Модель для задач в бизнес-процессе"""
    STATUS_CHOICES = [
        ('not_started', 'Не начата'),
        ('in_progress', 'В процессе'),
        ('completed', 'Завершена'),
        ('blocked', 'Заблокирована'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
        ('critical', 'Критический'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, verbose_name="Название задачи")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    process = models.ForeignKey(Process, on_delete=models.CASCADE, related_name='tasks', verbose_name="Процесс")
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='tasks', verbose_name="Проект", null=True, blank=True)
    task_type = models.ForeignKey(TaskType, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks', verbose_name="Тип задачи")
    assignee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks', verbose_name="Исполнитель")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started', verbose_name="Статус")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium', verbose_name="Приоритет")
    deadline = models.DateField(null=True, blank=True, verbose_name="Срок выполнения")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    position_x = models.FloatField(default=0, verbose_name="Позиция X")
    position_y = models.FloatField(default=0, verbose_name="Позиция Y")
    
    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"
        
    def __str__(self):
        return self.name
    
    def get_connections(self):
        """Получает все связи, где эта задача является исходной"""
        return TaskConnection.objects.filter(source_task=self)

class TaskConnection(models.Model):
    """Модель для связей между задачами"""
    CONNECTION_TYPES = [
        ('finish_to_start', 'Финиш-Старт'),
        ('start_to_start', 'Старт-Старт'),
        ('finish_to_finish', 'Финиш-Финиш'),
        ('start_to_finish', 'Старт-Финиш'),
    ]
    
    source_task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='outgoing_connections', verbose_name="Исходная задача")
    target_task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='incoming_connections', verbose_name="Целевая задача")
    connection_type = models.CharField(max_length=20, choices=CONNECTION_TYPES, default='finish_to_start', verbose_name="Тип связи")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Связь задач"
        verbose_name_plural = "Связи задач"
        unique_together = ('source_task', 'target_task')
        
    def __str__(self):
        return f"{self.source_task} → {self.target_task}"

class TaskComment(models.Model):
    """Модель для комментариев к задачам"""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments', verbose_name="Задача")
    author = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='task_comments', verbose_name="Автор")
    text = models.TextField(verbose_name="Текст комментария")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Комментарий к задаче"
        verbose_name_plural = "Комментарии к задачам"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Комментарий от {self.author} к задаче {self.task}"

class Notification(models.Model):
    """Модель для уведомлений пользователей"""
    NOTIFICATION_TYPES = [
        ('task_assigned', 'Назначена задача'),
        ('task_deadline', 'Приближается срок задачи'),
        ('task_status_changed', 'Изменен статус задачи'),
        ('task_comment', 'Новый комментарий к задаче'),
        ('process_completed', 'Процесс завершен'),
    ]
    
    recipient = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='notifications', verbose_name="Получатель")
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES, verbose_name="Тип уведомления")
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    message = models.TextField(verbose_name="Сообщение")
    related_task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications', verbose_name="Связанная задача")
    related_process = models.ForeignKey(Process, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications', verbose_name="Связанный процесс")
    is_read = models.BooleanField(default=False, verbose_name="Прочитано")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"
        ordering = ['-created_at']
        
    def __str__(self):
        return self.title

class Project(models.Model):
    STATUS_CHOICES = [
        ('active', 'Активный'),
        ('completed', 'Завершен'),
        ('suspended', 'Приостановлен'),
        ('cancelled', 'Отменен'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
    ]

    title = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='Статус')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium', verbose_name='Приоритет')
    start_date = models.DateField(null=True, blank=True, verbose_name='Дата начала')
    end_date = models.DateField(null=True, blank=True, verbose_name='Дата окончания')
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Бюджет')
    manager = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_projects', verbose_name='Менеджер')
    team = models.ManyToManyField('Employee', related_name='project_team', blank=True, verbose_name='Команда')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['-created_at']

    def __str__(self):
        return self.title