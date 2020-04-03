const taskForm = document.querySelector('#taskForm');
const taskName = document.querySelector('#taskName');
const taskDescription = document.querySelector('#taskDescription');
const taskList = document.querySelector('#taskList');

const { ipcRenderer } = require('electron');

let tasks = [];

let updateStatus = false;
let idTaskToUpdate = '';

function deleteTask(id) {
    const result = confirm('Are your sure you want to delete it?');
    if (result) {
        ipcRenderer.send('delete-task', id);
    }
    return;
}

function updateTask(id) {
    updateStatus = true;
    idTaskToUpdate = id;

    const task = tasks.find(t => t._id === id);
    taskName.value = task.name;
    taskDescription.value = task.description;
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.map(t => {
        taskList.innerHTML += `
            <div class="row mt-2">
                <div class="card col-md-6 offset-md-3">
                    <div class="card-title text-center">
                        <p class="mt-4 h6"><strong>ID: ${t._id}</strong></p>
                    </div>
                    <hr>
                    <div class="card-body text-center">
                        <p><strong>${t.name}</strong></p>
                        <p>${t.description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="form-group row col-md-12">
                            <button onclick="deleteTask('${t._id}')" class="btn btn-danger col-md-5 offset-md-1">
                                Delete
                            </button>
                            <button onclick="updateTask('${t._id}')" class="btn btn-secondary col-md-5 offset-md-1">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

taskForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = taskName.value;
    const description = taskDescription.value;

    const task = {
        name,
        description
    };

    if (!updateStatus) {
        ipcRenderer.send('new-task', task);
    }else {
        ipcRenderer.send('update-task', {...task, _id: idTaskToUpdate});
        updateStatus = false;
    }
    taskForm.reset();
});

ipcRenderer.on('new-task-created', (e, args) => {
    const newTask = JSON.parse(args);
    tasks.push(newTask);
    alert('Task Created Successfully');

    renderTasks(tasks);
});

ipcRenderer.send('get-tasks');

ipcRenderer.on('get-tasks', (e, args) => {
    const tasksReceived = JSON.parse(args);
    tasks = tasksReceived;

    renderTasks(tasks);
});

ipcRenderer.on('delete-task-success', (e, args) => {
    const deletedTask = JSON.parse(args);
    tasks = tasks.filter(t => {
        return t._id !== deletedTask._id;
    });

    renderTasks(tasks);
});

ipcRenderer.on('update-task-success', (e, args) => {
    const updatedTask = JSON.parse(args);
    tasks = tasks.map(t => {
        if (t._id === updatedTask._id) {
            t.name = updatedTask.name;
            t.description = updatedTask.description;
        }
        return t;
    });

    renderTasks(tasks);
});