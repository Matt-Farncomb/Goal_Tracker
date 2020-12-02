from django.shortcuts import render, get_object_or_404, redirect
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.core import serializers
from django.forms.models import model_to_dict  
from django.http import HttpResponse, JsonResponse

from .forms import GoalForm, DeleteForm, InitialEntryForm, TickForm
from .models import Goal
from .helpers import flattenChildren, match_child_with_parent, Goal_Item, get_children
import json
             

def goal(request):

    # when goals are closed or opened
    if request.is_ajax() and request.method == "POST":

        data = json.loads(request.POST.get('data'))
        hidden = data["hidden"]
        to_hide = Goal.objects.get(id=data["child_id"])
        to_close = Goal.objects.get(id=data["parent_id"])

        to_hide.hidden = hidden
        to_close.closed = hidden

        to_hide.save()
        to_close.save()

        return HttpResponse(status=204)

    else:
        ### --- For testing/experimenting --- ###
        #json_test = json.dumps(22)
        test_goals = serialize('json', Goal.objects.all())
        ### --------------------------------- ###

        goals_query = Goal.objects.order_by("parent") 
        matched_list = match_child_with_parent(goals_query) 

        flattened_list = []
        
        # get a list of all goals in the order they will be on the DOM
        for child in matched_list:   
            flattened_list = flattenChildren(child, flattened_list)

        context =  {
            "goals":flattened_list,
            "json_test":json.dumps(test_goals)
        }
         
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

                    new_goal = Goal(content=new_goal, parent=parent, depth_id=depth_id)
                    new_goal.save()

            return redirect(goal)
                
        return render(request, 'goals/goal.html', context)

# user can request a goal by its id and receive all its info and its children and their info and children
# NOTE: Must use a backslash at end of api_test
# To remove slashes, you must parse it, slashes should be there as they are part of the json object
def api(request, id):
    children = get_children(id, [])
    data = { f"children_of_{id}" : children }
    return JsonResponse(data) 