#  Lazy Learn

Built by yours truly Beloune Alexandros ofc

Lazy Learn is a full-stack web application designed to manage student data. It features a React frontend, a Django REST Framework API, and a secure MySQL database. The entire application is containerized using Docker and served via Nginx for seamless deployment.

##  Tech Stack
* **Frontend:** React, Vite, Node.js, Nginx
* **Backend:** Python, Django, Django REST Framework, Token Authentication
* **Database:** MySQL 8.0
* **DevOps:** Docker, Docker Compose

## Project Structure
* `/lazy_learn_frontend` - Contains the React application and Nginx configuration.
* `/lazy_learn_backend` - Contains the Django API and Python dependencies.
* `docker-compose.yml` - The master configuration file that connects the frontend, backend, and database containers.

---

## Prerequisites
Before running this project, ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be running in the background)
* [Git](https://git-scm.com/)

---

## Installation & Setup

**Start the Docker Containers**
Open your terminal in the root directory of the project and run the following command to build the images and start all services:
```bash 
docker-compose up --build

## Setup the Database (One time only )
open a second terminal tab and type :
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser ##creates an admin account

## Accessing the Application
Once the terminal indicates the database is ready, you can view the app in your browser:

Main Application (React): http://localhost
API Backend / Admin Panel: http://localhost:8000/admin

## stopping the application
run this command in all open terminals :
docker-compose down 

This version is still pre (student pack alteration)