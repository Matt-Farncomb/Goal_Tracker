from django.shortcuts import render, get_object_or_404, redirect
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.core import serializers
from django.forms.models import model_to_dict  
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.password_validation  import validate_password
from django.urls import reverse
# from django.contrib.auth.models import User as DjangoUser
from django.views import View
from .forms import GoalForm, DeleteForm, InitialEntryForm, TickForm, LoginForm, RegisterForm, EditForm, max_goal_length, TempGoalForm, CloseForm
from .models import Goal, UserProfile
# from .helpers import flattenChildren, match_child_with_parent, Goal_Item, get_children, str_to_bool
import json 
from .helpers import *


# def handler404(request, exception):
#     return render(request, '404.html', status=404)

class Register(View):

    def get(self, request):
        context = { 
            "message": "Welcome!",
            "submit_label": "Register"
        }
        return render(request, 'goals/register.html', context)

    def post(self, request):
        form = RegisterForm(request.POST)
        if not form.is_valid():
            context = {
                "message": "Invalid user data. Please try again",
                "submit_label":"Register"
            }
            return render(request, 'goals/register.html', context)
        else: 
            cleaned = form.cleaned_data
            username = cleaned.get('username')
            firstname = cleaned.get('firstname')
            lastname = cleaned.get('lastname')
            password = cleaned.get('password')

            try:
                validate_password(password)
            except Exception as exception:
                exceptions = list(exception)
                context = {
                    "form":cleaned,
                    "message": exceptions[0],
                    "submit_label":"Register"
                }

                return render(request, 'goals/register.html', context)

            new_user, created = UserProfile.objects.get_or_create(
                username = username,
                defaults = { "first_name":firstname, "last_name":lastname }
            )

            if created:
                new_user.set_password(password)
                new_user.save()
                return redirect(login, message="success")
            else:
                context = {
                    "form":cleaned,
                    "message": "Username already exists",
                    "submit_label":"Register"
                }
                return render(request, 'goals/register.html', context)


def auth(request, context):
    form = LoginForm(request.POST)
    if form.is_valid():
        username = form.cleaned_data.get("username");
        password = form.cleaned_data.get("password");
        user = authenticate(username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect("home")
        else:
            context = { 
                "message": "Wrong username or password!",
                "submit_label": "login"
            } 
    return render(request, 'goals/login.html', context)

def login(request, message=None):

    context = { 
        "message": "Welcome!",
        "submit_label": "Login"
    }

    if message != None:
        context["message"] = "Successfuly registered"

    return auth(request, context)

def logout(request):
    auth_logout(request)
    context = { 
        "message": "You have been logged out",
        "submit_label": "login"
    }
    return auth(request, context)

# def validate_form(form):
#     if form.is_valid():
#         return form.cleaned_data

# def ordered_goals(user_id):
#     goals_query = Goal.objects.filter(user_id=user_id ).order_by("parent") 
#     matched_list = match_child_with_parent(goals_query) 

#     flattened_list = []
    
#     # get a list of all goals in the order they will be on the DOM
#     for child in matched_list:   
#         flattened_list = flattenChildren(child, flattened_list)

#     return flattened_list

# def create_home_context(request, max_goal_length):
#     context =  {
#         "username": request.user,
#         "goals":ordered_goals(request.user.id),
#         "max_goal_length":max_goal_length
#     }

#     return context


class Home(View):

    def get(self, request):
        if not request.user.is_authenticated:
            return redirect(login)
        else:
            context = create_home_context(request, max_goal_length)
            if "scroll" in request.session and request.session["scroll"] != None:
                context["scroll"] = request.session["scroll"]
                request.session["scroll"] = None;
        return render(request, 'goals/goal.html', context)

    def post(self, request):

        # global max_goal_length
        posted_form = request.POST
        # print(posted_form)
        form_name = posted_form.get('name')
        
        if request.is_ajax():
            if form_name == "edit-goal":
                process_edit_form(posted_form)
            if form_name == "closeForm":
                process_close_form(posted_form)
            return HttpResponse(status=204)
        else:
            context = create_home_context(request, max_goal_length)
            if form_name == "delete":
                process_delete_form(posted_form, request)
            # mark ticked item as complete
            elif form_name == "tick":
                process_tick_form(posted_form, request, is_ticked=True)
            elif form_name == "un-tick":
                process_tick_form(posted_form, request, is_ticked=False)
            elif form_name == "add-temp":
                process_temp_form(posted_form, context, request)
            elif form_name == "new-goal":
                process_goal_form(posted_form, context, request, None)

            return redirect("home")
            
  


# def UpdateGoals(request):
    
#     def post(self, request):
#         if request.is_ajax():


# def home(request):

#     global max_goal_length

#     if request.method == "GET" and not request.user.is_authenticated:
#         return redirect(login)

#     elif request.is_ajax() and request.method == "POST":     

#         posted_form = request.POST
#         form_name = posted_form.get('name')

#         if form_name == "edit-goal":
#             process_edit_form(posted_form)
#         if form_name == "closeForm":
#             process_close_form(posted_form)

#         return HttpResponse(status=204)

#     else:

#         context = create_home_context(request)

#         if request.method == 'GET':
#             if "scroll" in request.session and request.session["scroll"] != None:
#                 context["scroll"] = request.session["scroll"]
#                 request.session["scroll"] = None;
         
#         if request.method == 'POST':
#             #initital values
#             parent = None
#             depth_id = 1  
#             posted_form = request.POST
#             form_name = posted_form.get('name')
#             # delete selected item from database
#             if form_name == "delete":
#                 process_delete_form(posted_form)
#             # mark ticked item as complete
#             elif form_name == "tick":
#                 process_tick_form(posted_form, request, is_ticked=True)
#             elif form_name == "un-tick":
#                 process_tick_form(posted_form, request, is_ticked=False)
#             elif form_name == "add-temp":
#                 process_temp_form(posted_form, context, request)
#             elif form_name == "new-goal":
#                 process_goal_form(posted_form, context, request, parent)

#             return redirect(home)
     
#         return render(request, 'goals/goal.html', context)

# user can request a goal by its id and receive all its info and its children and their info and children
# NOTE: Must use a backslash at end of api_test
# To remove slashes, you must parse it, slashes should be there as they are part of the json object
def api(request, id):
    children = get_children(id, [])
    data = { f"children_of_{id}" : children }
    return JsonResponse(data) 