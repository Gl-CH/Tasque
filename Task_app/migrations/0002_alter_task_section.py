# Generated by Django 5.1.6 on 2025-03-31 10:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Task_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='section',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='task', to='Task_app.section'),
        ),
    ]
