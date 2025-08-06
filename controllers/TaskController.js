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

exports.validateTaskExists = (req, res, next) => {
  const tasks = getTasksArray();
  const task_id = req.params.id;
  const task = tasks.find(task => task.id === parseInt(task_id));

  if (task) {
    next();
  } else {
    res.status(404).send({})
  }
}
exports.validateData = (req, res, next) => {
  const body = req.body;

  let missing_params = [];

  if (body) {

    if (!body.title) {
      missing_params.push({
        field: "title",
        description: "value is required"
      })
    }
    else if (typeof body.title !== "string") {
      missing_params.push({
        field: "title",
        description: "value must be string"
      })
    } else {
      if (!Boolean(body.title.trim())) {
        missing_params.push({
          field: "title",
          description: "value should not be empty string"
        })
      }
    }

    if (!body.description) {
      missing_params.push({
        field: "description",
        description: "value is required"
      })
    }
    else if (typeof body.description !== "string") {
      missing_params.push({
        field: "description",
        description: "value must be string"
      })
    } else {
      if (!Boolean(body.description.trim())) {
        missing_params.push({
          field: "description",
          description: "value should not be empty string"
        })
      }
    }

    if (!body.priority) {
      missing_params.push({
        field: "priority",
        priority: "value is required"
      })
    }
    else if (!['low', 'medium', 'high'].includes(body.priority)) {
      missing_params.push({
        field: "priority",
        priority: "value must be one of these ['low', 'medium', 'high']"
      })
    }

    if (typeof body.completed !== "boolean") {
      missing_params.push({
        field: "completed",
        description: "value must be boolean"
      })
    }

    if (missing_params.length) {
      res.status(400).send(missing_params)
    } else {
      next()
    }
  } else {
    res.status(400).send("Request body is required")
  }
}

exports.getTasks = (req, res) => {
  const tasks = getTasksArray();
  const query = req.query;

  let filtered_and_sorted_tasks = []

  if (query.sort_by) {
    filtered_and_sorted_tasks = tasks.sort((a, b) => {
      const a_created_at = new Date(a.created_at || 0);
      const b_created_at = new Date(b.created_at || 0);

      return query.sort_order === 'ASC'
        ? a_created_at - b_created_at
        : b_created_at - a_created_at;
    })
  }
  if (query.completed) {
    const completed = query.completed === 'true'
    filtered_and_sorted_tasks = tasks.filter(task => task.completed === completed);
  }
  const res_data = Object.keys(query).length ? filtered_and_sorted_tasks : tasks
  res.status(200).send(res_data)
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
  const new_id = last_task ? last_task.id + 1 : 1;

  const new_task = {
    id: new_id,
    created_at: new Date(),
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

  const updated_task = {
    ...tasks[task_index],
    ...body
  }
  tasks.splice(task_index, 1, updated_task);

  writeTaskFile(tasks);

  res.status(200).send({
    success: true
  })
}

exports.deleteTask = async (req, res) => {
  const tasks = getTasksArray();
  const task_id = req.params.id;

  const task_index = tasks.findIndex(task => task.id === parseInt(task_id));

  tasks.splice(task_index, 1);

  writeTaskFile(tasks);

  res.status(200).send({
    success: true
  })
}

exports.getTasksByPriority = (req, res) => {
  const tasks = getTasksArray();
  const priority = req.params.level;
  const filtered_tasks = tasks.filter(task => task.priority === priority);
  res.status(200).send(filtered_tasks)
}