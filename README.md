# bioinformatics_demo
Bioinformatics Demo


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
  python manage.py migrate
  ```
  to initialize the database. 

## The Server

The django component sets up the tables with two models: Workflow and Category. 

They both share all of the following fields:

- a unique name
- a description
- a creation date 
- a last modification date

I decided not to make the name the primary_key even though it's unique, since we'd need to pass it around
http query strings in order to interact with REST, and it can get messy to urlquote and unquote arbitrary
strings. Integers are much cleaner. Thus, I let postgres use its default auto-incrementing ID system. 
  
