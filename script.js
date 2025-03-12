const homeButton = document.getElementById('logo')
const loginButtons = document.querySelectorAll('.login')
const signUpButtons = document.querySelectorAll('.signup')



console.log(loginButtons, signUpButtons)

const baseUrl = 'https://eshwar-mothe.github.io/personslizedTodos/'

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

const otpButton = document.getElementById("getOtp");

otpButton.addEventListener("click", (e) => {
    e.preventDefault();
    userDataStoring();
});

// Checking for the existing user
function existingUser() {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.map((user) => user.userMail);
}

// Storing the data into the localstorage
function userDataStoring() {
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    const firstName = document.getElementById("fname").value.trim();
    const lastName = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("cpassword").value.trim();
    const mobileNumber = document.getElementById("mobile").value.trim();
    const gender = document.getElementById("gender").value.trim().toLowerCase();

    if (!firstName || !lastName || !email || !password || !confirmPassword || !mobileNumber || !gender) {
        alert("All fields are required.");
        return;
    }

    if (existingUser().includes(email)) {
        alert("User email already exists, redirecting to Login page.");
        location.href = `${baseUrl}login.html`;
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    const newOTP = generateOTP();// generates the six digits OTP

    const userDetails = {
        uid: Date.now(), 
        fname: firstName,
        lname: lastName,
        userMail: email,
        password: password,
        mobile: mobileNumber,
        gender: gender,
        otp: newOTP, 
    };


    document.getElementById("otpBox").style.display = "block";
    document.getElementById("signUpContainer").style.display = "none";
    document.getElementById("UserMail").innerHTML = email;

    sessionStorage.setItem("tempUser", JSON.stringify(userDetails));
}

// Function to generate OTP
function generateOTP() {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", OTP);
    alert("Your OTP is: " + OTP);
    return OTP;
}

// OTP Submission Handler
document.getElementById("otpSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    handleOtpSubmission();
});

function handleOtpSubmission() {
    const enteredOTP = document.getElementById("otp").value;
    const tempUser = JSON.parse(sessionStorage.getItem("tempUser"));

    if (!tempUser) {
        alert("Session expired. Please register again.");
        location.href = `${baseUrl}signup.html`;
        return;
    }

    if (parseInt(enteredOTP) === tempUser.otp) {
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        delete tempUser.otp; 
        users.push(tempUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration Successful! Login with your details");
        sessionStorage.removeItem("tempUser"); 
        location.href = `${baseUrl}login.html`;
    } else {
        alert("OTP does not match. Please try again.");
    }
}

// handles the login of the user
function handleLogin() {

    console.log('triggering')
    const users = JSON.parse(localStorage.getItem('users')) || []

    const email = document.getElementById('loginmail').value.trim().toLowerCase()
    const password = document.getElementById('loginpassword').value.trim()

    if (!email || !password) {
        alert("please enter the valid credentials")
        return
    }

    if (users.length === 0) {
        alert("no data Found")
        location.href = `${baseUrl}signup.html`
    }

    const foundUser = users?.find(user => user.userMail === email && user.password === password)
    if (foundUser) {
        alert(`Welcome Back ${foundUser.fname} ${foundUser.lname}`)
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
        location.href = `${baseUrl}todo.html`
    }
    else {
        alert("Invalid Credentials")
    }
}

// Getting the timestamp to assign as UID to the user
function timeStamp() {
    const date = new Date()

    const hrs = date.getHours()
    const mins = date.getMinutes()
    const secs = date.getSeconds()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const timeStamp = `${hrs}${mins}${secs}${day}${month}${year}`

    return timeStamp
}





// 
