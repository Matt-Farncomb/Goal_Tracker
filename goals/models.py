from django.db import models
from django.contrib.auth.models import AbstractUser
import textwrap

class Goal(models.Model):
    content = models.TextField()
    parent = models.ForeignKey('Goal', on_delete=models.CASCADE, blank=True, null=True)
    depth_id = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    closed = models.BooleanField(default=False)
    hidden = models.BooleanField(default=False)
    # will need  user id - will only get goals made by signed in user
    user_id = models.IntegerField()

class UserProfile(AbstractUser):
    # firstname = models.TextField()
    # lastname = models.TextField()

    def __str__(self):
        return(textwrap.dedent(f"""\
            firstname: {self.first_name}, 
            lastname: {self.last_name}, 
            id: {self.id}\
        """))