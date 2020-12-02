from django.db import models

class Goal(models.Model):
    content = models.TextField()
    parent = models.ForeignKey('Goal', on_delete=models.CASCADE, blank=True, null=True)
    depth_id = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    closed = models.BooleanField(default=False)
    hidden = models.BooleanField(default=False)
