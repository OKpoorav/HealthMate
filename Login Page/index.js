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
        window.location.href = '/Home Page/dashboard.html'; // Change to your home URL
    } else {
        // Simulate user login success
        alert('Login Successful! Redirecting to the home page...');
        window.location.href = '/Home Page/dashboard.html'; // Change to your home URL
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

// Initialize Google Login button for login and register
window.onload = function() {
    google.accounts.id.initialize({
        client_id: '876080209753-0k7oip0morqa1bk0rlhvfi8oeqn9r4uq.apps.googleusercontent.com',  // Replace with your Google OAuth client ID
        callback: handleCredentialResponse
    });

    // Render Google button for login
    google.accounts.id.renderButton(
        document.getElementById('googleLogin'),
        { theme: 'outline', size: 'large' }  // Customize the button appearance if needed
    );

    // Render Google button for register
    google.accounts.id.renderButton(
        document.getElementById('googleRegister'),
        { theme: 'outline', size: 'large' }  // Customize the button appearance if needed
    );
};
