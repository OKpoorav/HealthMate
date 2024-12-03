// Analytics Chart (Chart.js)
const ctx = document.getElementById("myChart").getContext("2d");

// Create the initial chart with labels and data
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Data',
            data: [12, 19, 3, 5, 2, 3], // Initial data
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to add data dynamically
function addData() {
    const newData = Math.floor(Math.random() * 20) + 1; // Random number for demo
    const newLabel = `Month ${myChart.data.labels.length + 1}`; // New label for the next month

    myChart.data.labels.push(newLabel);
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });

    myChart.update();
}

// Function to remove data dynamically
function removeData() {
    if (myChart.data.labels.length > 0) {
        myChart.data.labels.pop();
        myChart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });

        myChart.update();
    }
}

// Google Calendar API initialization
function loadGoogleCalendar() {
    gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY',
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    }).then(function() {
        // Load events from Google Calendar
        listUpcomingEvents();
    });
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        listUpcomingEvents();
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 5,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        var eventsList = document.getElementById('google-calendar-events');
        eventsList.innerHTML = '<h3>Upcoming Events</h3>';

        if (events.length > 0) {
            for (let i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                eventsList.innerHTML += 
                    `<div class="event">
                        <strong>${event.summary}</strong><br>
                        ${new Date(when).toLocaleString()}
                    </div>`;
            }
        } else {
            eventsList.innerHTML += '<p>No upcoming events found.</p>';
        }
    });
}

// Load the API client and auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', function() {
        gapi.client.init({
            apiKey: 'YOUR_GOOGLE_API_KEY',
            clientId: 'YOUR_GOOGLE_CLIENT_ID',
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(function() {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
}

// Call this function when the page loads
window.onload = handleClientLoad;

// Function to add a new document
function addDocument() {
    const docContainer = document.getElementById('doc-container');
    const addDocBtn = document.querySelector('.add-doc-button')
    
    // Create a new document element
    const newDoc = document.createElement('div');
    newDoc.classList.add('doc-box');
    newDoc.innerText = `Document ${docContainer.children.length + 1}`; // Auto-generate document name

    // Append the new document to the container
    docContainer.insertBefore(newDoc, addDocBtn);
}

document.addEventListener('click', function(){
    const docContainer = document.querySelectorAll('.doc-box');

    docContainer.forEach(docBox => {
        docBox.addEventListener('click', function(){
            docBox.remove();
        })
    })
});

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.carousel-image');
    let currentIndex = 0;

    function showNextImage() {
        // Remove active class from current image
        images[currentIndex].classList.remove('active');

        // Move to next image, wrap around to start if at end
        currentIndex = (currentIndex + 1) % images.length;

        // Add active class to next image
        images[currentIndex].classList.add('active');
    }

    // Initialize first image
    images[currentIndex].classList.add('active');

    // Change image every 3 seconds
    setInterval(showNextImage, 3000);
});
document.addEventListener('DOMContentLoaded', () => {
    const fileTypeFilters = document.querySelectorAll('.file-type-filter');
    const filePreviewWrapper = document.querySelector('.file-preview-wrapper');
    const uploadModal = document.getElementById('file-upload-modal');

    // Add Document Button
    const addDocumentButton = document.createElement('button');
    addDocumentButton.textContent = 'Add Document';
    addDocumentButton.classList.add('btn', 'add-document-btn');
    document.querySelector('.file-management').prepend(addDocumentButton);

    // Add Document Modal HTML
    uploadModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Upload Document</h2>
            <form id="document-upload-form">
                <select name="category" required>
                    <option value="">Select Document Type</option>
                    <option value="medical-report">Medical Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                </select>
                <input type="file" name="document" accept=".pdf,.jpg,.jpeg,.png,.docx" required>
                <button type="submit">Upload</button>
            </form>
        </div>
    `;

    // Add Document Functionality
    addDocumentButton.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    // Close Modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    // Upload Form Submission
    document.getElementById('document-upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await fetch('/upload-document', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('Document uploaded successfully!');
                uploadModal.style.display = 'none';
                loadDocuments();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload document');
        }
    });

    // Load Documents Function
    async function loadDocuments(category = 'all') {
        try {
            const response = await fetch(`/get-documents?category=${category}`);
            const documents = await response.json();

            filePreviewWrapper.innerHTML = '';

            documents.forEach(doc => {
                const filePreview = document.createElement('div');
                filePreview.classList.add('file-preview');
                filePreview.innerHTML = `
                    <img src="/icons/${doc.category}-icon.png" alt="${doc.category}" class="file-icon">
                    <div class="file-info">
                        <div class="file-name">${doc.originalName}</div>
                        <div class="file-size">${(doc.size / 1024).toFixed(2)} KB</div>
                    </div>
                    <div class="file-actions">
                        <button class="btn view-btn" data-id="${doc.id}">View</button>
                        <button class="btn download-btn" data-id="${doc.id}">Download</button>
                        <button class="btn delete-btn" data-id="${doc.id}">Delete</button>
                    </div>
                `;
                filePreviewWrapper.appendChild(filePreview);
            });
        } catch (error) {
            console.error('Failed to load documents:', error);
        }
    }

    // Filter Documents
    fileTypeFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.dataset.type;
            loadDocuments(category);

            fileTypeFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
        });
    });

    // Initial document load
    loadDocuments();
    loadUserProfile();
});
const addDocumentBtn = document.getElementById('add-document-btn');
const fileUploadModal = document.getElementById('file-upload-modal');
const fileUploadClose = document.querySelector('.file-upload-close');
const fileUploadInput = document.getElementById('file-upload-input');
const fileList = document.getElementById('file-list');
const uploadBtn = document.querySelector('.upload-btn');

// Open Modal
addDocumentBtn.addEventListener('click', () => {
    fileUploadModal.style.display = 'flex';
});

// Close Modal
fileUploadClose.addEventListener('click', () => {
    fileUploadModal.style.display = 'none';
});

// Close modal if clicked outside
fileUploadModal.addEventListener('click', (e) => {
    if (e.target === fileUploadModal) {
        fileUploadModal.style.display = 'none';
    }
});

// File Selection
fileUploadInput.addEventListener('change', (e) => {
    fileList.innerHTML = ''; // Clear previous selections
    Array.from(e.target.files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-list-item');
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <span>${(file.size / 1024).toFixed(2)} KB</span>
        `;
        fileList.appendChild(fileItem);
    });
});

// Drag and Drop Functionality
const dropArea = document.querySelector('.file-drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    fileUploadInput.files = files;
    fileUploadInput.dispatchEvent(new Event('change'));
}

// Upload Button
uploadBtn.addEventListener('click', () => {
    // Implement your upload logic here
    alert('Files will be uploaded');
    fileUploadModal.style.display = 'none';
});

async function loadUserProfile() {
    try {
        const response = await fetch('/HealthMate/USERPAGE/Login%20Page/userData.json'); // Path to your JSON file
        console.log('Response:', response);

        const users = await response.json();
        console.log('Users:', users);

        if (users) {
            const user = users; // Ensure 'user' is properly initialized here
            console.log('Selected User:', user);

            // Update the profile photo and name in the header
            const profileImage = document.getElementById('profile-image');
            const profileName = document.getElementById('profile-name');

            console.log(profileImage);
            profileImage.src = user.profilePhoto;
            profileName.textContent = `Hi, ${user.name}`;
        } else {
            console.warn("No users found in the JSON file.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
