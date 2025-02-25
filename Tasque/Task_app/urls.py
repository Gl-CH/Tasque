from django.urls import path
from . import views


urlpatterns= [
    path("",views.task_app,name="tasks"),
    path("sign_out/",views.sign_out,name ="sign_out")
]