from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def sign_in(request):
    return render(request,"sign_in/index.html")

def sign_up(request):
    return render(request,"sign_up/index.html")