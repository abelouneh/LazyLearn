from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    # The teacher who oversees this student
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    enrollment_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class PerformanceMetric(models.Model):
    # Links the metric to a specific student
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='metrics')
    study_hours_per_week = models.IntegerField()
    attendance_percentage = models.IntegerField()
    previous_quiz_avg = models.DecimalField(max_digits=5, decimal_places=2)
    
    # 1 for Pass, 0 for Fail
    ai_prediction = models.BooleanField(null=True, blank=True) 
    date_recorded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Metrics for {self.student} on {self.date_recorded.strftime('%Y-%m-%d')}"