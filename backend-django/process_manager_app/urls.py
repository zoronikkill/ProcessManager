"""
URL-маршруты для Django REST framework API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.views.generic import RedirectView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Создаем роутер
router = DefaultRouter()
router.register(r'departments', views.DepartmentViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'task-types', views.TaskTypeViewSet)
router.register(r'process-templates', views.ProcessTemplateViewSet)
router.register(r'processes', views.ProcessViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'task-connections', views.TaskConnectionViewSet, basename='task-connection')
router.register(r'task-comments', views.TaskCommentViewSet)
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'users', views.UserViewSet)

# Создаем корневое представление API с разрешением для всех
@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    return Response({
        'departments': reverse('department-list', request=request, format=format),
        'employees': reverse('employee-list', request=request, format=format),
        'task-types': reverse('tasktype-list', request=request, format=format),
        'process-templates': reverse('processtemplate-list', request=request, format=format),
        'processes': reverse('process-list', request=request, format=format),
        'tasks': reverse('task-list', request=request, format=format),
        'task-connections': reverse('taskconnection-list', request=request, format=format),
        'task-comments': reverse('taskcomment-list', request=request, format=format),
        'notifications': reverse('notification-list', request=request, format=format),
    })

urlpatterns = [
    # Корневой маршрут API
    path('', api_root, name='api-root'),
    
    # Включаем URL-маршруты роутера
    path('', include(router.urls)),
    
    # Дополнительные маршруты
    path('task-types/', views.TaskTypeListCreate.as_view()),
    
    # Маршруты аутентификации JWT
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/auth/register/', views.RegisterView.as_view(), name='register'),
    path('api/auth/me/', views.CurrentUserView.as_view(), name='current_user'),
    
    # REST framework авторизация
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