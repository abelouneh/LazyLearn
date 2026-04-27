from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views
from .views import StudentViewSet 

router = DefaultRouter()
router.register(r'students_api', StudentViewSet) 

urlpatterns = [
    # --- Authentication URLs ---
    path('register/', views.register_user, name='register'),
    path('login/', obtain_auth_token, name='login'), # Django's built-in login door!

    # --- App URLs ---
    path('students/add/', views.add_student, name='add_student'),
    path('students/delete/<int:pk>/', views.delete_student, name='delete_student'),
    path('students/', views.get_students, name='students'),
    path('predict/', views.predict_performance, name='predict'),
    
    path('', include(router.urls)),
]