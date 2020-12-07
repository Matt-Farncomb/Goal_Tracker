from django import forms

# from django.contrib.auth.forms import UserCreationForm

# class UserForm(UserCreationForm):
#     email = forms.EmailField(required=True)
#     class Meta:
#         # model = User
#         fields = ['username', 'password', 'first_name', 'last_name', 'email']

class InitialEntryForm(forms.Form):
    first_goal = forms.CharField(label='first_goal', max_length=100)

class GoalForm(forms.Form):
    new_goal = forms.CharField(label='new_goal', max_length=100)
    parent = forms.IntegerField(required=False, label='parent')
    depth_id = forms.IntegerField(label='depth_id') 

class DeleteForm(forms.Form):
    delete = forms.CharField(label='delete', max_length=100)

class TickForm(forms.Form):
    tick = forms.CharField(label="tick", max_length=100)

class LoginForm(forms.Form):
    username = forms.CharField(label="username", max_length=20)
    password = forms.CharField(label="password", max_length=20)

class RegisterForm(forms.Form):
    username = forms.CharField(label="username", max_length=20)
    password = forms.CharField(label="passowrd", max_length=20)
    firstname = forms.CharField(label="firstname", max_length=20)
    lastname = forms.CharField(label="lastname", max_length=20)
