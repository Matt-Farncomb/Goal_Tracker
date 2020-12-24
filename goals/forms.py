from django import forms



max_goal_length = 60


class InitialEntryForm(forms.Form):
    first_goal = forms.CharField(label='first_goal', max_length=100)

class GoalForm(forms.Form):
    new_goal = forms.CharField(label='new_goal', max_length=max_goal_length)
    parent = forms.IntegerField(required=False, label='parent')
    depth_id = forms.IntegerField(label='depth_id') 

class TempGoalForm(forms.Form):
    parent = forms.IntegerField(required=False, label='parent')
    depth_id = forms.IntegerField(label='depth_id') 
    scrollYpos = forms.IntegerField(label='scrollYpos')
    scrollXpos = forms.IntegerField(label='scrollXpos')

class EditForm(forms.Form):
    id = forms.CharField(label="id", max_length=100)
    new_goal = forms.CharField(label='new_goal', max_length=max_goal_length)

class DeleteForm(forms.Form):
    delete = forms.CharField(label='delete', max_length=100)
    scrollYpos = forms.IntegerField(label='scrollYpos')
    scrollXpos = forms.IntegerField(label='scrollXpos')

class TickForm(forms.Form):
    tick = forms.CharField(label="tick", max_length=100)
    scrollYpos = forms.IntegerField(label='scrollYpos')
    scrollXpos = forms.IntegerField(label='scrollXpos')

class LoginForm(forms.Form):
    username = forms.CharField(label="username", max_length=20)
    password = forms.CharField(label="password", max_length=20)

class RegisterForm(forms.Form):
    username = forms.CharField(label="username", max_length=20)
    password = forms.CharField(label="passowrd", max_length=20)
    firstname = forms.CharField(label="firstname", max_length=20)
    lastname = forms.CharField(label="lastname", max_length=20)

class CloseForm(forms.Form):
    parent_id = forms.CharField(label="parent_id", max_length=250)
    child_id = forms.CharField(label="child_id", max_length=250)
    hidden = forms.CharField(label="hidden", max_length=20)


 