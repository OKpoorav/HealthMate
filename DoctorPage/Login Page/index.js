// Function to handle Google login and registration
function handleGoogleAuth(response) {
    if (response.credential) {
        // Get the user's Google profile information
        const googleUser = jwt_decode(response.credential);
        console.log('Logged in as: ', googleUser.name);

        // Display an alert or redirect user to a home page
        alert(`Welcome, ${googleUser.name}!`);
        window.location.href = '/HealthMate/DoctorPage/HomePage/index.html';  // Redirect to home page
    }
}

// Initialize Google Identity Services for Login and Register
function initGoogleAuth() {
    // Google login button for login form
    google.accounts.id.initialize({
        client_id: '876080209753-0k7oip0morqa1bk0rlhvfi8oeqn9r4uq.apps.googleusercontent.com',  // Replace with your actual Google Client ID
        callback: handleGoogleAuth,
    });

    google.accounts.id.renderButton(
        document.getElementById("googleLogin"), // The container for the Google Login button
        {
            theme: "outline",
            size: "large",
            type: "standard",
        }
    );

    // Google login button for registration form
    google.accounts.id.renderButton(
        document.getElementById("googleRegister"), // The container for the Google Register button
        {
            theme: "outline",
            size: "large",
            type: "standard",
        }
    );
}


window.onload = initGoogleAuth;
// Handle Google OAuth response
function handleCredentialResponse(response) {
    const token = response.credential;

    // Store the token in localStorage
    localStorage.setItem('google_token', token);

    // Check if the user is on login or registration section
    const isRegistering = document.querySelector('.register-section').classList.contains('active');
    
    if (isRegistering) {
        // Simulate user registration success
        alert('Registration successful! Redirecting to the home page...');
        window.location.href = '/HealthMate/DoctorPage/HomePage/index.html'; // Change to your home URL
    } else {
        // Simulate user login success
        alert('Login Successful! Redirecting to the home page...');
        window.location.href = '/HealthMate/DoctorPage/HomePage/index.html'; // Change to your home URL
    }
}

// Add functionality to toggle between login and register sections
document.getElementById('toRegister').addEventListener('click', () => {
    document.querySelector('.container').classList.add('slide-left');
    document.querySelector('.login-section').classList.remove('active');
    document.querySelector('.register-section').classList.add('active');
});

document.getElementById('toLogin').addEventListener('click', () => {
    document.querySelector('.container').classList.remove('slide-left');
    document.querySelector('.login-section').classList.add('active');
    document.querySelector('.register-section').classList.remove('active');
});

