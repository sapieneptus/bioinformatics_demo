from django.db import models
from django.contrib.postgres.fields import ArrayField
import datetime

#
# 	Some helper functions for date time conversion
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
		self.created_on 	= j['created_on']
		self.description 	= j['description']
		self.last_updated 	= j['last_updated']
		self.name 			= j['name']
		self.workflows 		= j['workflows'].keys()

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
		self.created_on 	= j['created_on']
		self.description 	= j['description']
		self.last_updated 	= j['last_updated']
		self.name 			= j['name']
		self.categories 	= j['categories'].keys()
		self.num_steps 		= j['num_steps']

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
