from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from Task_app.models import List,Task,Section,UserProfile



@receiver(post_save, sender = User, dispatch_uid = "create default list")
def create_default_list(sender,created,instance,**kwargs):
    if created:
        UserProfile.objects.create(user = instance)
        default_list = List.objects.create(name = "Welcome To Tasque",user = instance,is_default =True)
        default_section_1 = Section.objects.create(title = "This is a section (you store and organize tasks in them)",list = default_list)
        default_section_2 = Section.objects.create(title = "This is also a section (you can move tasks from the first section here)",list = default_list)
        Task.objects.create(title = "This is a a task",subtitle = "This is a task subtitle it holds more info about a task", section = default_section_1)
        Task.objects.create(title = "That is a checkbox ->",subtitle = "It deletes the task when you are done", section = default_section_2)
