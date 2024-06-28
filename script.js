const taskList = document.getElementById('task-list');

let tasks = getTasks();

function generateUUID() {
    // Function to generate a random hex digit
    function getRandomHexDigit() {
        return Math.floor(Math.random() * 16).toString(16);
    }

    // Template for a UUIDv4
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    // Replace x and y in the template with random hex digits
    return template.replace(/[xy]/g, function (c) {
        const r = getRandomHexDigit();
        const v = c === 'x' ? r : (parseInt(r, 16) & 0x3 | 0x8).toString(16);
        return v;
    });
}

const deleteButtonOnClick = function () {
    taskList.removeChild(this.parentNode);
    tasks = tasks.filter(t => t.id !== this.parentNode.dataset.taskid);
    saveTasks(tasks);
}

const checkboxOnClick = function () {
    const span = this.parentNode.querySelector('.task')
    span.style.textDecoration = this.checked ? 'line-through' : 'none';
    tasks = tasks.map(t => {
        if (t.id === this.parentNode.dataset.taskid) {
            return {...t, completed: this.checked}
        }
        return t;
    });
    saveTasks(tasks);
}

// Load tasks from local storage and display them
tasks.forEach(task => {
    let taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
});

// Function to save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to get tasks from local storage
function getTasks() {
    const defaultTasks = [
        {id: generateUUID(), name: "Task 1", completed: false},
        {id: generateUUID(), name: "Task 2", completed: false},
        {id: generateUUID(), name: "Task 3", completed: false},
    ];

    const tasks = JSON.parse(localStorage.getItem('tasks'));

    if (!Array.isArray(tasks)) {
        saveTasks(defaultTasks);
        return defaultTasks;
    }

    return tasks;
}

// Function to create a task element
function createTaskElement(task) {
    let li = document.createElement('li');


    let checkbox = document.createElement('input');
    checkbox.checked = task.completed;
    checkbox.type = 'checkbox';

    // Add event listener to checkbox for marking tasks as complete
    checkbox.addEventListener('change', checkboxOnClick);

    let span = document.createElement('span');
    span.className = 'task';
    span.style.textDecoration = task.completed ? 'line-through' : 'none';
    span.textContent = task.name;

    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';

    // Add delete functionality
    deleteButton.addEventListener('click', deleteButtonOnClick);

    // Append elements to the new task
    li.dataset.taskid = task.id;
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);

    // Add the new task to the task list
    taskList.appendChild(li);

    return li;
}

document.getElementById('add-task-button').addEventListener('click', function () {
    let taskInput = document.getElementById('input-task');
    let taskName = taskInput.value.trim();

    if (taskName) {
        let newTask = {id: generateUUID(), name: taskName, completed: false};
        tasks.push(newTask);

        let taskElement = createTaskElement(newTask);
        taskList.appendChild(taskElement);

        saveTasks(tasks);

        // Clear the input field
        taskInput.value = '';
    }
});
