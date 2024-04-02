
var foodArray = JSON.parse(localStorage.getItem("food"));
console.log(foodArray);
function food() {

  for (var i = 0; i < foodArray.length; i++) {
    var newRow = $("<div></div>")
    newRow.attr('class', 'rowContainer')
    newRow.attr('data-index', i)
    var cardHeader = $("<div>" + "<h4>" + foodArray[i].name + "</h4>" + "</div>")    // title of drink will be stored here
    cardHeader.attr('class', 'card-divider')
    newRow.append(cardHeader)
    //add the image
    var imgDiv = $("<div></div>")
    imgDiv.attr('class', 'imgDiv')
    var newImg = $("<a href = " + foodArray[i].link + " target='_blank'" + "><img src =" + foodArray[i].img + " width=\"180\" height=\"120\"" + "data-index=" + i + "></a>");
    imgDiv.append(newImg)
    newRow.append(imgDiv)
    var ingredients = $("<li></ul>") // ingredients to make drinks will be stored here
    ingredients.attr('class', 'Ingredients')
    newRow.append(ingredients)
    for (var j = 0; j < foodArray[i].ingredients.length; j++) { // for loop to add each ingredient
      ingredientsItem = $("<ul></ul>")
      ingredientsItem.attr('class', 'foodItem')
      ingredientsItem.text(foodArray[i].ingredients[j])
      ingredients.append(ingredientsItem)

    }

    // button to remove from favorites
    var removeButton = $("<button></button>")
    removeButton.attr('class', 'button delete-button')
    removeButton.text("Delete")
    removeButton.attr('data-index', i)
    newRow.append(removeButton)
    $("#food").append(newRow)

  }


}
// on click event to open the recipe link stored in the img
$("#food").on('click', function (event) {
  event.preventDefault();
  if (event.target.matches('img')) {
    recipeLink(event.target.dataset.index);
  }

})
// onclick event to delete an item from the page
$("#food").on('click', function (event) {
  event.preventDefault();
  if (event.target.matches('.delete-button')) {
    removeFood(event.target.dataset.index);
  }
})

var drinksArray = JSON.parse(localStorage.getItem("drinks"));
console.log(drinksArray);
function drink() {

  for (var i = 0; i < drinksArray.length; i++) {
    var newRow = $("<div></div>")
    newRow.attr('class', 'rowContainer')
    newRow.attr('data-index', i)
    var cardHeader = $("<div>" + "<h4>" + drinksArray[i].name + "</h4>" + "</div>")    // title of drink will be stored here
    cardHeader.attr('class', 'card-divider')
    newRow.append(cardHeader)
    //add the image
    var newImg = $("<img>")
    newImg.attr('src', drinksArray[i].image)
    newImg.attr('height', '120')
    newImg.attr('width', '180')
    newRow.append(newImg)
    var ingredients = $("<li></ul>") // ingredients to make drinks will be stored here
    ingredients.attr('class', 'Ingredients')
    newRow.append(ingredients)

    for (var j = 0; j < drinksArray[i].ingArray.length; j++) {
      ingredientsItem = $("<ul></ul>")
      ingredientsItem.attr('class', 'ingredientsItem')
      ingredientsItem.text(drinksArray[i].ingArray[j].ingredient + ": " + drinksArray[i].ingArray[j].measure)
      ingredients.append(ingredientsItem)
    }
    //directions
    var instructions = $("<div></div>")
    instructions.attr('class', "instructions")
    instructions.text(drinksArray[i].instructions)
    newRow.append(instructions)
    // button to remove from favorites
    var removeButton = $("<button></button>")
    removeButton.attr('class', 'button delete-button')
    removeButton.text("Delete")
    removeButton.attr('data-index', i)
    newRow.append(removeButton)
    $("#drink").append(newRow)

  }
}
// button to remove a drink from the page
$("#drink").on('click', function (event) {
  event.preventDefault();
  if (event.target.matches('.delete-button')) {
    removeDrink(event.target.dataset.index);
  }
})

// function to remove a drink from the page
function removeDrink(index) {
  console.log(index);
  console.log(drinksArray)
  drinksArray.splice(index, 1);
  console.log(drinksArray);
  localStorage.setItem('drinks', JSON.stringify(drinksArray))
  refreshPage()

}
// function to remove fod from the page
function removeFood(index) {
  console.log(index);
  console.log(foodArray)
  foodArray.splice(index, 1);
  console.log(foodArray);
  localStorage.setItem('food', JSON.stringify(foodArray))
  refreshPage()


}

function recipeLink(index) {
  console.log(index);
  window.open(foodArray[index].link);
}

function refreshPage() {
  location.reload();
}

if (foodArray !== null) {
  food();
}
if (drinksArray !== null) {
  drink();
}

