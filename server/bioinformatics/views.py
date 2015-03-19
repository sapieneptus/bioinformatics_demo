from django.http import HttpResponse
from django.shortcuts import render
from bioinformatics.models import Category, Workflow
import json

#
# 	Return angular S.P.A. 
#


def index(request):
	return render(request, 'index.html', {})

#
# 	Workflow REST interface
#

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


#
# 	Category REST interface
#

def upsertCategory(categoryData):
	return HttpResponse("Upsert Category: " + categoryData['category_id'])

def deleteCategory(category_id):
	return HttpResponse("delete Category: " + category_id)

def getCategory(category_id):
	return HttpResponse("get Category: " + category_id)

def category(request, category_id):
    if (request.method == 'GET'):
    	return getCategory(category_id)
    elif (request.method == 'PUT' or request.method == 'POST'):
    	data 				= json.loads(request.body)
    	data['category_id'] = category_id
    	return deleteCategory(data)
    elif (request.method == 'DELETE'):
    	return deleteCategory(category_id)
    else:
    	return HttpResponse(status=405)

