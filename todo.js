

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

function updateTodoStats() {
    const todosData = JSON.parse(localStorage.getItem("todos")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

    // Ensure a user is logged in
    if (!loggedInUser) {
        console.warn("No user is logged in! Cannot update stats.");
        return;
    }

    // Filter todos based on the logged-in user
    const userTodos = todosData.filter(todo => todo.uid === loggedInUser.uid);


    const favs = userTodos.filter(todo => todo.isFavorite).length;
    const pending = userTodos.filter(todo => !todo.isCompleted).length;

    // Update UI elements
    document.getElementById("totalTodos").innerText = userTodos.length;
    document.getElementById("favTodos").innerText = favs;
    document.getElementById("pendingTodos").innerText = pending;
    document.getElementById('completedTodos').innerHTML = completedTodos.length
}



document.addEventListener("DOMContentLoaded", updateTodoStats);


document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log(loggedInUser.fname)

    const loggedInUserName = `${loggedInUser.fname} ${loggedInUser.lname}`
    document.getElementById('userName').innerHTML = loggedInUserName
    console.log(loggedInUserName)

    displayTodos();
    updateTodoStats();
});

document.addEventListener("DOMContentLoaded", displayTodos);

let currentTodoId = null;

function displayTodos() {
    const todoTableBody = document.getElementById("todoTableBody");
    const todosData = JSON.parse(localStorage.getItem("todos")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

    const todos = todosData.filter(todo => todo.uid === loggedInUser.uid);

    todoTableBody.innerHTML = ""; 

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

function openModal(todoId) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todo = todos.find(t => t.id === todoId);
    
    if (!todo) return;

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


function handleComplete() {
    if (currentTodoId !== null) {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];
        let completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];

        const todoIndex = todos.findIndex(t => t.id === currentTodoId);
        if (todoIndex !== -1) {
            completedTodos.push(todos[todoIndex]); 
            todos.splice(todoIndex, 1); 

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

function handleFav() {
    if (currentTodoId !== null) {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];

        const todo = todos.find(t => t.id === currentTodoId);
        if (todo) {
            todo.isFavorite = !todo.isFavorite; 

            localStorage.setItem("todos", JSON.stringify(todos));
            alert(todo.isFavorite ? "Added to Favorites!" : "Removed from Favorites!");
            closeModal();
            displayTodos();
            document.addEventListener("DOMContentLoaded", displayTodos);
            updateTodoStats();
        }
    }
}


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
    } else {
        filteredTodos = todos.filter(todo => todo.tag.toLowerCase() === filterValue);
    }

    updateTodoTable(filteredTodos);
}

function updateTodoTable(filteredTodos) {
    const todoTableBody = document.getElementById("todoTableBody");
    todoTableBody.innerHTML = "";

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

displayTodos();


// Set Avatar
function setUserAvatar() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;
    const avatarImg = document.getElementById("userAvatar");

    if (!loggedInUser) {
        console.warn("No user is logged in! Cannot set avatar.");
        return;
    }


    if (loggedInUser.gender === "male") {
        avatarImg.src = "male.png";
    } else if (loggedInUser.gender === "female") {
        avatarImg.src = "female.png";
    } else {
        avatarImg.src = "default.webp"
    }
}

document.addEventListener("DOMContentLoaded", setUserAvatar());