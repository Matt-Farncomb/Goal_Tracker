# Generated by Django 2.2.7 on 2020-02-10 01:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0007_auto_20200108_2233'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='parent_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='goals.Goal'),
        ),
    ]