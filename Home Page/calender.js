function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyCl0ry1Nw4dR2d6jJ3eAMOGVu1aVvK4bQI',
        clientId: '872711248659-tt7rj8cqo2t1pmml13gn2eo6emk6qnt4.apps.googleusercontent.com',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.readonly"
    }).then(function() {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

        // Handle the initial sign-in state
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
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
    gapi.load('client:auth2', initClient);
}

// Call this function when the page loads
window.onload = handleClientLoad;