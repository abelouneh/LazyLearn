from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import StudentViewSet 

router = DefaultRouter()
router.register(r'students_api', StudentViewSet) 

urlpatterns = [
    # specific custom paths FIRST
    path('students/add/', views.add_student, name='add_student'),
    path('students/', views.get_students, name='students'),
    path('predict/', views.predict_performance, name='predict'),
    
    # the automatic router LAST
    path('', include(router.urls)),
]