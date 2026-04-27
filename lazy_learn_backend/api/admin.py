from django.contrib import admin
from .models import Student, PerformanceMetric

admin.site.register(Student)
admin.site.register(PerformanceMetric)