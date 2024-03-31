from django.shortcuts import render
from django.http import HttpResponse
from quiz.customFiles.quiz import get_quiz
import re
from django.http import JsonResponse
# Create your views here.

def index(request):
    quiz= get_quiz()

# Define the regex pattern to match question patterns


    pattern = r'[a-zA-Z ]+'


    words=[]

    for char in quiz:
     words.append(char)
     
    # print(words)
    
# Extract all matching questions using re.findall
    questions = re.findall(pattern,quiz, re.DOTALL)
    # choice_pattern = re.findall(choices,quiz,re.DOTALL)

    questions_html = '<br>'.join(questions)
    print("Received Questions")

    

    return JsonResponse(questions,safe=False)


