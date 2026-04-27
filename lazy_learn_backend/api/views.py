from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, PerformanceMetric
from .serializers import StudentSerializer
from .models import Student
import joblib
import os
from django.conf import settings
from django.contrib.auth.models import User

# 1. Standard CRUD for Students
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

# 2. Load the AI Brain
try:
    model_path = os.path.join(settings.BASE_DIR, 'api', 'lazy_learn_model.pkl')
    ai_model = joblib.load(model_path)
except Exception as e:
    ai_model = None
    print("WARNING: AI model not found. Did you move the .pkl file to the api folder?")

# 3. The Prediction Endpoint

@api_view(['POST'])
def predict_performance(request):
    try:
        # Grab data from the frontend request
        student_id = request.data.get('student_id')
        study_hours = float(request.data.get('study_hours_per_week'))
        attendance = float(request.data.get('attendance_percentage'))
        quiz_avg = float(request.data.get('previous_quiz_avg'))

        # Ask the AI to predict (1 = Pass, 0 = Fail)
        prediction = ai_model.predict([[study_hours, attendance, quiz_avg]])[0]
        
        # Save this new metric and prediction to the database
        student = Student.objects.get(id=student_id)
        metric = PerformanceMetric.objects.create(
            student=student,
            study_hours_per_week=study_hours,
            attendance_percentage=attendance,
            previous_quiz_avg=quiz_avg,
            ai_prediction=bool(prediction)
        )
        
        return Response({
            'message': 'AI Prediction Complete',
            'prediction': 'Pass' if prediction == 1 else 'Fail',
            'metric_id': metric.id
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_students(request):
    # Grab all students from the database
    students = Student.objects.all()
    # Format them into a simple list of dictionaries
    student_list = [
        {"id": student.id, "name": f"{student.first_name} {student.last_name}"}
        for student in students
    ]
    return Response(student_list)

@api_view(['POST'])
def add_student(request):
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    
    # grabs first available teacher in the database
    default_teacher = User.objects.first()
    
    # Creates the student using the actual teacher object, not a hardcoded ID
    student = Student.objects.create(
        first_name=first_name,
        last_name=last_name,
        teacher=default_teacher 
    )
    
    return Response({
        "id": student.id, 
        "name": f"{student.first_name} {student.last_name}"
    })