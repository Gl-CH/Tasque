from rest_framework import serializers
from .models import Task,Section,List
from django.db.models import Max



class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def create(self, validated_data):
        section = validated_data.get('section')
        last_order = Task.objects.filter(section=section).aggregate(Max('order'))['order__max'] or 0
        validated_data['order'] = last_order + 10
        return super().create(validated_data)

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