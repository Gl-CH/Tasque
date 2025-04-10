from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class Signin_Form(forms.Form):  # No underscore in class name (PEP 8 style)
	username = forms.CharField(
		max_length=150, 
		label="username", 
		widget=forms.TextInput(attrs={"class": "input-forms","placeholder":"Username"})
	)
	password = forms.CharField(
		label="password", 
		widget=forms.PasswordInput(attrs={"class": "input-forms","placeholder":"Password"})
	)

class Signup_Form(UserCreationForm):

    class Meta:
        model = User
        fields = ["username","email","password1","password2"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs["placeholder"] = "Enter your username"
        self.fields["email"].widget.attrs["placeholder"] = "Enter your email"
        self.fields["password1"].widget.attrs["placeholder"] = "Enter your password"
        self.fields["password2"].widget.attrs["placeholder"] = "Confirm your password"
        for field in self.fields:
            self.fields[field].widget.attrs.update({
                    "class": "input-forms", 
            })