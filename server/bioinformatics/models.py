from django.db import models
from django.contrib.postgres.fields import ArrayField
import datetime

#
# 	Some utility functions 
#

def unix_time(dt):
	naive = dt.replace(tzinfo=None)
	epoch = datetime.datetime.utcfromtimestamp(0)
	delta = naive - epoch
	return delta.total_seconds()

def unix_time_millis(dt):
	return unix_time(dt) * 1000.0

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

	def fromJSON(self, j):
		self.description 	= j['description']
		self.name 			= j['name']
		wf = j['workflows']
		if (isinstance(wf, list)):
			self.workflows = wf
		else:
			self.workflows = wf.keys() #dict

	def toJSON(self):
		return {
			'id': 				self.id,
			'created_on' : 		unix_time_millis(self.created_on),
			'description' : 	self.description,
			'last_updated' : 	unix_time_millis(self.last_updated),
			'name' : 			self.name,
			'workflows' : 		self.workflows
		}

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

	def fromJSON(self, j):
		self.description 	= j['description']
		self.name 			= j['name']
		cats 				= j['categories']
		self.num_steps 		= j['num_steps']
		if (isinstance(cats, list)):
			self.categories = cats
		else:
			self.categories = cats.keys() #dict

	def toJSON(self):
		return {
			'id': 				self.id,
			'created_on' : 		unix_time_millis(self.created_on),
			'description' : 	self.description,
			'last_updated' : 	unix_time_millis(self.last_updated),
			'name' : 			self.name,
			'categories' : 		self.categories,
			'num_steps' : 		self.num_steps
		}
