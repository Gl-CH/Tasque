from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Task, Section, List,UserProfile
from rest_framework.permissions import IsAuthenticated
from .serializer import TaskSerializer, SectionSerializer, ListSerializer,ListNestedSerializer,SectionNestedSerializer


# --- Page View ---
def task_app(request,key):
    list = List.objects.get(id = key,user = request.user.id)
    request.user.userprofile.last_used_list = list
    request.user.userprofile.save()
    return render(request, "tasks/index.html",{"csrf_token":get_token(request),"list_name":list.name,"list_key":key} )


def sign_out(request):
    logout(request)
    return redirect("sign_in")


# --- Task API Logic ---
@api_view(["POST"])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE","PATCH"])
def task_details(request, key):
    try:
        task = Task.objects.get(pk=key)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == "PUT" or request.method == "PATCH":
        serializer = TaskSerializer(task, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# --- Section API Logic ---
@csrf_exempt
@api_view(["POST"])
def create_section(request):
    serializer = SectionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_sections(request):
    sections = Section.objects.all()
    serializer = SectionSerializer(sections, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE","PATCH"])
def section_details(request, key):
    try:
        section = Section.objects.get(pk=key)
    except Section.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = SectionSerializer(section)
        return Response(serializer.data)

    elif request.method == "PUT" or request.method == "PATCH":
        serializer = SectionSerializer(section, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        section.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# --- List API Logic ---
@api_view(["POST"])
def create_list(request):
    serializer = ListSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_lists(request):
    lists = List.objects.filter(user = request.user.id)
    serializer = ListSerializer(lists, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE","PATCH"])
def list_details(request, key):
    try:
        list_obj = List.objects.get(pk=key,user=request.user.id)
    except List.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ListSerializer(list_obj)
        return Response(serializer.data)

    elif request.method == "PUT" or request.method == "PATCH":
        serializer = ListSerializer(list_obj, data=request.data ,partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        list_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def get_nested_list(request,key):
    try:
        # Fetch the List object, prefetch related sections and tasks
        list_obj = List.objects.prefetch_related('sections__tasks').get(pk=key,user = request.user.id)
    except List.DoesNotExist:
        return Response({"detail": "List not found."}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the data using the nested serializer
    serializer = ListNestedSerializer(list_obj)

    # Return the serialized data in the response
    return Response(serializer.data)   

@api_view(["GET"])
def get_nested_sections(request,key):
    try:
        # Fetch the List object, prefetch related sections and tasks
        section_obj = Section.objects.prefetch_related('tasks').get(pk=key,user = request.user.id)
    except Section.DoesNotExist:
        return Response({"detail": "List not found."}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the data using the nested serializer
    serializer = SectionNestedSerializer(section_obj)

    # Return the serialized data in the response
    return Response(serializer.data)   

from django.db import transaction

@api_view(["PATCH"])
def bulk_update_tasks(request):
    task_updates = request.data  # expecting a list like [{id: 3, order: 1}, {id: 4, order: 2}]

    if not isinstance(task_updates, list):
        return Response({"detail": "Expected a list of task updates."}, status=status.HTTP_400_BAD_REQUEST)

    errors = []
    
    with transaction.atomic():
        for update in task_updates:
            task_id = update.get("id")
            if not task_id:
                errors.append({"detail": "Missing 'id' in one of the updates."})
                continue

            try:
                task = Task.objects.get(pk=task_id)
            except Task.DoesNotExist:
                errors.append({"detail": f"Task with id {task_id} not found."})
                continue

            serializer = TaskSerializer(task, data=update, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                errors.append({f"id_{task_id}": serializer.errors})

    if errors:
        return Response({"detail": "Some updates failed.", "errors": errors}, status=status.HTTP_207_MULTI_STATUS)

    return Response({"detail": "Tasks updated successfully."}, status=status.HTTP_200_OK)
