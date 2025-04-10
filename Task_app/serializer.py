from rest_framework import serializers
from .models import Task,Section,List


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class SectionNestedSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)  # Nest tasks inside sections

    class Meta:
        model = Section
        fields = ["id", "title", "tasks"]  # Section fields plus nested tasks

class ListNestedSerializer(serializers.ModelSerializer):
    sections = SectionNestedSerializer(many=True, read_only=True)  # List contains sections

    class Meta:
        model = List
        fields = ["id", "name", "sections"]  # List fields plus nested sections