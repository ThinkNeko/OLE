document.getElementById('task-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const deadlineInput = document.getElementById('deadline-input');
    const subjectInput = document.getElementById('subject-input');

    const task = taskInput.value;
    const deadline = deadlineInput.value;
    const subject = subjectInput.value;

    if (task && deadline && subject) {
        await fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task,
                deadline,
                subject
            })
        });

        taskInput.value = '';
        deadlineInput.value = '';
        subjectInput.value = '';

        loadTasks();
    }
});

async function loadTasks() {
    const response = await fetch('/load');
    const tasks = await response.json();

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.task} - 期限: ${task.deadline} - 教科: ${task.subject}`;

        const hideButton = document.createElement('button');
        hideButton.textContent = '非表示';

        hideButton.addEventListener('click', function () {
            li.style.display = 'none';
        });

        li.appendChild(hideButton);
        taskList.appendChild(li);
    });
}

window.addEventListener('load', loadTasks);
