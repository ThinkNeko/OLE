document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const deadlineInput = document.getElementById('deadline-input');
    const subjectInput = document.getElementById('subject-input');

    const task = taskInput.value;
    const deadline = deadlineInput.value;
    const subject = subjectInput.value;

    if (task && deadline && subject) {
        addTask(task, deadline, subject);

        taskInput.value = '';
        deadlineInput.value = '';
        subjectInput.value = '';
    }
});

function addTask(task, deadline, subject) {
    const taskList = document.getElementById('task-list');

    const li = document.createElement('li');
    li.textContent = `${task} - 期限: ${deadline} - 教科: ${subject}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', function () {
        taskList.removeChild(li);
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

// ページがロードされたときにtasks.jsonファイルを読み込む
window.addEventListener('load', function () {
    fetch('tasks.json')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                addTask(task.task, task.deadline, task.subject);
            });
        })
        .catch(error => console.error('Error loading tasks:', error));
});
