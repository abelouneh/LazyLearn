from rest_framework import serializers
from .models import Student, PerformanceMetric

class PerformanceMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceMetric
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    metrics = PerformanceMetricSerializer(many=True, read_only=True)
    class Meta:
        model = Student
        fields = '__all__'