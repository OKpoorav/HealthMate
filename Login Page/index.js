// Function to handle Google login and registration
function handleGoogleAuth(response) {
    if (response.credential) {
        // Get the user's Google profile information
        const googleUser = jwt_decode(response.credential);
        console.log('Logged in as: ', googleUser.name);

        // Display an alert or redirect user to a home page
        alert(`Welcome, ${googleUser.name}!`);
        window.location.href = '/Home Page/dashboard.html';  // Redirect to home page
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

// Toggle between Login and Register forms
function toggleForms(showLogin) {
    const loginForm = document.querySelector('.login-section');
    const registerForm = document.querySelector('.register-section');

    if (showLogin) {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
}

// Form switch event listeners
document.getElementById('toRegister').addEventListener('click', () => {
    toggleForms(false);
});

document.getElementById('toLogin').addEventListener('click', () => {
    toggleForms(true);
});

// Load Google Auth when the page is loaded
window.onload = initGoogleAuth;
