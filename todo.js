// Handling the Submit and reset

function handleReset() {
    document.getElementById('title').value = ''
    document.getElementById('content').value = ''
}

function handleSubmitTodo() {
    const title = document.getElementById('title').value
    const content = document.getElementById('content').value.trim()
    const tag = document.getElementById('tags').value

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];

    const todoId = savedTodos.length > 0 ? savedTodos.length + 1 : 1;

    const Time = new Date()
    const date = Time.getDate()
    const month = Time.getMonth()
    const year = Time.getFullYear()

    const timeStamp = `${(date).toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}`
    console.log(timeStamp)

    const todosData = {
        id: todoId,
        title: title,
        content: content,
        tag: tag,
        createdAt: timeStamp,
        uid: loggedInUser.uid
    }

    savedTodos.push(todosData);

    localStorage.setItem('todos', JSON.stringify(savedTodos))
    alert()

    handleReset()
}