from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Create your models here.




class List(models.Model):
	name = models.CharField(max_length=64)
	user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="lists")
	is_default = models.BooleanField(default=False)
	
	def delete(self, using=None, keep_parents=False):
		if self.is_default:
			raise ValidationError("Default object cannot be deleted.")
		super().delete(using=using, keep_parents=keep_parents)

class Section(models.Model):
	title = models.CharField(max_length=64)
	list = models.ForeignKey(List, on_delete=models.CASCADE,related_name="sections")

class Task(models.Model):
	title = models.CharField(max_length=64)
	subtitle = models.TextField(max_length=128)
	section = models.ForeignKey(Section, on_delete=models.CASCADE,related_name="tasks")
	order = models.PositiveIntegerField()

	class Meta:
		constraints = [
			models.UniqueConstraint(fields= ['section','order'],name='order_per_section')
		]
		ordering = ['order']

	def __str__(self):
		return f"task {self.id} under section {self.section}"
	

class UserProfile(models.Model):
	user = models.OneToOneField(User,on_delete=models.CASCADE)
	last_used_list = models.ForeignKey(List,null= True,blank=True,on_delete=models.SET_NULL)