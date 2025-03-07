//Landing Page Operations

const homeButton = document.getElementById('logo')
const loginButtons =  document.querySelectorAll('.login')
const signUpButtons = document.querySelectorAll('.signup')

console.log(loginButtons, signUpButtons)

const baseUrl = 'http://127.0.0.1:5501/'

// Homepage Navigation
homeButton.style.cursor = 'pointer'
homeButton.addEventListener('click', () => {
    location.href = `${baseUrl}index.html`

});

// Login page Navigation
loginButtons.forEach((button) => {

    button.addEventListener('click', () => {
    
        location.href = `${baseUrl}login.html`
    
    });
})


// SignUp page Navigation
signUpButtons.forEach((button) => {

    button.addEventListener('click', () => {
        location.href = `${baseUrl}signup.html`
    });
})



//Signup Page Operations

const otpButton = document.getElementById('getOtp')

// otpButton.addEventListener('click', (e) => {
//     e.preventDefault();

//     userDataStoring();
//     existingUser();
    
// }
// );


function userDataStoring(){
    
    var users = JSON.parse(localStorage.getItem('users') || "[]");
    
    const firstName = document.getElementById('fname').value
    const lastName = document.getElementById('lname').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('cpassword').value
    const mobileNumber = document.getElementById('mobile').value
    const gender = document.getElementById('gender').value

    if(password === confirmPassword ){

    timeStamp()

        const userDetails = {
            uid: timeStamp(),
            fname: firstName,
            lname: lastName,
            userMail: email,
            password: password,
            mobile: mobileNumber,
            gender: gender,
        }
        console.log(userDetails.uid);
        // const userEmail = localStorage.getItem('users')    
        users.push(userDetails);
        localStorage.setItem("users", JSON.stringify(users));
    }
        else{
            console.log("password not Matched")
            alert("Password Not Matched")
        }
// 052003
}

function timeStamp() {
    const date = new Date()

    const hrs = date.getHours()
    const mins = date.getMinutes()
    const secs = date.getSeconds()
    const day = date.getDate()
    const month = date.getMonth()+1
    const year = date.getFullYear()

    const timeStamp = `${hrs}${mins}${secs}${day}${month}${year}`

    return timeStamp
}


function existingUser(){
    var users = JSON.parse(localStorage.getItem('users') || "[]");
    console.log(users);

    users.forEach(user => {
       
        console.log(user.userMail)
    })
}


// New Todo Operations

function datachecker(){
    const title = document.getElementById('title').value;
    const body = document.getElementById('content').value;
    const tags = document.getElementById('tags').value

    if(!tags || !body || !title){
        alert("Please fill out the data")
    }
    else{
        console.log(title, body, tags);
    }
}
const totdoContainer = document.getElementsByClassName('newTodoContainer')[0]
totdoContainer.style.display = 'none';

const submitNewTodo = document.getElementById('newTodo')

submitNewTodo.addEventListener('click', () => {
    // checking the data is filled
    datachecker();

});