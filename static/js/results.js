// UPDATES RESULTS.HTML

// Grab recipe results and store in variable
var myRecipes = JSON.parse(document.getElementById("myRecipes").dataset.recipe);
var recipe_images = myRecipes.map(d => d.image);
console.log(recipe_images);

// Main function that calls all subfunctions
function recipe_results_page(recipe) {
    quick_info_plot(recipe);
    nutrition_plot(recipe);
    ingredients_list(recipe);
    instructions_list(recipe);
    recipe_summary(recipe);
}

// Updates nutriontanl summary table
function quick_info_plot(recipe) {
    var nutrition = recipe['nutrients'];
    var healthScore = recipe['healthScore'];

    var titles = ['Calories', 'Fat', 'Carbohydrates', 'Protein'];
    var quick_info_dict = { hScore: `${Math.round(healthScore)}% Health Score` }

    nutrition.forEach(info => {

        if (titles.includes(info.title)) {
            switch (info.title) {
                case 'Calories':
                    quick_info_dict['cal'] = `${Math.round(info['amount'])} ${info['title']}`;
                    break;
                case 'Fat':
                    quick_info_dict['fat'] = `${Math.round(info['amount'])}${info['unit']} ${info['title']}`;
                    break;
                case 'Carbohydrates':
                    quick_info_dict['carb'] = `${Math.round(info['amount'])}${info['unit']} ${info['title']}`;
                    break;
                case 'Protein':
                    quick_info_dict['protein'] = `${Math.round(info['amount'])}${info['unit']} ${info['title']}`;
                    break;
            }
        }

    });
    var quick_info = [quick_info_dict];

    var quick_info_table = d3.select("#quick-info").select("thead");
    quick_info_table.html("");

    quick_info_table
        .selectAll("tr")
        .data(quick_info)
        .enter()
        .append("tr")
        .html(function (d) {
            return `<th>${d.cal}</th><th>${d.fat}</th><th>${d.carb}</th><th>${d.protein}</th><th>${d.hScore}</th>`
        });

    console.log(quick_info)
}

// Updates nutrition bar chart
function nutrition_plot(recipe) {
    var names = recipe['nutrients'].map(item => item.title);
    var percentage = recipe['nutrients'].map(item => item.percentOfDailyNeeds);

    // Format direct lables that will be displayed on each bar
    var labels = []
    percentage.forEach(percent => {
        labels.push(`${Math.round(percent)}%`)
    })

    // "Bad" nutrients
    var trace1 = {
        x: percentage.slice(0, 7),
        y: names.slice(0, 7),
        type: 'bar',
        orientation: 'h',
        text: labels.slice(0, 7),
        textposition: 'auto',
        marker: {
            color: "#EE6363"
        },
        name: "Limit These"
    };

    // "Good" nutrients
    var trace2 = {
        x: percentage.slice(7, (percentage.length - 1)),
        y: names.slice(7, (names.length - 1)),
        type: 'bar',
        orientation: 'h',
        text: labels.slice(7, (names.length - 1)),
        textposition: 'auto',
        marker: {
            color: "#79CDCD"
        },
        name: "Get Enough of These"
    };
    var data = [trace2, trace1,];

    var layout = {
        paper_bgcolor: "#FDF2E9",
        plot_bgcolor: "#FDF2E9",
        width: 'auto',
        height: 600,
        margin: {
            l: 100,
            r: 30,
            t: 10,
            b: 50
        },
        yaxis: {
            ticklen: 6,
        },
        xaxis: {
            title: { text: 'Percent of Daily Needs' }
        }
    };

    Plotly.newPlot("nutrition-plot", data, layout)
}

// Updates ingredients list
function ingredients_list(recipe) {

    var ingredients = recipe['ingredients'];
    var ingred_list = d3.select('#ingredients').select("ul");
    ingred_list.html("");

    ingred_list
        .selectAll("li")
        .data(ingredients)
        .enter()
        .append("li")
        .html(function (d) {
            return `<em>${d}</em>`
        });
}

// Updates instrucitons list
function instructions_list(recipe) {

    var instructions = recipe['instructions'];
    var instruct_list = d3.select('#instructions').select("ul");
    instruct_list.html("");

    instruct_list
        .selectAll("li")
        .data(instructions)
        .enter()
        .append("li")
        .attr("type", "circle")
        .html(function (d) {
            return `<em>${d}</em>`
        })

    // console.log(instructions)
}

// Updates title, image, and recipe discription
function recipe_summary(recipe) {

    var title = d3.select('#results-wrap').select("h1");
    var image = d3.select('#recipe-image').select("img");
    var description = [String(recipe['summary'])];

    title.html("");
    image.html("");

    title.text(recipe.title);
    image.attr("src", recipe.image);

    d3.select("#recipe_summary")
        .select("p")
        .data(description)
        .html(function (d) {
            return d
        })
}

// Initialize results dashboard with data about first recipe in list of 10
function init() {
    var selector = d3.select("#select-recipe");

    myRecipes.forEach((recipe) => {
        selector
            .append("option")
            .text(recipe.title)
            .property("value", recipe.image);
    });

    recipe_results_page(myRecipes[0]);
}

// Update resutls dashboard if new recipe is selected
function recipe_changed(newRecipeImage) {
    var new_recipe_index = recipe_images.indexOf(String(newRecipeImage));
    var new_recipe = myRecipes[new_recipe_index];
    console.log(newRecipeImage);
    console.log(new_recipe_index);

    recipe_results_page(new_recipe);
}

init()
