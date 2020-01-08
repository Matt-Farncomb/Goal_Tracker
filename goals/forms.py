from django import forms

class GoalForm(forms.Form):
    new_goal = forms.CharField(label='new_goal', max_length=100)
    parent_id = forms.IntegerField(label='parent_id')
    hierarchy_id = forms.IntegerField(label='hierarchy_id')
    depth_id = forms.IntegerField(label='depth_id')