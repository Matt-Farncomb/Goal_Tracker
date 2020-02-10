# Generated by Django 2.2.7 on 2020-02-10 02:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0010_goal_parent_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='parent_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='goals.Goal'),
        ),
    ]
