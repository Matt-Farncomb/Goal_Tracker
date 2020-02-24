from django.shortcuts import render
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder

from .forms import GoalForm, DeleteForm, InitialEntryForm, TickForm
from .models import Goal

from .helpers import flattenChildren, match_child_with_parent, Goal_Item

import json

def goal(request):

    ### --- For testing/experimenting --- ###
    #json_test = json.dumps(22)
    test_goals = serialize('json', Goal.objects.all())
    ### --------------------------------- ###

    goals_query = Goal.objects.order_by("parent") 
    matched_list = match_child_with_parent(goals_query) 



    flattened_list = []
    
    for child in matched_list:   
        flattened_list = flattenChildren(child, flattened_list)

    context =  {
        "goals":flattened_list,
        "json_test":json.dumps(test_goals),
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
        elif form_name == "tick":
                tick_form = TickForm(posted_form)
                print("ticking")
                if tick_form.is_valid():
                    ticked = tick_form.cleaned_data.get('tick')
                    update = Goal.objects.get(id=ticked)
                    update.completed = True
                    print(f"update: {update}")
                    update.save()
        else:
            # add an extra item to database
            if form_name == "new-goal":
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

    return render(request, 'goals/goal.html', context)