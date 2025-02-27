from django.shortcuts import render,redirect
from django.http import HttpResponse
from .forms import Signin_Form
from .forms import Signup_Form
from django.contrib import messages
from django.contrib.auth import authenticate,login

# Create your views here.

def sign_in(request):
    form = Signin_Form()
    if request.method == "POST":
        form = Signin_Form(request.POST)
        if form.is_valid():
            username = request.POST.get("username")
            password = request.POST.get("password")
            user = authenticate(request,username=username,password=password)
            if user is not None:
                login(request,user)
                return redirect("tasks")
            else:
                form.add_error(None, "Invalid Login Details")
    return render(request,"sign_in/index.html",{'form':form})

def sign_up(request):
    form = Signup_Form()
    if request.method == "POST":
        form = Signup_Form(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,"Account created please login")
            return redirect("sign_in")
    return render(request,"sign_up/index.html",{'form':form})