// Event listener for generating a ticket when the form is submitted
document.getElementById('generateForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    
    // Retrieve the username, user-generated security key, email, and selected event from the form inputs
    const username = document.getElementById('username').value; // User's name
    const userPassword = document.getElementById('Ticket').value; // User's security key
    const email = document.getElementById('Email').value; // User's email
    const selectedEvent = document.getElementById('eventSelect').value; // Selected event

    // Generate a random ticket code using Math.random()
    const ticketCode = `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Check if the user-generated security key is empty (no spaces allowed)
    if (userPassword.trim() === '') {
        alert("Ticket Security Key cannot be empty."); // Alert the user if the key is empty
        return; // Stop processing if the key is empty
    }

    // Check if the security key already exists in localStorage
    if (localStorage.getItem(userPassword)) {
        // If the key is already in use, prompt the user to choose a different one
        alert("This security key is already in use. Please choose a different key.");
        return; // Stop processing to allow the user to choose a new key
    }

    // Create an object to store the user's details, including the event selection
    const userDetails = {
        username: username,         // Store the user's name
        email: email,               // Store the user's email
        ticketCode: ticketCode,     // Store the generated ticket code
        userPassword: userPassword, // Store the user-generated security key
        event: selectedEvent,       // Store the selected event
        validated: false            // Flag to track if the ticket has been validated
    };

    // Store the object in localStorage as a string, using the ticket code and the security key as separate keys
    localStorage.setItem(userPassword, JSON.stringify(userDetails)); // Store using the security key
    localStorage.setItem(ticketCode, JSON.stringify(userDetails));  // Store using the ticket code

    // Display the username, selected event, and generated ticket code in the 'ticketDisplay' div
    document.getElementById('ticketDisplay').innerHTML = `Name: ${username} <br> Event: ${selectedEvent} <br> Ticket Code: ${ticketCode}`;
});

// Event listener for validating a ticket when the validation form is submitted
document.getElementById('validateForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    
    // Retrieve the code entered for validation (it could be a security key or ticket code)
    const validationCode = document.getElementById('ticketCode').value;
    
    // Try to retrieve the stored details using the provided code
    const storedDetails = localStorage.getItem(validationCode);
    
    // If the code exists in localStorage, parse the stored details
    const userDetails = storedDetails ? JSON.parse(storedDetails) : null;

    if (userDetails) {
        // Check if the ticket has already been validated
        if (userDetails.validated) {
            // If the ticket has been validated before, show a specific error message
            document.getElementById('validationResult').innerHTML = 'This ticket has already been used!';
        } else {
            // If the ticket is valid and not yet used, show success message with user details
            const result = `Ticket Valid! Name: ${userDetails.username}, Email: ${userDetails.email}, Event: ${userDetails.event}, Ticket Code: ${userDetails.ticketCode}`;
            document.getElementById('validationResult').innerHTML = result;

            // Set the validated flag to true and update localStorage
            userDetails.validated = true;
            localStorage.setItem(userDetails.ticketCode, JSON.stringify(userDetails)); // Update by ticket code
            localStorage.setItem(userDetails.userPassword, JSON.stringify(userDetails)); // Update by security key

            // Store the check-in data for the admin dashboard
            const checkInData = JSON.parse(localStorage.getItem('checkedInAttendees')) || []; // Retrieve existing check-ins
            userDetails.checkInTime = new Date().toISOString(); // Record the check-in time
            checkInData.push(userDetails); // Add the current user's details to the check-in list
            localStorage.setItem('checkedInAttendees', JSON.stringify(checkInData)); // Save the updated list
        }
    } else {
        // If no details were found, the ticket is invalid
        document.getElementById('validationResult').innerHTML = 'Invalid Code!';
    }
});

// Admin Dashboard: Display checked-in attendees
document.addEventListener('DOMContentLoaded', function() {
    const attendeesTableBody = document.querySelector('#attendeesTable tbody'); // Get the table body for attendees
    const checkedInAttendees = JSON.parse(localStorage.getItem('checkedInAttendees')) || []; // Get the checked-in attendees list

    // Loop through each checked-in attendee and create a table row with their details
    checkedInAttendees.forEach(attendee => {
        const row = document.createElement('tr'); // Create a new row element
        row.innerHTML = `
            <td>${attendee.username}</td>          <!-- Display the attendee's name -->
            <td>${attendee.email}</td>             <!-- Display the attendee's email -->
            <td>${attendee.event}</td>             <!-- Display the event the attendee registered for -->
            <td>${attendee.ticketCode}</td>        <!-- Display the attendee's ticket code -->
            <td>${new Date(attendee.checkInTime).toLocaleString()}</td> <!-- Display the check-in time, formatted -->
        `;
        attendeesTableBody.appendChild(row); // Append the row to the table body
    });
});
