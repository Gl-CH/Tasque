import re
from django.urls import reverse
from django.shortcuts import redirect
from Task_app.models import List


class LoginRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        signin_path = reverse('sign_in')
        signup_path = reverse('sign_up')

        logged_in = request.user.is_authenticated

        # Check if the URL is a task list URL (with dynamic list_id)
        task_list_pattern = re.compile(r'^/tasks/\d+/')  # Adjust the regex to match your task list URL pattern

        # 1. If logged in and trying to access login or signup, redirect to tasks
        if logged_in and request.path in [signin_path, signup_path]:
            if request.user.userprofile.last_used_list != None:
                return redirect(reverse('lists', args=[request.user.userprofile.last_used_list.id]))  # redirect to a valid task list
            else:
                key = List.objects.filter(user = request.user.id).first()
                return redirect(reverse('lists', args=[key.id]))
        # 2. If not logged in and trying to access a task list, redirect to the home page
        if not logged_in and task_list_pattern.match(request.path):
            return redirect("home")

        return self.get_response(request)
