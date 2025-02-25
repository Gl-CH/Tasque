from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib.auth import logout

# Create your views here.


def home(request):
    logout(request)
    return render(request,"home/index.html")