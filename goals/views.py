from django.shortcuts import render
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder

from .forms import GoalForm, DeleteForm
from .models import Goal


import json

""" class Item:
    def __init__(self, id, arr_of_items):
        self.id = id
        self.arr_of_items = arr_of_items """
count = 0

def goal(request):

    global count

    #json_test = json.dumps(22)
    test_goals = serialize('json', Goal.objects.all())
    context =  {
        #"goals":["kill all orcs", "don't die"]
        "goals":Goal.objects.order_by("parent_id"),
        "json_test":json.dumps(test_goals)
    }

  
    goals = Goal.objects.order_by("parent_id")

    goal_arr = []

    

    for e in context["goals"]:
        #print(e.id)
        new_goal = Goal_Item(e.id, e.parent_id)
        goal_arr.append(new_goal)

    for parent in goal_arr:
        for child in goal_arr:
            if parent.goal_id == child.parent_id:
                parent.add_child(child)
                #print(f" goal: {parent.goal_id}, parent:{child.parent_id}")
        
    for parent in goal_arr:
        if (len(parent.children)> 0):
            print(f"parent: {parent.goal_id}")
            for child in parent.children:
                print(f" goal: {child.goal_id}")

    


 


    """     base_item = Item(0, [])
    for e in context["goals"]:
        new_item = Item(e.pk, [])
        for x in context["goals"]:
            if e.pk == x.parent_id:
                new_item.arr_of_items.append(x.parent_id) """

    # assign each goal and its goal id to its parent id
    """ for e in context["goals"]:
        item = {
            "id": e.pk,
            "content":e.content,
            "h_id":count
        }
        count += 1

        ordered_context["goals"].setdefault(e.parent_id,[]).append(item)
        #print(ordered_context) """ 

    if request.method == 'POST':

        goal_form = GoalForm(request.POST)
        delete_form = DeleteForm(request.POST)

        if goal_form.is_valid():
            new_goal = goal_form.cleaned_data.get('new_goal')
            parent_id = goal_form.cleaned_data.get('parent_id')

            test_obj = ""

            for e in context["goals"]:
                if e.id == parent_id:
                    test_obj = e
                    break
            
            h_id = goal_form.cleaned_data.get('hierarchy_id') + 1
           
            # gets the depth id from depth of clciked on, then indents its depth 1 more
            depth_id = goal_form.cleaned_data.get('depth_id') + 1 
            h_id = count
            count +=1
            new_goal = Goal(content=new_goal, parent_id=test_obj, hierarchy_id=h_id, depth_id=depth_id)
            new_goal.save()
        elif delete_form.is_valid():
            unwanted_goal_id = delete_form.cleaned_data.get('delete')
            Goal.objects.filter(id=unwanted_goal_id).delete()
        else:
            print(goal_form.errors)
    #print(context)
    #print(ordered_context)
    #print("bob bob bob bob bob bob tebobst bob")
    return render(request, 'goals/goal.html', context)


#hierarchy_id should be in the order top to bottom of the current depth

#to make a new h_id, you have to iterate through everything and look for all thingies with the same parent id
# then count them and this new one gets the length +1 as its h id.

class Goal_Item:

    def __init__(self, goal_id, parent_id):
        self.goal_id = goal_id
        self.parent_id = parent_id
        self.children = []

    def add_child(self, child):
        self.children.append(child)