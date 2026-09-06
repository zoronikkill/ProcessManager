from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.views.generic import View
from django.utils.decorators import method_decorator
from process_manager_app.views import LoginView, LogoutView, UserView, RegisterView

class CSRFTokenView(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return JsonResponse({'detail': 'CSRF cookie set'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/csrf/', CSRFTokenView.as_view(), name='csrf'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/user/', UserView.as_view(), name='user'),
    path('api/', include('process_manager_app.urls')),  # Включаем URL-маршруты из нашего приложения
]

# Добавляем URL-маршруты для статических и медиа-файлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)