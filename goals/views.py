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
        "goals":Goal.objects.order_by("parent"),
        "json_test":json.dumps(test_goals)
    }

  
    goals_query = Goal.objects.order_by("parent")

    goal_arr = []
    new_model = Goal()
    
    #for e in context["goals"]:
    for model in goals_query:
        #print(e.id)
        """  temp_parent = e.parent_id
        if e.parent_id is not None:
            temp_parent = e.parent_id.id """

        new_model = Goal(
            id=model.id, 
            parent=model.parent,
            hierarchy_id=model.hierarchy_id,
            depth_id=model.depth_id,
            content=model.content
        )
        
        #new_goal = Goal_Item(model=new_model)
        new_goal = Goal_Item(model=model)
 
        """ new_goal = Goal_Item(
            model=new_model,
            id=e.id, 
            parent_id=temp_parent,
            hierarchy_id=e.hierarchy_id,
            depth_id=e.depth_id,
            content=e.content
        ) """
            
        goal_arr.append(new_goal)

    for parent in goal_arr:
        for child in goal_arr:

            temp_parent = child.model.parent
            
            if temp_parent is not None:
                temp_parent = temp_parent.id

            if parent.model.id == temp_parent:  
                #print(222)
                parent.add_child(child)
                
        """ for parent in goal_arr:
        #print(len(parent.children))
        if (len(parent.children)> 0):
            print(f"parent: {parent.model.id}")
            for child in parent.children:
                print(f"      goal: {child.model.id}")  """
 
    new_arr = []
    
    def flattenChildren(child):
        if child not in new_arr:
            new_arr.append(child)
        for e in child.children:
            #print(child.model.id)
            #print(e.model.id)
            if e not in new_arr:
                #print(333)
                flattenChildren(e)
                

    for child in goal_arr:   
        flattenChildren(child)


    context["test"] = new_arr


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
            
            h_id = goal_form.cleaned_data.get('hierarchy_id') + 1
           
            # gets the depth id from depth of clciked on, then indents its depth 1 more
            depth_id = goal_form.cleaned_data.get('depth_id') + 1 
            h_id = count
            count +=1
            new_goal = Goal(content=new_goal, parent=test_obj, hierarchy_id=h_id, depth_id=depth_id)
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

    def __init__(self, model):
        self.model = model
        self.children = []

    def add_child(self, child):
        self.children.append(child)

class Goal_Item_Old:

    def __init__(self, model, id, parent, hierarchy_id, depth_id, content):
        self.model = model
        self.id = id
        self.parent = parent
        self.children = []
       
        self.hierarchy_id = hierarchy_id
        self.depth_id = depth_id
        self.content = content
        

    def add_child(self, child):
        self.children.append(child)
            