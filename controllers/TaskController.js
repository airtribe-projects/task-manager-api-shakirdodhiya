const fs = require("fs");

const getTasksArray = () => {
  const data = fs.readFileSync('./task.json', 'utf-8');
  const tasks = JSON.parse(data);

  return tasks.tasks
}

const writeTaskFile = async (tasks) => {

  const tasks_obj = JSON.stringify({
    tasks: tasks
  })
  fs.writeFileSync("./task.json", tasks_obj)
}

exports.validateData = (req, res, next) => {
  const body = req.body;

  let missing_params = [];

  if(typeof body.title !== "string"){
    missing_params.push({
      field : "title",
      description : "value must be string"
    })
  }

  if(typeof body.description !== "string"){
    missing_params.push({
      field : "description",
      description : "value must be string"
    })
  }
  if(typeof body.completed !== "boolean"){
    missing_params.push({
      field : "completed",
      description : "value must be boolean"
    })
  }

  if(missing_params.length){
    res.status(400).send(missing_params)
  }else{
    next()
  }
}

exports.getTasks = (req, res) => {
  const tasks = getTasksArray();
  res.status(200).send(tasks)
}

exports.getTaskById = (req, res) => {
  const tasks = getTasksArray();
  const task_id = req.params.id;
  const task = tasks.find(task => task.id === parseInt(task_id));

  if (task) {
    res.status(200).send(task)
  } else {
    res.status(404).send({})
  }
}

exports.createTask = async (req, res) => {
  const tasks = getTasksArray();
  const body = req.body;

  const last_task = tasks[tasks.length - 1];
  const new_id = last_task.id + 1;

  const new_task = {
    id: new_id,
    ...body
  }

  tasks.push(new_task)

  writeTaskFile(tasks);

  res.status(201).send({
    success: true
  })
}

exports.updateTask = async (req, res) => {
  const tasks = getTasksArray();
  const body = req.body;
  const task_id = req.params.id;

  const task_index = tasks.findIndex(task => task.id === parseInt(task_id));

  if (task_index < 0) {
    res.status(404).send({})
  } else {

    const updated_task = {
      id: tasks[task_index].id,
      ...body
    }
    tasks.splice(task_index, 1, updated_task);

    writeTaskFile(tasks);

    res.status(200).send({
      success: true
    })
  }
}

exports.deleteTask = async (req, res) => {
  const tasks = getTasksArray();
  const task_id = req.params.id;

  const task_index = tasks.findIndex(task => task.id === parseInt(task_id));

  if (task_index < 0) {
    res.status(404).send({})
  } else {
    tasks.splice(task_index, 1);

    writeTaskFile(tasks);

    res.status(200).send({
      success: true
    })
  }
}