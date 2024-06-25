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
    deleteButton.textContent = 'Done';
    deleteButton.addEventListener('click', function () {
        taskList.removeChild(li);
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
}
