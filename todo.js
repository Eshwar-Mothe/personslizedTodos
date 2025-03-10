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
    alert('Todo Saved Successfully')
    handleReset()
    displayTodos();
    updateTodoStats();

}

// Updating the TodoStats
function updateTodoStats() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const favs = todos.filter(todo => todo.isFavorite).length;
    const pending = todos.filter(todo => !todo.isCompleted).length;

    document.getElementById("totalTodos").innerText = todos.length;
    document.getElementById("favTodos").innerText = favs;
    document.getElementById("pendingTodos").innerText = pending;

}

// Run this function when the page loads
document.addEventListener("DOMContentLoaded", updateTodoStats);


// Displaying the Todos of the user

document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const loggedInUserName = `${loggedInUser.fname} ${loggedInUser.lname}`
    document.getElementById('userName').innerHTML = loggedInUserName

    displayTodos();
    updateTodoStats();
});

document.addEventListener("DOMContentLoaded", displayTodos);

let currentTodoId = null;

function displayTodos() {
    const todoTableBody = document.getElementById("todoTableBody");
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    todoTableBody.innerHTML = ""; // Clear existing data

    if (todos.length > 0) {

        todos.forEach((todo, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${todo.isFavorite ? `⭐ ${todo.title}` : todo.title}</td>
                <td>${todo.content.substring(0, 10)}...</td>
                <td>${todo.tag}</td>
                <td>${todo.createdAt}</td>
                <td><button id='viewTodo' onclick="openModal(${todo.id})">View More</button></td>
            `;

            todoTableBody.appendChild(row);
        });
        updateTodoStats();
    }
    else {

        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="5" style="text-align:center; padding:20px;">
                <img src="todo.png" alt="No Todos" style="width:300px; display:block; margin:auto;">
                <p style="color:white; font-size:1.5rem;font-weight:500; margin-top:10px;">No Todos Available</p>
            </td>
        `;
        todoTableBody.appendChild(row);
    }


}

// Function to open modal
function openModal(todoId) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    // Set modal data
    document.getElementById("modalTitle").innerText = todo.isFavorite ? `⭐ ${todo.title}` : todo.title;
    document.getElementById("modalContent").innerText = todo.content;
    document.getElementById("modalTag").innerText = todo.tag;
    document.getElementById("modalDate").innerText = todo.createdAt;


    currentTodoId = todoId;

    document.getElementById("todoModal").style.display = "block";
}

function closeModal() {
    document.getElementById("todoModal").style.display = "none";
    currentTodoId = null;
}

// ✅ Move todo to completed list
function handleComplete() {
    if (currentTodoId !== null) {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];
        let completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];

        const todoIndex = todos.findIndex(t => t.id === currentTodoId);
        if (todoIndex !== -1) {
            completedTodos.push(todos[todoIndex]); // Move to completed list
            todos.splice(todoIndex, 1); // Remove from original list

            localStorage.setItem("todos", JSON.stringify(todos));
            localStorage.setItem("completedTodos", JSON.stringify(completedTodos));

            alert("Task marked as Completed!");
            closeModal();
            displayTodos();
            document.addEventListener("DOMContentLoaded", displayTodos);
            updateTodoStats();


        }
    }
}

// ✅ Toggle Favorite
function handleFav() {
    if (currentTodoId !== null) {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];

        const todo = todos.find(t => t.id === currentTodoId);
        if (todo) {
            todo.isFavorite = !todo.isFavorite; // Toggle favorite

            localStorage.setItem("todos", JSON.stringify(todos));
            alert(todo.isFavorite ? "Added to Favorites!" : "Removed from Favorites!");
            closeModal();
            displayTodos();
            document.addEventListener("DOMContentLoaded", displayTodos);
            updateTodoStats();
        }
    }
}

// ✅ Pin todo to top
function handlePin() {
    if (currentTodoId !== null) {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];

        const todoIndex = todos.findIndex(t => t.id === currentTodoId);
        if (todoIndex !== -1) {
            const [pinnedTodo] = todos.splice(todoIndex, 1);
            todos.unshift(pinnedTodo); // Move to the top of the list

            localStorage.setItem("todos", JSON.stringify(todos));
            alert("Todo Pinned!");
            closeModal();
            displayTodos();
            updateTodoStats();
            // document.addEventListener("DOMContentLoaded", displayTodos);

        }
    }
}

// ✅ Delete todo
function handleDelete() {
    if (currentTodoId !== null) {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];

        todos = todos.filter(t => t.id !== currentTodoId);
        localStorage.setItem("todos", JSON.stringify(todos));

        alert("Todo Deleted!");
        closeModal();
        displayTodos();
        updateTodoStats();

    }
}


function filterTodos() {
    const filterValue = document.getElementById("filterSelect").value;
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    let filteredTodos = [];

    if (filterValue === "all") {
        filteredTodos = todos;
    } else if (filterValue === "completed") {
        let completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];
        filteredTodos = completedTodos;
    } else if (filterValue === "favorite") {
        filteredTodos = todos.filter(todo => todo.isFavorite);
    } else if (filterValue === "pinned") {
        filteredTodos = [todos.find(todo => todo.isPinned)].filter(Boolean); // Get only pinned todo
    } else {
        filteredTodos = todos.filter(todo => todo.tag.toLowerCase() === filterValue);
    }

    updateTodoTable(filteredTodos);
}

function updateTodoTable(filteredTodos) {
    const todoTableBody = document.getElementById("todoTableBody");
    todoTableBody.innerHTML = ""; // Clear table

    filteredTodos.forEach((todo, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${todo.isFavorite ? '⭐ ' + todo.title : todo.title}</td>
            <td>${todo.content.substring(0, 10)}...</td>
            <td>${todo.tag}</td>
            <td><button onclick="openModal(${todo.id})">View More</button></td>
        `;
        todoTableBody.appendChild(row);
    });
}

// Call displayTodos initially to show all todos
displayTodos();
