# Tasks API

A simple Rest API build using **Node.js** and **Express**

## Setup Instructions

### 1. Clone Repository

### 2. Go to directory and Install dependencies
cd task-manager-api-shakirdodhiya
npm install

### 3. Start server

node app.js

This command will start server on http://localhost:3000

## Features

- Create, Read, Update, Delete (CRUD) for tasks
- Storing task data in file "task.json"

## Sample Task Object

{
  "id": 2,
  "title": "Create a new project",
  "description": "Create a new project using Magic",
  "completed": false
}

## API Endpoints

### 1. Get Tasks

Path : /tasks
Method : GET
Description : This API returns an array of tasks

### 2. Get Task by ID

Path : /tasks/:id
Method : GET
Description : This API fetches a task by ID

### 3. Create Task

Path : /tasks
Method : POST
Description : This API creates a New Task

### 4. Update Task by ID

Path : /tasks/:id
Method : PUT
Description : This API updates a task by ID

### 4. Delete Task by ID

Path : /tasks/:id
Method : DELETE
Description : This API deletes a task by ID

## How to test

Open postman and enter "http://localhost:3000" with respective methods and paths