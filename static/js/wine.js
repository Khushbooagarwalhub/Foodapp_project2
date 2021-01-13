// UPDATES WINE.HTML

// create a variable for data.js
var tableData = data;
console.log(data);

// Examine data
var tbody = d3.select("tbody");
data.forEach(function (winedata) {
    console.log(winedata)
    Object.entries(winedata).forEach(function ([key, value]) {
        console.log(key, value);
    });
});


var filterbtn = d3.select("#filter-btn");
filterbtn.on("click", function () {

    filteredData = tableData;
    d3.event.preventDefault();

    var inputElement = d3.select("#foodtype");
    var inputValue = inputElement.property("value").toLowerCase();
    console.log(inputValue);

    //filter data based on user input
    if (inputValue != "") {
        filteredData = filteredData.filter(winedata => winedata.food === inputValue);
    }
    else {
        filteredData = filteredData.filter(winedata => winedata.food === "steak");
    }
    console.log(filteredData);


    // Display the filtered data in a table
    tbody.text("")
    var row = tbody.append("tr");
    var cell = row.append("td");
    cell.text("Food");
    var cell = row.append("td");
    cell.text("Paired Wine");
    var cell = row.append("td");
    cell.text("Pairing Text");
    filteredData.forEach(function (winedata) {
        console.log(winedata)
        var row = tbody.append("tr");
        Object.entries(winedata).forEach(function ([key, value]) {
            console.log(key, value);
            var cell = row.append("td");
            cell.text(value);
        });
    });
});


function init() {

    var selector = d3.select("#food_trivia");

    selector.on("click", function () {
        d3.event.preventDefault();

        //Display trivia 
        d3.json("/trivia").then((triviaData) => {
            console.log(triviaData);
            //});
            tbody.text("");
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(triviaData.text);

        });
    });
}
init();

// Display GIF when user requests food trivia
function showDiv() {
    tbody.text("");
    document.getElementById('food_trivia').style.display = "block";
    document.getElementById('loadingGif').style.display = "block";
    setTimeout(function () {
        document.getElementById('loadingGif').style.display = "none";
        document.getElementById('showme').style.display = "block";
    }, 6000);

}