from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib.auth import logout

# Create your views here.


def task_app(request):
    return render(request,"tasks/index.html")


def sign_out(request):
    logout(request)
    return redirect("sign_in")