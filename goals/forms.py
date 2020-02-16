from django import forms

class Initial_Entry_Form(forms.Form):
    first_goal = forms.CharField(label='first_goal', max_length=100)

class GoalForm(forms.Form):
    new_goal = forms.CharField(label='new_goal', max_length=100)
    parent = forms.IntegerField(required=False, label='parent')
    #hierarchy_id = forms.IntegerField(label='hierarchy_id')
    depth_id = forms.IntegerField(label='depth_id') 

class DeleteForm(forms.Form):
    delete = forms.CharField(label='delete', max_length=100)