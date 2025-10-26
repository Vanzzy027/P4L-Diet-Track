// js/startscript.js

$(document).ready(function() {
    
    // --- MODAL VISIBILITY HANDLERS ---
    
    var $modal = $('#startModal');
    
    // 1. Event listener for the "Start" tab in the bottom navigation
    // NOTE: Ensure your 'Start' tab link has a class or unique identifier if possible,
    // or we'll target it by its icon/span content. Using the mobile-tab-bar structure:
    var $startTab = $('#startTabLink');// Target the link with empty href for "Start"
    
    $startTab.on('click', function(e) {
        e.preventDefault();
        var $modal = $('#startModal');
        // Check if the modal exists on the current page before showing
        if ($modal.length) {
             $modal.css('display', 'block');
        }
    });

    // 2. Close the modal when the user clicks the (X) button
    $('.close-btn').on('click', function() {
        $modal.css('display', 'none');
    });

    // 3. Close the modal if the user clicks anywhere outside of the modal content
    $(window).on('click', function(event) {
        if (event.target.id === 'startModal') {
            $modal.css('display', 'none');
        }
    });

    
    // --- PROFILE FORM AND CALCULATION LOGIC ---
    
    $("#profileForm").on("submit", function(event) {
        event.preventDefault();

        // 1. Get user input values (Existing BMR/TDEE logic)
        const gender = $("#userGender").val();
        const age = parseFloat($("#userAge").val());
        const weight = parseFloat($("#userWeight").val()); 
        const height = parseFloat($("#userHeight").val()); 
        const activityFactor = parseFloat($("#userActivity").val());

        if (!gender || isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(activityFactor)) {
            alert("Please fill in all fields with valid numbers.");
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

        // 5. Display results and optionally close modal after a delay
        $("#bmrValue").text(bmrRounded);
        $("#tdeeValue").text(tdeeRounded);
        $("#resultsDisplay").slideDown(); 
        
        // Optional: Close the modal after 3 seconds to confirm submission
        setTimeout(function() {
            $modal.css('display', 'none');
            alert(`Goals set! Your TDEE is ${tdeeRounded} calories/day.`);
        }, 3000); 

        console.log("User profile saved:", userData);
    });
});