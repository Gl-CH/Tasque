from django.shortcuts import redirect
from django.urls import reverse

class LoginRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Define important paths
        signin_path = reverse('sign_in')
        signup_path = reverse('sign_up')
        tasks_path = reverse('lists',args=[2])
        logged_in = request.user.is_authenticated 


        # 1. If logged in and trying to access login or signup, redirect to tasks
        if logged_in and request.path in [signin_path, signup_path]:
            return redirect(tasks_path)

        if not logged_in and request.path == tasks_path:
            return redirect("home")

        return self.get_response(request)