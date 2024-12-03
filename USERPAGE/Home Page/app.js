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