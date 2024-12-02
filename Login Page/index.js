// Function to handle Google login and registration
function handleGoogleAuth(response) {
    if (response.credential) {
        // Decode the Google credential to get user info
        const googleUser = jwt_decode(response.credential);
        console.log('Logged in as:', googleUser);

        // Prepare the user data to send to the server
        const userData = {
            name: googleUser.name,
            email: googleUser.email,
            profilePhoto: googleUser.picture, // Get the profile photo URL
        };

        // Send the data to the server using fetch
        fetch('http://localhost:5000/saveUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // Convert the object to JSON
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save data on the server');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data saved successfully:', data);
                window.location.href = '/Home Page/dashboard.html'; // Redirect to the dashboard
                alert(`Welcome, ${googleUser.name}! Redirecting to your dashboard...`);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to log in. Please try again.');
            });
    }
}

// Initialize Google Identity Services
function initGoogleAuth() {
    google.accounts.id.initialize({
        client_id: '876080209753-0k7oip0morqa1bk0rlhvfi8oeqn9r4uq.apps.googleusercontent.com', // Replace with your Google Client ID
        callback: handleGoogleAuth,
    });

    google.accounts.id.renderButton(
        document.getElementById("googleLogin"),
        {
            theme: "outline",
            size: "large",
            type: "standard",
        }
    );

    google.accounts.id.renderButton(
        document.getElementById("googleRegister"),
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