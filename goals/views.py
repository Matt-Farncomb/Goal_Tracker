from django.shortcuts import render
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder

from .forms import GoalForm, DeleteForm
from .models import Goal

import json

# Recursively iterates through child and all its children's children
# Adds them all to list and returns it
# This achieves the correct tree like structure
def flattenChildren(child, flattened_list):
    if child not in flattened_list:
        flattened_list.append(child)
    # if the flattened doesn't already contain current child's child, call func
    for e in child.children:
        if e not in flattened_list:
            flattenChildren(e, flattened_list)
    return flattened_list

# match each parent from the query with all its children
# adds each child to the list of its parent
def match_child_with_parent(query):
    # fill goal_arr with all the Goal_Items within goals_query
    goal_arr = [Goal_Item(goal=goal) for goal in query]

    for parent in goal_arr:
        for child in goal_arr:

            temp_parent = child.goal.parent
            
            if temp_parent is not None:
                temp_parent = temp_parent.id

            if parent.goal.id == temp_parent:  
                parent.add_child(child)

    return goal_arr


def goal(request):

    ### --- For testing/experimenting --- ###
    #json_test = json.dumps(22)
    test_goals = serialize('json', Goal.objects.all())
    ### --------------------------------- ###

    flattened_list = []

    goals_query = Goal.objects.order_by("parent") 
    matched_list = match_child_with_parent(goals_query)   

    for child in matched_list:   
        flattened_list = flattenChildren(child, flattened_list)

    context =  {
        "goals":Goal.objects.order_by("parent"),
        "json_test":json.dumps(test_goals),
        "test":flattened_list
    }

    if request.method == 'POST':

        goal_form = GoalForm(request.POST)
        delete_form = DeleteForm(request.POST)

        if goal_form.is_valid():
            new_goal = goal_form.cleaned_data.get('new_goal')
            parent = goal_form.cleaned_data.get('parent')

            test_obj = ""

            for e in context["goals"]:
                if e.id == parent:
                    test_obj = e
                    break
                       
            # gets the depth id from depth of clicked on, then indents its depth 1 more
            depth_id = goal_form.cleaned_data.get('depth_id') + 1 
            new_goal = Goal(content=new_goal, parent=test_obj, depth_id=depth_id)
            new_goal.save()
        elif delete_form.is_valid():
            unwanted_goal_id = delete_form.cleaned_data.get('delete')
            Goal.objects.filter(id=unwanted_goal_id).delete()
        else:
            print(goal_form.errors)
    return render(request, 'goals/goal.html', context)

class Goal_Item:

    def __init__(self, goal):
        self.goal = goal
        self.children = []

    def add_child(self, child):
        self.children.append(child)           