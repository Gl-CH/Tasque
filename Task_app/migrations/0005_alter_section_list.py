# Generated by Django 5.1.6 on 2025-04-07 05:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Task_app', '0004_alter_task_options_rename_list_section_list_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='list',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='Task_app.list'),
        ),
    ]
