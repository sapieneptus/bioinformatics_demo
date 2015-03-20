from django.http import HttpResponse
from django.shortcuts import render
from bioinformatics.models import Category, Workflow
import json

#################################
# 	Angular S.P.A. index page	#
#################################

def index(request):
	return render(request, 'index.html', {})


#################################
# 	Workflow REST interface		#
#################################

def upsertWorkflow(workflowData):
	return HttpResponse("Upsert Workflow: " + workflowData['workflow_id'])

def deleteWorkflow(workflow_id):
	return HttpResponse("delete Workflow: " + workflow_id)

def getWorkflow(workflow_id):
	return HttpResponse("get Workflow: " + workflow_id)

def workflow(request, workflow_id):
    if (request.method == 'GET'):
    	return getWorkflow(workflow_id)
    elif (request.method == 'PUT' or request.method == 'POST'):
    	data 				= json.loads(request.body)
    	data['workflow_id'] = workflow_id
    	return upsertWorkflow(data)
    elif (request.method == 'DELETE'):
    	return deleteWorkflow(workflow_id)
    else:
    	return HttpResponse(status=405)


#################################
# 	Category REST interface		#
#################################

def upsertCategory(categoryData):
	if 'id' not in categoryData:  	#It's new... but 'name' may not b unique
		cat 	= Category()
		cat.fromJSON(categoryData)
	else:							#id was supplied, check if exissts
		try:
			cat 	= Category.objects.get(id=categoryData['id'])
		except Exception as notfound:	
			#technically the id doesn't exist so we could insert it,
			#but if this were a distributed system that might not fly so...
			del categoryData['id']
			cat = Category()
			cat.fromJSON(categoryData)
	try:
		cat.save()		#try to upsert
		return HttpResponse(json.dumps(cat.toJSON()))
	except Exception as e:
		return HttpResponse(json.dumps({'error' : str(e)}), status=500)

def deleteCategory(category_id):
	return HttpResponse("delete Category: " + category_id)

def getCategory(category_id):
	try:
		cat = Category.objects.get(id=category_id)
		return HttpResponse(json.dumps(cat.toJSON()))
	except Exception as notfound:	
		return HttpResponse(json.dumps({'error' : 'not found'}), status=404)

def allCategories():
	cats = [cat.toJSON() for cat in Category.objects.all()]
	return HttpResponse(json.dumps(cats))

def category(request):
	"""
		GET  		all categories
		POST 		a new category
	"""
	if (request.method == 'GET'):
		return allCategories()
	elif (request.method == 'POST'):
		data = json.loads(request.body)
		return upsertCategory(data)
	else:
		return HttpResponse(status=405)


def categoryid(request, category_id):
	"""
		GET  		category by id
		PUT 		update category by id
		DELETE  	delete category by id
	"""
	if (request.method == 'GET'):
		return getCategory(category_id)
	elif (request.method == 'PUT'):
		data = json.loads(request.body)
		return upsertCategory(data)
	elif (request.method == 'DELETE'):
		return deleteCategory(category_id)
	else:
		return HttpResponse(status=405)

