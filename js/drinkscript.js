// HTML Elements
var searchBarElement = $("#searchBar")


//global variables
var globalDrinksArray = []; 
var globalIngredientsArray = [];
var query = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='

//event listeners
$("#resultsContainer").on('click', function(event){
    event.preventDefault();
    
    // Use closest to ensure we target the button/container if the icon is clicked
    var $target = $(event.target).closest('.favoriteButton, .fa-heart');

    if($target.length > 0){
        var index = $target.data('index');
        addToFavorites(globalDrinksArray[index], index);
    }
})

$("#searchButton").on("click", function (event) {
    event.preventDefault();

    console.log('You are stu');
    globalDrinksArray = []
    globalIngredientsArray = []
    if (searchBarElement.val() === '') {
        return;
    }
    var queryURL = query + searchBarElement.val();
    searchDrink(queryURL);
})

// functions
function addToFavorites(drinkObj, index){

    var test = localStorage.getItem('drinks')
    
    if(quickNull(test)){
        //there is no local storage 'drinks'
        var array = [];
        var formattedDrinkObject = formatObject(drinkObj, index)
        array.push(formattedDrinkObject)
        localStorage.setItem('drinks', JSON.stringify(array));
    }else{

        //there is a local storage item 'drinks'
        var dataArray = JSON.parse(localStorage.getItem('drinks'))
        var formattedDrinkObj = formatObject(drinkObj, index)
        dataArray.push(formattedDrinkObj)
        localStorage.setItem('drinks', JSON.stringify(dataArray))
    }
}

function formatObject(object, index){
    var tempArray = globalIngredientsArray[index]

    var newObject = {
        name: object.strDrink,
        ingArray: tempArray,
        instructions: object.strInstructions,
        image: object.strDrinkThumb
    }
    return newObject
}


// functions

function searchDrink(queryURL) {
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        // Clear results container and add separator
        $('#resultsContainer').empty();
        $('#resultsContainer').prepend('<hr>');
        
        var drinksArray = response.drinks

        if(quickNull(drinksArray)){
            $('#resultsContainer').append('<h3 class="text-center" style="font-size: 1.8rem; padding: 20px;">Sorry, no results were found with your search :(</h3>');
            return;
        }
        globalDrinksArray = drinksArray
        
        // Loop through the drinks and build the new card structure
        for (var i = 0; i < drinksArray.length; i++) {
            var drink = drinksArray[i];
            
            // --- 1. BUILD THE RECIPE CARD STRUCTURE (Matching Food Page) ---
            
            // Outer container: <div class="grid-x recipe-card" id="menu[i]">
            var $card = $('<div>')
                .addClass('grid-x recipe-card')
                .attr('id', 'menu' + i);
            
            // Image Cell: <div class="cell small-12 medium-5 text-center">
            var $imageCell = $('<div>')
                .addClass('cell small-12 medium-5 text-center');
                
            // Image Placeholder: <div id="drink-pic[i]" class="recipe-image">
            var $imageDiv = $('<div>')
                .attr('id', 'drink-pic' + i) // Semantically changed from food-pic
                .addClass('recipe-image')
                .css('background-image', 'url(' + drink.strDrinkThumb + ')'); 
                
            $imageCell.append($imageDiv);

            // Details Cell: <div id="spacing" class="cell small-12 medium-7 recipe-details">
            var $detailsCell = $('<div>')
                .addClass('cell small-12 medium-7 recipe-details')
                .attr('id', 'spacing');
            
            // Title: <div id="ingredientSection[i]" class="recipe-title">
            var $title = $('<div>')
                .attr('id', 'ingredientSection' + i)
                .addClass('recipe-title')
                .text(drink.strDrink);
                
            // Ingredients List: <ul class="ingredient-list">
            var $ingList = $('<ul>')
                .addClass('ingredient-list');
                
            var $ingListContainer = $('<div>')
                .attr('id', 'ingredients' + i);
            
            // Gather ingredients and append them as <li> elements
            var ingredientsArray = gatherIngredients(drink);
            globalIngredientsArray.push(ingredientsArray);
            
            for(var j = 0; j < ingredientsArray.length; j++){
                var measure = ingredientsArray[j].measure || "To taste"; // Handle null measure
                var $listItem = $('<li>').text(ingredientsArray[j].ingredient + ': ' + measure);
                $ingList.append($listItem);
            }
            
            $ingListContainer.append($ingList);
            
            // Instructions 
            var $instructions = $('<p>')
                .css({fontSize: '1.2rem', marginTop: '10px'})
                .html('<strong>Instructions:</strong> ' + drink.strInstructions);
            
            // Save Button: <div id="saveBtn[i]" class="save-button-container">
            var $saveBtnContainer = $('<div>')
                .attr('id', 'saveBtn' + i)
                .addClass('save-button-container');
            
            // Save Button: <button class="save-btn">
            var $saveBtn = $('<button>')
                .addClass('save-btn favoriteButton')
                .attr('data-index', i)
                .html('<i class="fas fa-bookmark"></i> Save'); 
                
            $saveBtnContainer.append($saveBtn);

            // --- 2. ASSEMBLE THE CARD ---
            // Changed the order slightly to match typical food card content flow
            $detailsCell.append($title, $ingListContainer, $instructions, $saveBtnContainer); 
            $card.append($imageCell, $detailsCell);
            
            // --- 3. APPEND TO RESULTS CONTAINER ---
            $("#resultsContainer").append($card);
        }
    })
}


function createObject(ingredient, measure) {

    var newObj = {
        ingredient: ingredient,
        measure: measure
    }

    return newObj;
}

function quickNull(x){
    if(x == null){
        return true;
    }else{
        return false;
    }
}

// gatherIngredients puts ingredients of a drink into a usable array
function gatherIngredients(drinkBlock){
    var ingredientToMeasureArray = [];
    var ingredient;
    var measure;

    for( var i = 1; i <= 15; i++){
        ingredient = drinkBlock["strIngredient" + i]
        measure = drinkBlock["strMeasure" + i]

        if(!quickNull(ingredient) && ingredient != ''){
            ingredientToMeasureArray.push(createObject(ingredient,measure))
        }

    }
    return ingredientToMeasureArray;
}