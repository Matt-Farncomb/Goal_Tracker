from django.shortcuts import render

from .forms import GoalForm
from .models import Goal

""" class Item:
    def __init__(self, id, arr_of_items):
        self.id = id
        self.arr_of_items = arr_of_items """
count = 0

def goal(request):
    
    global count

    context =  {
        #"goals":["kill all orcs", "don't die"]
        "goals":Goal.objects.order_by("hierarchy_id")
        #"goals":Goal.objects.order_by('hierarchy')
    }

    ordered_context = {
        "goals":{}
    }

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
        form = GoalForm(request.POST)   
        if form.is_valid():
            new_goal = form.cleaned_data.get('new_goal')
            parent_id = form.cleaned_data.get('parent_id')
            #h_id = form.cleaned_data.get('hierarchy_id')
           
            # gets the depth id from depth of clciked on, then indents its depth 1 more
            depth_id = form.cleaned_data.get('depth_id') + 1 
            h_id = count
            count +=1
            new_goal = Goal(content=new_goal, parent_id=parent_id, hierarchy_id=h_id, depth_id=depth_id)
            new_goal.save()
        else:
            print(form.errors)
    print(context)
    #print(ordered_context)
    return render(request, 'goals/goal.html', context)


#hierarchy_id should be in the order top to bottom of the current depth

#to make a new h_id, you have to iterate through everything and look for all thingies with the same parent id
# then count them and this new one gets the length +1 as its h id.