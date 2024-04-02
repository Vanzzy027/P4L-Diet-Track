// HTML Elements
var searchBarElement = $("#searchBar")


//global variables
var globalDrinksArray = []; 
var globalIngredientsArray = [];
var query = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='

//event listeners
$("#resultsContainer").on('click', function(event){
    event.preventDefault();
    if(event.target.matches('.fa-heart')){
        addToFavorites(globalDrinksArray[event.target.parentNode.dataset.index], event.target.parentNode.dataset.index)
    }
    if(event.target.matches('.favoriteButton')){
        addToFavorites(globalDrinksArray[event.target.dataset.index], event.target.dataset.index)
    }
})

$("#searchButton").on("click", function (event) {
    event.preventDefault();
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

function searchDrink(queryURL) {
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        $('#resultsContainer').empty();
        $('#resultsContainer').prepend('<hr>')
        var drinksArray = response.drinks

        if(quickNull(drinksArray)){
            $('#resultsContainer').append('<h3>Sorry, no results were found with your search :(</h3>')
            return
        }
        globalDrinksArray = drinksArray
        for (var i = 0; i < drinksArray.length; i++) {
            var newRow = $("<div></div>")
            newRow.attr('class', 'rowContainer')
            newRow.attr('data-index', i)

            //add the image
            var newImg = $("<img>")
            newImg.attr('src', drinksArray[i].strDrinkThumb)
            newImg.attr('height', '120')
            newImg.attr('width', '180')

            newRow.append(newImg)
            
            //add the name and ingredients
            var description = $("<p></p>")
            description.attr('class', 'drinkInfo')

            //name
            description.append('<span>Name: </span>')
            var text = document.createTextNode(drinksArray[i].strDrink)
            description.append(text)
            description.append('<br>')
           
            //ingredients
            description.append('<span>Ingredients:</span><br>')
            var ingredientsArray = gatherIngredients(drinksArray[i]);
            globalIngredientsArray.push(ingredientsArray);
            for(var j = 0; j < ingredientsArray.length; j++){
                var string = ingredientsArray[j].measure
                if(ingredientsArray[j].measure == null){
                    string = "To taste"
                 }

                description.append(ingredientsArray[j].ingredient + ': ' + string + '<br>')
            }

            //directions
            description.append('<span>Instructions: </span>')
            text = document.createTextNode(drinksArray[i].strInstructions)
            description.append(text)


            newRow.append(description)
            var newBtn = $('<button><i class="fas fa-heart "></i></button>')
            newBtn.attr('class', 'button favoriteButton');
            newBtn.attr('data-index', i)
            
            $(newRow).append(newBtn)
            $("#resultsContainer").append(newRow)
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