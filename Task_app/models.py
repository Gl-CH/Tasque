from django.db import models

# Create your models here.


class List(models.Model):
	name = models.CharField(max_length=64)


class Section(models.Model):
	title = models.CharField(max_length=64)
	list = models.ForeignKey(List, on_delete=models.CASCADE,related_name="sections")

class Task(models.Model):
	title = models.CharField(max_length=64)
	subtitle = models.TextField(max_length=128)
	section = models.ForeignKey(Section, on_delete=models.CASCADE,related_name="tasks")
	order = models.PositiveIntegerField(default=0)

	class Meta:
		constraints = [
			models.UniqueConstraint(fields= ['section','order'],name='order_per_section')
		]
		ordering = ['order']

	def __str__(self):
		return f"task {self.id} under section {self.section}"