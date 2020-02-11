# Generated by Django 2.2.7 on 2020-02-10 01:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0009_remove_goal_parent_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='parent_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='goals.Goal'),
            preserve_default=False,
        ),
    ]