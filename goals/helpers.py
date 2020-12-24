from django.forms.models import model_to_dict
from .models import Goal
from .forms import *

class Goal_Item:

    def __init__(self, goal):
        self.goal = goal
        self.children = []

    def add_child(self, child):
        self.children.append(child)   

# Recursively iterates through child and all its children's children
# Adds them all to list and returns it
# This achieves the correct tree like structure
def flattenChildren(child, flattened):
    if child not in flattened:
        flattened.append(child)
    # if the flattened doesn't already contain current child's child, call func
    for e in child.children:
        if e not in flattened:
            flattenChildren(e, flattened)
    return flattened

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
                # all children will be ticked or un ticked
                if parent.goal.completed == True:
                   child.goal.completed = True
                # This is so when I do an untick, it will set them back to what thye were before, the val in the DB
                parent.add_child(child)

    return goal_arr

# recursively fetch each child of the child
def get_children(id, children):
    query = Goal.objects.filter(parent=id)
    for e in query:
        children.append(
            { 
                "goal": model_to_dict(e),
                "children":get_children(e.id, [])
            }
        )
    return children

def str_to_bool(string):
    return True if string == "true" else False

def validate_form(form):
    if form.is_valid():
        return form.cleaned_data

def ordered_goals(user_id):
    goals_query = Goal.objects.filter(user_id=user_id ).order_by("parent") 
    matched_list = match_child_with_parent(goals_query) 

    flattened_list = []
    
    # get a list of all goals in the order they will be on the DOM
    for child in matched_list:   
        flattened_list = flattenChildren(child, flattened_list)

    return flattened_list

def create_home_context(request, max_goal_length):
    context =  {
        "username": request.user,
        "goals":ordered_goals(request.user.id),
        "max_goal_length":max_goal_length
    }

    return context

def process_edit_form(posted_form):
    cleaned = validate_form(EditForm(posted_form))
    _id = cleaned.get('id')
    new_goal = cleaned.get('new_goal')
    update = Goal.objects.get(id=_id)
    update.content = new_goal
    update.save()

def process_close_form(posted_form):
    cleaned = validate_form(CloseForm(posted_form)) 
    child_ids = cleaned.get("child_id").split(",")
    parent_ids = cleaned.get("parent_id").split(",")
    hide = cleaned.get("hidden")
    print(parent_ids)
    for e in child_ids:
        # print(f"hide: {e}")
        to_hide = Goal.objects.get(id=e)
        to_hide.hidden = str_to_bool(hide)
        to_hide.save()
    for e in parent_ids:
        # print(f"close: {e}")
        to_close = Goal.objects.get(id=e)
        to_close.closed = str_to_bool(hide)
        to_close.save()


def process_delete_form(posted_form, request):
    cleaned = validate_form(DeleteForm(posted_form))
    unwanted_goal_id = cleaned.get('delete')
    yPos = cleaned.get("scrollYpos")
    xPos = cleaned.get("scrollXpos")
    scroll_pos = { "xPos": xPos, "yPos": yPos }
    request.session["scroll"] = scroll_pos
    print(scroll_pos)
    Goal.objects.filter(id=unwanted_goal_id).delete()

def process_tick_form(posted_form, request, is_ticked):
    cleaned = validate_form(TickForm(posted_form))
    ticked = cleaned.get('tick')
    update = Goal.objects.get(id=ticked)
    yPos = cleaned.get("scrollYpos")
    xPos = cleaned.get("scrollXpos")

    scroll_pos = { "xPos": xPos, "yPos": yPos }

    request.session["scroll"] = scroll_pos
    update.completed = is_ticked
    update.save()

def process_temp_form(posted_form, context, request):
    cleaned = validate_form(TempGoalForm(posted_form))
    parent_id = cleaned.get("parent")
    depth_id = cleaned.get("depth_id") + 1
    temp_string = "New Goal Placeholder"

    scroll_pos = { 
        "xPos": cleaned.get("scrollXpos"),
        "yPos": cleaned.get("scrollYpos"),
        "parent":parent_id
        }

    request.session["scroll"] = scroll_pos

    for e in context["goals"]:
        if e.goal.id == parent_id:
            parent = e.goal
            break

    temp = Goal(content=temp_string, parent=parent, depth_id=depth_id, user_id=request.user.id)

    temp.save()
    temp_goal = Goal.objects.order_by('-id')[0]
    scroll_pos["id"] = temp_goal.id

def process_goal_form(posted_form, context, request, parent):
    cleaned = validate_form(GoalForm(posted_form))
   
    new_goal = cleaned.get('new_goal')
    parent_id = cleaned.get('parent')
    # gets the depth id from depth of clicked on, then indents its depth 1 more
    depth_id = cleaned.get('depth_id') + 1 
    
    for e in context["goals"]:
        if e.goal.id == parent_id:
            parent = e.goal
            break

    new_goal = Goal(content=new_goal, parent=parent, depth_id=depth_id, user_id=request.user.id)
    new_goal.save()
