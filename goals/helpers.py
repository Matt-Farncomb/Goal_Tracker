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