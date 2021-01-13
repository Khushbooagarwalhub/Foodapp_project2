// FOR USE UPDATING RECIPE.HTML

// List of supported diets
var diets = ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
  'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal',
  'Whole30'];

// Reorganize list 
var diet_dicts = [];
for (var i = 0; i < diets.length; i = i + 2) {
  var dictionary = {
    col1: diets[i],
    col2: diets[i + 1],
  }
  diet_dicts.push(dictionary);
};

// Pupulate diets list 
d3.select("#diet-list").select("tbody")
  .selectAll("tr")
  .data(diet_dicts)
  .enter()
  .append("tr")
  .html(function (d) {
    return `<td>${d.col1}</td><td>${d.col2}</td>`
  });

// List of supported cuisines - append to a table with two columns
var cuisines = ["African", "American", "British", "Cajun", "Caribbean",
  "Chinese", "Eastern European", "European", "French", "German",
  "Greek", "Indian", "Irish", "Italian", "Japanese", "Korean",
  "Latin American", "Mediterranean", "Mexican",
  "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese", "", ""];


// Reorganize list
var cuisine_dicts = [];
for (var i = 0; i < cuisines.length; i = i + 3) {
  var dictionary = {
    col1: cuisines[i],
    col2: cuisines[i + 1],
    col3: cuisines[i + 2]
  }
  cuisine_dicts.push(dictionary);
};

// Populate cuisines list - appned to a table with three columns
d3.select("#cuisine-list").select("tbody")
  .selectAll("tr")
  .data(cuisine_dicts)
  .enter()
  .append("tr")
  .html(function (d) {
    return `<td>${d.col1}</td><td>${d.col2}</td><td>${d.col3}</td>`
  });

// Program buttons to change color and text when clicked
function changeButton(button) {
  button.style.background = '#5cb85c';
  button.style.color = "white";
  button.innerHTML = "Success!";
}

d3.select("#filter-btn").on("click", function () {
  changeButton(document.getElementById("macros-btn"));
})

d3.select("#ingredients-btn").on("click", function () {
  changeButton(document.getElementById("ingredients-btn"));
})

d3.select("#description-btn").on("click", function () {
  changeButton(document.getElementById("description-btn"));
})

d3.select("#general-btn").on("click", function () {
  var button = document.getElementById("general-btn");
  button.style.background = '#5cb85c';
  button.style.color = "white";
  button.innerHTML = "Scroll Down";
})

// Progress bar
function move() {
  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, 140);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
      elem.innerHTML = width * 1 + '%';
    }
  }
}