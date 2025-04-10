from django.urls import path
from . import views


urlpatterns = [
    path("<int:key>", views.task_app, name="lists"),

    # Auth
    path("sign_out/", views.sign_out, name="sign_out"),

    # Lists
    path("create/list/", views.create_list, name="create_list"),
    path("get/lists/", views.get_lists, name="get_lists"),
    path("get/lists/<int:key>/", views.list_details, name="list_details"),
    path("get/all/<int:key>", views.get_nested_list, name="get_lists_all"),


    # Sections
    path("create/section/", views.create_section, name="create_section"),
    path("get/sections/", views.get_sections, name="get_sections"),
    path("get/sections/<int:key>/", views.section_details, name="section_details"),

    # Tasks
    path("create/tasks/", views.create_task, name="create_task"),
    path("get/tasks/", views.get_tasks, name="get_tasks"),
    path("get/tasks/<int:key>/", views.task_details, name="task_details"),
]
