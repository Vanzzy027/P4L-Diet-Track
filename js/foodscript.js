// Global variable to store current search results for quick favoriting access
var globalFoodArray = []; 

// Targeting DOM elements
var $foodSubmit = $("#foodSubmit");
var $foodSearch = $("#foodSearch");
var $resultsContainer = $("#resultsContainer");

// Elements for the initial hero section (matching the corrected HTML)
var $heroImageContainer = $("#heroImageContainer");
var $introTextContent = $("#introTextContent");

// Edamam API Credentials
var EDAMAM_APP_ID = "3a94af5c";
var EDAMAM_APP_KEY = "dcd84ae2c299d0440ebdbbe0b34bfb80"; 

// Base URL for the Edamam Recipe Search API V2. 
// We append the app_id/key and query later.
var EDAMAM_BASE_URL = "https://api.edamam.com/api/recipes/v2?type=public"; 


// ----------------------------------------------------
// 1. INITIAL SETUP
// ----------------------------------------------------
$(document).ready(function(){
    // Hide the placeholder recipe card on load
    $("#menu0").hide();
    
    // Ensure the results container is empty on load
    $resultsContainer.empty();
});


// ----------------------------------------------------
// 2. EVENT LISTENER FOR SEARCH
// ----------------------------------------------------
$foodSubmit.on("click", function(event){
    event.preventDefault();  
    
    var foodIngredient = $foodSearch.val().trim();
    if (foodIngredient === '') {
        return; // Exit if search bar is empty
    }
    
    // CRITICAL FIX: Hide the introductory text and image after the first search
    $heroImageContainer.hide();
    $introTextContent.hide(); 

    // Clear previous results before running a new search
    $resultsContainer.empty();
    
    // CONSOLIDATED API URL CONSTRUCTION: Correctly formats the V2 API call
    var queryURL = EDAMAM_BASE_URL + 
        "&q=" + foodIngredient + 
        "&app_id=" + EDAMAM_APP_ID + 
        "&app_key=" + EDAMAM_APP_KEY;

    searchFood(queryURL);
});


// ----------------------------------------------------
// 3. EVENT LISTENER FOR SAVING FAVORITES (Delegated)
// ----------------------------------------------------
// Listens for clicks on any element with the class 'save-btn' inside the results container
$resultsContainer.on("click", ".save-btn", function(e){
    // Use closest() to reliably find the button and its data attribute
    var $targetButton = $(e.target).closest('.save-btn');
    var index = $targetButton.data("index"); 
    
    // Check if the recipe data exists in our current results array
    if (globalFoodArray[index]) {
        addToFavorites(globalFoodArray[index]);
    }
});


// ----------------------------------------------------
// 4. AJAX SEARCH FUNCTION
// ----------------------------------------------------
function searchFood(queryURL) {
    globalFoodArray = [];

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){   
        console.log("Edamam API Response:", response);

        var hits = response.hits;
        if (hits.length === 0) {
            $resultsContainer.append('<h3 class="text-center" style="font-size: 1.8rem; padding: 20px;">Sorry, no food results were found :(</h3>');
            return;
        }

        for (var i = 0; i < Math.min(hits.length, 10); i++) {
            var recipe = hits[i].recipe;
            globalFoodArray.push(recipe); 
            
            // --- BUILD THE RECIPE CARD STRUCTURE ---
            var $card = $('<div>').addClass('grid-x recipe-card').attr('id', 'menu' + i);
            
            // 1. IMAGE CELL
            var $imageDiv = $('<div>').addClass('recipe-image').css('background-image', 'url(' + recipe.image + ')'); 
            var $imageLink = $('<a>').attr('href', recipe.url).attr('target', '_blank').append($imageDiv); 
            var $imageCell = $('<div>').addClass('cell small-12 medium-5 text-center').append($imageLink);
            
            // 2. DETAILS CELL
            var $title = $('<div>').addClass('recipe-title').text(recipe.label);
            var $ingList = $('<ul>').addClass('ingredient-list');
            
            // Ingredient List Items
            for (var j = 0; j < recipe.ingredientLines.length; j++) {
                $ingList.append($('<li>').text(recipe.ingredientLines[j]));
            }
            
            var $instructions = $('<p>').css({fontSize: '1.2rem', marginTop: '10px'}).html('Source: <a href="' + recipe.url + '" target="_blank">' + recipe.source + '</a>');
            
            var $saveBtn = $('<button>')
                .addClass('save-btn')
                .attr('data-index', i) // Index needed for favoriting function
                .html('<i class="fas fa-bookmark"></i> Save'); 
                
            var $saveBtnContainer = $('<div>').addClass('save-button-container').append($saveBtn);

            var $detailsCell = $('<div>').addClass('cell small-12 medium-7 recipe-details')
                .append($title, $ingList, $instructions, $saveBtnContainer); 
            
            // --- ASSEMBLE & APPEND ---
            $card.append($imageCell, $detailsCell);
            $resultsContainer.append($card);
        }
    });
}


// ----------------------------------------------------
// 5. FAVORITES HANDLING FUNCTION
// ----------------------------------------------------
function addToFavorites(savedRecipe) {
    if (!savedRecipe) return;

    // Format the recipe object to match your local storage structure
    var formattedRecipe = {
        name: savedRecipe.label,
        ingredients: savedRecipe.ingredientLines,
        link: savedRecipe.url,
        img: savedRecipe.image
    };

    var storedData = localStorage.getItem('food');
    var array = storedData ? JSON.parse(storedData) : [];
    
    // Add new recipe
    array.push(formattedRecipe); 
    
    // Save back to localStorage
    localStorage.setItem('food', JSON.stringify(array));
    
    console.log("Recipe saved to favorites:", formattedRecipe.name);
}