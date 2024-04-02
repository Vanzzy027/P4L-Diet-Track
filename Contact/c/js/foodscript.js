//Global Array variable to save to local storage
var globalFoodArray = [];

//When document is ready, hide menu items
$(document).ready(function(){
    $("#menu0").hide();
    $("#menu1").hide();
    $("#menu2").hide();
    $("#menu3").hide();
    $("#menu4").hide();
    $("#menu5").hide();
    $("#menu6").hide();
    $("#menu7").hide();
    $("#menu8").hide();
    $("#menu9").hide();
})

//Function for when the food is typed out and clicked to search
$("#foodSubmit").on("click", function(event){
    event.preventDefault();  
  //on foodSubmit click hide main menu
    $(".hidden").hide();
 //on foodSubmit click show menu items
    $("#menu0").show();
    $("#menu1").show();
    $("#menu2").show();
    $("#menu3").show();
    $("#menu4").show();
    $("#menu5").show();
    $("#menu6").show();
    $("#menu7").show();
    $("#menu8").show();
    $("#menu9").show();
//makes the searched food a variable called foodIngredient
var foodIngredient = $("#foodSearch").val();
//URL including the APP ID and APP Key
var queryURL = "https://api.edamam.com/search?q=" + foodIngredient +  "&app_id=3a94af5c&app_key=dcd84ae2c299d0440ebdbbe0b34bfb80"

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){   
    console.log(response);
    //Loop for 10 recipes to load on page
    for (var i = 0; i < 10; i++){
        //Saves picture and adds link to it and then appends the page        
        var foodPicture = response.hits[i].recipe.image;
        var foodPictureEl = $("<a href = " + response.hits[i].recipe.url + "><img src =" + foodPicture + "></a>");        
        $("#food-pic" + i).append(foodPictureEl);
        //Saves recipe name from AJAX call and prepends it
        var recipeName = response.hits[i].recipe.label;
        $("#ingredientSection" + i).prepend(recipeName);
        //this saves the recipe into a variable called ingredientARR
        var ingredientARR = response.hits[i].recipe.ingredientLines;
        var ingredients = $("#ingredients" + i)
        //this creates a button using fontawesome <i> and adds a heart and color
        var buttonEl = $("<button><i class = 'fas fa-heart'" + "data-index=" + i + "></i></button>");
        buttonEl.attr('class', 'button favoriteButton');         
        buttonEl.attr("data-index", i)              
        $("#saveBtn" + i).append(buttonEl);

        //this is a loop to create a list of ingredients and appends it
        for (var j = 0; j < ingredientARR.length; j++){                          
             var ingredientList = $("<li>" + ingredientARR[j] + "</li>");             
             ingredients.append(ingredientList);
         }
    }       
    //this waits for a click in the results container to save the button into an object called savedRecipe
    $(".button").on("click", function (e){        
        var name = $(e.target).data("index");        
        var savedRecipe = {
            name: response.hits[name].recipe.label,
            ingredients: response.hits[name].recipe.ingredientLines,
            link: response.hits[name].recipe.url,
            img: response.hits[name].recipe.image
        };           
              
        addToFavorites();
        
        //function to add to favorites for storage and other pages
        function addToFavorites(){
            var test = localStorage.getItem('food')            
            if(test === null){
                var array = [];
                array.push(savedRecipe);                
                localStorage.setItem('food', JSON.stringify(array));
            } else{
                var globalFoodArray = JSON.parse(localStorage.getItem('food'));
                globalFoodArray.push(savedRecipe);
                localStorage.setItem('food', JSON.stringify(globalFoodArray));
            }
        }       
    });
});
});
