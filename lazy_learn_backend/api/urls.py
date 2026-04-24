from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, predict_performance

router = DefaultRouter()
router.register(r'students', StudentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('predict/', predict_performance, name='predict_performance'),
]