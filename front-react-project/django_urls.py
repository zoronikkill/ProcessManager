"""
URL-маршруты для Django REST framework API.
Эти маршруты должны быть добавлены в файл urls.py вашего Django-приложения.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'departments', views.DepartmentViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'task-types', views.TaskTypeViewSet)
router.register(r'process-templates', views.ProcessTemplateViewSet)
router.register(r'processes', views.ProcessViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'task-connections', views.TaskConnectionViewSet)
router.register(r'task-comments', views.TaskCommentViewSet)
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]

# Также нужно добавить эти маршруты в основной urls.py проекта:
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('process_manager_app.urls')),  # Замените 'process_manager_app' на имя вашего приложения
]
"""