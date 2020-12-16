from django.shortcuts import render, get_object_or_404, redirect
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.core import serializers
from django.forms.models import model_to_dict  
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.urls import reverse
# from django.contrib.auth.models import User as DjangoUser

from .forms import GoalForm, DeleteForm, InitialEntryForm, TickForm, LoginForm, RegisterForm, EditForm, max_goal_length, TempGoalForm
from .models import Goal, UserProfile
from .helpers import flattenChildren, match_child_with_parent, Goal_Item, get_children
import json 


def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        # print("valid")
        # username = form.cleaned_data.get('username')
        # password = form.cleaned_data.get('password')
        # firstname = form.cleaned_data.get('firstname')
        # lastname = form.cleaned_data.get('lastname')

        new_user = UserProfile.objects.create_user(
            username =form.cleaned_data.get('username'),
            password = form.cleaned_data.get('password'),
            first_name = form.cleaned_data.get('firstname'),
            last_name = form.cleaned_data.get('lastname'),
            # firstname = form.cleaned_data.get('firstname'),
            # lastname = form.cleaned_data.get('lastname')
        )
        
        new_user.save()




        # print(f"username: {username} password: {password} firstname: {firstname} lastname: {lastname}")

        # new_user = User(
        #     username=username, password=password, 
        #     firstname=firstname, lastname=lastname
        #     )
        # new_user.save()
        
        
        return redirect(login, message="success")
    else:
        print("invalid")

    context = { 
            "message": "Welcome!",
            "submit_label": "Register"
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
            return redirect(home)
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


def home(request):

    global max_goal_length

    # when goals are closed or opened
    if request.is_ajax() and request.method == "POST":

        
        if (request.POST.get('edit_data') != None):
            data = json.loads(request.POST.get('edit_data'))
            _id = data["id"]
            edited_gaol = data["goal"]
            update = Goal.objects.get(id=_id)
            update.content = edited_gaol
            update.save()
        elif (request.POST.get('data') != None):
            data = json.loads(request.POST.get('data'))
            hidden = data["hidden"]
            to_hide = Goal.objects.get(id=data["child_id"])
            to_close = Goal.objects.get(id=data["parent_id"])

            to_hide.hidden = hidden
            to_close.closed = hidden

            to_hide.save()
            to_close.save()

        return HttpResponse(status=204)

    elif request.method == "GET" and not request.user.is_authenticated:
        return redirect(login)
    else:
        goals_query = Goal.objects.filter(user_id=request.user.id ).order_by("parent") 
        matched_list = match_child_with_parent(goals_query) 

        flattened_list = []
        
        # get a list of all goals in the order they will be on the DOM
        for child in matched_list:   
            flattened_list = flattenChildren(child, flattened_list)

        context =  {
            "username": request.user,
            "goals":flattened_list,
            "max_goal_length":max_goal_length
        }

        if "scroll" in request.session and request.session["scroll"] != None:
            context["scroll"] = request.session["scroll"]
            request.session["scroll"] = None;
            print(context["scroll"])

         
        if request.method == 'POST':
            #initital values
            parent = None
            depth_id = 1  
            posted_form = request.POST
            form_name = posted_form.get('name')
            
            # delete selected item from database
            if form_name == "delete":
                delete_form = DeleteForm(posted_form)
                if delete_form.is_valid():
                    unwanted_goal_id = delete_form.cleaned_data.get('delete')
                    Goal.objects.filter(id=unwanted_goal_id).delete()
            # mark ticked item as complete
            elif form_name == "tick":
                    tick_form = TickForm(posted_form)
                    if tick_form.is_valid():
                        ticked = tick_form.cleaned_data.get('tick')
                        update = Goal.objects.get(id=ticked)
                        update.completed = True
                        update.save()
            elif form_name == "un-tick":
                print("un ticking")
                tick_form = TickForm(posted_form)
                if tick_form.is_valid():
                    print("valid un ticking")
                    ticked = tick_form.cleaned_data.get('tick')
                    print(ticked)
                    update = Goal.objects.get(id=ticked)
                    update.completed = False
                    update.save()
            elif form_name == "add-temp":
                temp_goal = TempGoalForm(posted_form)
                print("before")
                print(temp_goal)
                if temp_goal.is_valid():
                    print("after")
                    cleaned = temp_goal.cleaned_data
                    print(cleaned)
                    parent_id = cleaned.get("parent")
                    depth_id = cleaned.get("depth_id") + 1
                    temp_string = "New Goal Placeholder"

                    yPos = cleaned.get("scrollYpos")
                    xPos = cleaned.get("scrollXpos")
                    
                    scroll_pos = { 
                        "xPos": xPos , 
                        "yPos": yPos,
                        "parent":parent_id
                        }
                    request.session["scroll"] = scroll_pos
                    # print(parent_id)
                    for e in context["goals"]:
                        if e.goal.id == parent_id:
                            parent = e.goal
                            break

                    temp = Goal(content=temp_string, parent=parent, depth_id=depth_id, user_id=request.user.id)

                    temp.save()
                    temp_goal = Goal.objects.order_by('-id')[0]
                    scroll_pos["id"] = temp_goal.id
                    

            elif form_name == "edit-goal":
                edit_form = EditForm(posted_form)
                if edit_form.is_valid():
                    print(edit_form.cleaned_data)
                    _id = edit_form.cleaned_data.get('id')
                    new_goal = edit_form.cleaned_data.get('new_goal')
                    update = Goal.objects.get(id=_id)
                    update.content = new_goal
                    update.save()
            elif form_name == "new-goal":
                # add an extra item to database
                goal_form = GoalForm(posted_form)
                if goal_form.is_valid():
                    new_goal = goal_form.cleaned_data.get('new_goal')
                    parent_id = goal_form.cleaned_data.get('parent')
                    # gets the depth id from depth of clicked on, then indents its depth 1 more
                    depth_id = goal_form.cleaned_data.get('depth_id') + 1 
                    
                    for e in context["goals"]:
                        if e.goal.id == parent_id:
                            parent = e.goal
                            break

                    new_goal = Goal(content=new_goal, parent=parent, depth_id=depth_id, user_id=request.user.id)
                    new_goal.save()

            return redirect(home)
     
        return render(request, 'goals/goal.html', context)

# user can request a goal by its id and receive all its info and its children and their info and children
# NOTE: Must use a backslash at end of api_test
# To remove slashes, you must parse it, slashes should be there as they are part of the json object
def api(request, id):
    children = get_children(id, [])
    data = { f"children_of_{id}" : children }
    return JsonResponse(data) 