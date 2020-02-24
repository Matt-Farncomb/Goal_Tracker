from django.db import models

class Goal(models.Model):
    content = models.TextField()
    # contains id of the goal above one layer,
    # if none above, id is 0 and it is the base layer
    #parent_id = models.IntegerField(default=0) # is the id of the goal that created the new goal
    parent = models.ForeignKey('Goal', on_delete=models.CASCADE, blank=True, null=True)
    #goal_id = models.AutoField() # a new id generated for the new goal
    #order in the flow from top to bottom
    #hierarchy_id = models.IntegerField(default=0)
    #order in the flow from left to the right
    depth_id = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
