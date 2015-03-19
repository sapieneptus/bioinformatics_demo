from django.db import models
from django.contrib.postgres.fields import ArrayField

NAME_LEN = 256
DESC_LEN = 4096

"""
	Categories have:
		- a unique name
		- a description
		- a creation date
		- a last modification date
		- 0 or more workflows
"""

class Category(models.Model):
	created_on 		= models.DateTimeField('created on', auto_now_add=True)
	description 	= models.CharField(max_length=DESC_LEN, null=False)
	last_updated 	= models.DateTimeField('last updated', auto_now=True)
	name 			= models.CharField(max_length=NAME_LEN, unique=True, null=False)
	workflows 		= ArrayField(models.PositiveIntegerField(), null=False)

	def __str__(self):
		return self.name
"""
	Workflows have:
		- a unique name
		- a description
		- a creation date
		- a last modification date
		- a count for the number of steps in the workflow
		- 1 or more categories
"""

class Workflow(models.Model):
	categories 		= ArrayField(models.PositiveIntegerField())
	created_on 		= models.DateTimeField('created on', auto_now_add=True)
	description 	= models.CharField(max_length=DESC_LEN, null=False)
	last_updated 	= models.DateTimeField('last updated', auto_now=True)
	name 			= models.CharField(max_length=NAME_LEN, unique=True, null=False)
	num_steps 		= models.PositiveIntegerField(default=1)

	def __str__(self):
		return self.name
