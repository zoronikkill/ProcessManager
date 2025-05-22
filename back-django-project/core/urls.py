from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import ProjectViewSet, EmployeeViewSet

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
]