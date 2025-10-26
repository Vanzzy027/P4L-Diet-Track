// Initialize Foundation framework
$(document).foundation();
console.log("Foundation initialized.");

// Global logic for the Start Modal and Profile Calculation
$(document).ready(function() {
    
    // Define variables for the global modal and button
    var $modal = $('#startModal'); 
    var $startTab = $('#startTabLink'); 
    
    console.log("DOM is ready. Modal element found:", $modal.length > 0);
    console.log("Start Tab Link element found:", $startTab.length > 0);
    
    // --- MODAL VISIBILITY HANDLERS ---
    
    // 1. Event listener for the "Start" tab in the bottom navigation
    $startTab.on('click', function(e) {
        e.preventDefault();
        console.log("Start Tab Clicked.");

        // Check if the modal element exists before trying to show it
        if ($modal.length) {
             $modal.css('display', 'block');
             // Hide the results display on a new open (crucial for good UX)
             $('#resultsDisplay').hide();
             console.log("Start Modal displayed.");
        } else {
             console.error("Error: #startModal element not found in the HTML.");
        }
    });

    // 2. Close the modal when the user clicks the (X) button
    $('.close-btn').on('click', function() {
        $modal.css('display', 'none');
        console.log("Modal closed via X button.");
    });

    // 3. Close the modal if the user clicks anywhere outside of the modal content
    $(window).on('click', function(event) {
        if (event.target.id === 'startModal') {
            $modal.css('display', 'none');
            console.log("Modal closed via outside click.");
        }
    });

    
    // --- PROFILE FORM AND CALCULATION LOGIC ---
    
    $("#profileForm").on("submit", function(event) {
        event.preventDefault();
        console.log("Profile Form submitted.");

        // 1. Get user input values
        const gender = $("#userGender").val();
        const age = parseFloat($("#userAge").val());
        const weight = parseFloat($("#userWeight").val()); 
        const height = parseFloat($("#userHeight").val()); 
        const activityFactor = parseFloat($("#userActivity").val());

        console.log(`Input data: Gender=${gender}, Age=${age}, Weight=${weight}, Height=${height}, ActivityFactor=${activityFactor}`);

        if (!gender || isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(activityFactor)) {
            // Using a custom message box instead of alert()
            console.error("Validation Error: Please fill in all fields with valid numbers.");
            // In a real app, you would show a message on screen, not use an alert.
            // For now, let's stick to the log and prevent further execution.
            return;
        }

        // 2. Calculate BMR (Mifflin-St Jeor Equation)
        let bmr;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // 3. Calculate TDEE
        const tdee = bmr * activityFactor;

        // Round results
        const bmrRounded = Math.round(bmr);
        const tdeeRounded = Math.round(tdee);
        console.log(`Calculated BMR: ${bmrRounded}, TDEE: ${tdeeRounded}`);


        // 4. Save results and user data to Local Storage
        const userData = {
            gender: gender,
            age: age,
            weight: weight,
            height: height,
            activityFactor: activityFactor,
            bmr: bmrRounded,
            tdee: tdeeRounded,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('userProfile', JSON.stringify(userData));
        console.log("User profile saved to localStorage:", userData);


        // 5. Display results and close modal after a delay
        $("#bmrValue").text(bmrRounded);
        $("#tdeeValue").text(tdeeRounded);
        $("#resultsDisplay").slideDown(); 
        
        setTimeout(function() {
            $modal.css('display', 'none');
            console.log("Modal closed automatically after 3 seconds.");
        }, 3000); 
    });
});
