from django.urls import path
from . import views
from django.views.generic.base import RedirectView


urlpatterns = [
    path('', RedirectView.as_view(pattern_name='sign_in', permanent=False)),  
    path("sign_in/",views.sign_in,name ="sign_in"),
    path("sign_up/",views.sign_up,name="sign_up")
]