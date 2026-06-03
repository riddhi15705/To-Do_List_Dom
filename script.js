document.addEventListener('DOMContentLoaded', () => {
    const addTaskTitleInput = document.getElementById('addTaskTitle');
    const addTaskDescriptionInput = document.getElementById('addTaskDescription');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to render tasks
    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks
        if (tasks.length === 0) {
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = 'No tasks yet. Add a new task!';
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.fontStyle = 'italic';
            noTasksMessage.style.color = '#777';
            taskList.appendChild(noTasksMessage);
            return;
        }

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-id', task.id); // Use a unique ID for each task

            listItem.innerHTML = `
                <div class="task-content">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                </div>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    }

    // Function to add a new task
    addTaskButton.addEventListener('click', () => {
        const title = addTaskTitleInput.value.trim();
        const description = addTaskDescriptionInput.value.trim();

        if (title) {
            const newTask = {
                id: Date.now(), // Simple unique ID
                title: title,
                description: description
            };
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            addTaskTitleInput.value = '';
            addTaskDescriptionInput.value = '';
        } else {
            alert('Task title cannot be empty!');
        }
    });

    // Function to handle edit and delete operations using event delegation
    taskList.addEventListener('click', (event) => {
        const target = event.target;
        const listItem = target.closest('li');

        if (!listItem) return; // Clicked outside a task item

        const taskId = parseInt(listItem.getAttribute('data-id'));

        if (target.classList.contains('delete-btn')) {
            // Delete task
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        } else if (target.classList.contains('edit-btn')) {
            // Edit task
            const taskToEdit = tasks.find(task => task.id === taskId);
            if (taskToEdit) {
                const newTitle = prompt('Edit task title:', taskToEdit.title);
                const newDescription = prompt('Edit task description:', taskToEdit.description);

                if (newTitle !== null && newTitle.trim() !== '') {
                    taskToEdit.title = newTitle.trim();
                    taskToEdit.description = newDescription !== null ? newDescription.trim() : taskToEdit.description;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                } else if (newTitle !== null) {
                    alert('Task title cannot be empty!');
                }
            }
        }
    });

    // Initial render of tasks when the page loads
    renderTasks();
});