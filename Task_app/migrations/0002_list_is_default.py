# Generated by Django 5.1.6 on 2025-04-13 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Task_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='list',
            name='is_default',
            field=models.BooleanField(default=False),
        ),
    ]
