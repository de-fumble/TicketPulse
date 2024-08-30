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
