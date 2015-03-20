# Bioinformatics Demo Project

## Setup

### Dependencies
1.    Make sure you have django installed (`pip install django`) 
2.    If you don't have python Postgre-SQL on your OS, follow the steps here --> http://initd.org/psycopg/docs/install.html to install it. You may need to install Homebrew or macports on MacOS to get it, else yum/apt-get should suffice. It may take a while to install.

    You may need to `brew install postgresql` first. 
    
    Alternatively, you can just use this to do it all in one step via http://postgresapp.com/
    
3. To speed up development, I used django 1.8 (because of its ArrayField class). So you'll need to do:
    `sudo pip install https://www.djangoproject.com/download/1.8c1/tarball/` to get the latest. 

4. Open a prompt with your terminal and from within the server directory, execute
  ```
  psql
  CREATE DATABASE bioinformatics_demo;
  \q
  $ python manage.py makemigrations bioinformatics
  python manage.py migrate
  ```
  to initialize the database. 
  
  Next you'll need to create a superuser, 
  `python manage.py createsuperuser`
  
  Run with `python manage.py runserver`, 
  Navigate to `http://localhost:8000/admin` and login using the superuser credentials you just made
  (this is just so that your browser will get the appropriate CSRF cookie, since I didn't have time to 
  implement automatic cookie fetch as part of the project). 
  
  Finally,
  Open up a browser tab to `http://localhost:8000/bioinformatics` to view.

## The Server

- django 1.8
- PostgreSQL

The django component sets up the tables with two models: Workflow and Category. 

They both share all of the following fields:

- a unique name
- a description
- a creation date 
- a last modification date

bioinformatics/models.py contains the models for the project: Category and Workflow. With more time to refactor,
I might have made them both inherit from a superclass ('bioinfoobject' ? ) since they share many fields. Each 
also has a fromJSON and toJSON method to serialize and deserialize from JSON (since JSON is so easy to work with 
accross http). 

/bioinformatics/views.py contains the routing logic (routes are in /bioinformatics/urls.py). We essentially have
two main route patterns, `/<type` and `/<type>/id`. The former can be used for bulk fetch via GET or single 
creation via POST (since we don't need to pass an id for a new creation). The latter is useful for delete, single
GET, and PUT, though in practice PUT and POST functionality can be condensed into the same logic for a project like
this. 

## Clientside
- Angular.js
- jQuery
- Twitter Bootstrap.css
- Underscore.js

 There is an in memory cache that stores the categories and workflows. As this loads, the UI populates all of the
 rows. There is a small service (`$db`) which handles interactions with this in-memory cache. There is a little
 extra overhead to make sure the in-memory cache is synchronized with the server, but it's very minimal and the
 end result is a more responsive application. 
 
 There are a few variables which represent state: `new_cat` and `editing`. The `editing` variable points to 
 either the id of a category object that is currently undergoing edits, or `-1` as a sentinal value. `new_cat` is
 either `true` or `false` indicating whether or not the new category dialog is open. These two state variables
 fuel the angular bindings to display appropriate UI (largely via class manipulation and `ng-show/hide`). 
 
 The general approach to data update is end-to-end: User initiates an action, the action is carried through to
 the server and back to the client with some response before any action is taken clientside. Obviously, this only
 works for small transactions, but luckily that's all we are dealing with since we have the cache loaded up front. 
 If I were to scale the application, one place to start making improvements would be in decoupling the REST 
 dependency between UI events and data manipulation (e.g., via a locally cached transaction queue). 

## Not Implemented/TODO
 **Not thoroughly tested outside of Chrome (however, if the dependencies were truthful about their 
 support, it should work well in anything newer than IE9)** If you are getting erros when trying to use it, 
 try going to `http://localhost:8000/admin` and logging in with superuser credentials in order to refresh
 your browser's CSRF cookie. 

 All of the front end to manipulate Workflows directly is not implemented. My approach would be to factor much of 
 the existing front end components into partials and reuse a lot of the same UI for the workflow CRUD interface. 
 I'd try to factor out as much of the CategoryController logic as possible, possibly to some common object from 
 which WorkflowController and CategoryController can both pull methods/variables. 
 
 Workflows currently can be added to a category during creation and can be removed individually during editing,
 but can not be added individually during editing. My first pass approach would be to get a delta array of 
 the workflows not present on a given category and let the user add them to a category via dropdown menu. A
 second pass might involve a search filter (in case there are a lot of workflows / serverside search). I would
 also allow the user to create a brand-new workflow right from the category edit dialog, since workflows
 must be attached to at least one category anyway. 
 
 The main.js file can be refactored such that the Controllers are extracted to a separate file for cleanliness.
 The category.html page can similarly be refactored into custom angular directives, possibly with their own
 controllers. 
 
 If I were trying to scale this project, I'd impose a limit on the initial data fetch and fetch rows on an
 as-needed basis. Individual rows might also need to be fetched on an as-needed basis as well so as not to overload
 the RAM, but at the possible cost of frontend lag. 
 
 The backend logic for workflows would be nearly identical to that of categories with more validation for num_steps
 and the categories array. In general, the django component could be refactored to provide more robust error 
 messaging such that the client can make more intelligent decisions on how to handle errors. 
  
