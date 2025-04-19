// const firebaseConfig = {
//     apiKey: "AIzaSyAVPElHXGW3MosL-Q7MdcoHnHVO41vVAm0",
//     authDomain: "placement-portal-f255f.firebaseapp.com",
//     projectId: "placement-portal-f255f",
//     storageBucket: "placement-portal-f255f.appspot.com",
//     messagingSenderId: "331903282276",
//     appId: "1:331903282276:web:1a288b64c9555c356b4371"
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const auth = firebase.auth()
//   const database = firebase.database()
   
// function register(){
 
//   email = document.getElementById('email').value
//   password = document.getElementById('password').value
// }
// if ( validate_email(email)==false || validate_password(password)==false){
//     alert('Email or password is outta line')
//     return
// }
// // if (Validate_input( full_name) ==false || validate_input(full_name) ==false || validate_input (full_name) ==fal(se)

// auth.createUserWithEmailAndPassword(email,password)
// .then(function(){
//     var user =auth.currentUser
//     var database_ref = database.ref()

//     var user_data ={
//         email: email,
//         full_name : full_name,
//         last_login : Date.now()
//     }
//     database_ref.child('user/'+user.uid).set(user_data)



//     alert('User Created')

// })
// .catch(function(console.error){
//     var error_code= error.error_code
//     var error_message=error.error.message 

//     alert( erroe_message)
// })
// function validate_email(email){
//     expression =/^[^@]+@\w+(\.\w+)+\w$/
//     if ( expression.test(email)== true){
//         return true

//     } else {
//         return false
//     }
// }
// function validate_password( password){
//  if ( password< 8){
//     return false 
//  }   else {
//     return true
//  }
// }
 
//  function validate_input( input){
//     if ( input ==null){
//         return false
//      }else {
//          return true
//      }
//  }

// User Management Functions
let users = JSON.parse(localStorage.getItem('users')) || [];

// Ensure functions are available globally
window.register = function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        alert('An account with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please login.');
    
    // If on the registration page, redirect to login
    if (window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    } else if (window.switchTab) {
        // If on the login/register combined page, switch to login tab
        window.switchTab('login');
        
        // Pre-fill email field
        document.getElementById('loginEmail').value = email;
    }
};

window.login = function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'profile.html';
    } else {
        alert('Invalid email or password');
    }
};

window.logout = function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};

window.validateEmail = function validateEmail(email) {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expression.test(email);
};

window.validatePassword = function validatePassword(password) {
    return password.length >= 8;
};

// Check if user is logged in
function checkAuth() {
    try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) {
            return null;
        }
        
        const currentUser = JSON.parse(currentUserStr);
        const userInfo = document.getElementById('userInfo');
        const loginSignup = document.getElementById('loginSignup');
        
        if (currentUser && currentUser.email) {
            if (userInfo && loginSignup) {
                // If on a page with user info elements
                const userEmail = document.getElementById('userEmail');
                userInfo.style.display = 'flex';
                loginSignup.style.display = 'none';
                if (userEmail) {
                    userEmail.textContent = currentUser.email;
                }
            }
            return currentUser;
        } else {
            if (userInfo && loginSignup) {
                userInfo.style.display = 'none';
                loginSignup.style.display = 'flex';
            }
            return null;
        }
    } catch (error) {
        console.error("Error in checkAuth:", error);
        return null;
    }
}

// Profile Management
function updateProfile(profileData) {
    const currentUser = checkAuth();
    if (currentUser) {
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...profileData };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            alert('Profile updated successfully!');
        }
    }
}

// Job Management
let jobs = [];
try {
    const jobsStr = localStorage.getItem('jobs');
    if (jobsStr) {
        jobs = JSON.parse(jobsStr);
        if (!Array.isArray(jobs)) {
            jobs = [];
        }
    }
} catch (e) {
    console.error("Error loading jobs:", e);
    jobs = [];
}

function addJob(jobData) {
    try {
        jobs.push({
            ...jobData,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch (error) {
        console.error("Error adding job:", error);
        alert("Failed to add job. Please try again.");
    }
}

function getJobs() {
    return jobs;
}

function applyForJob(jobId) {
    try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) {
            alert('Please login to apply for jobs');
            window.location.href = 'login.html';
            return;
        }
        
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser && currentUser.email) {
            const job = jobs.find(j => j.id === jobId);
            if (job) {
                if (!job.applications) {
                    job.applications = [];
                }
                job.applications.push({
                    userId: currentUser.email,
                    appliedAt: new Date().toISOString()
                });
                localStorage.setItem('jobs', JSON.stringify(jobs));
                alert('Application submitted successfully!');
            }
        } else {
            alert('Please login to apply for jobs');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error("Error applying for job:", error);
        alert("Failed to apply for job. Please try again.");
    }
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', function() {
    try {
        checkAuth();
    } catch (error) {
        console.error("Error checking auth on page load:", error);
    }
});
