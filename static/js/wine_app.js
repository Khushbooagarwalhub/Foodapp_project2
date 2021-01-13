// create a variable for data.js
var tableData = data;

// Examine data
var titles = data.map(d => d.title);
var descriptions = data.map(d => d.Description);
var image_urls = data.map(d => d.url);
var ratings = data.map(d => d.avg_rating);
var prices = data.map(d => d.price);
var names = data.map(d => d.Name);

// Select wine recommendation table
var wine_table = d3.select('#food-table').select('tbody');
wine_table.html("");

// Update wine recommendation table
var filterbtn = d3.select("#filter-btn");
filterbtn.on("click", function () {

    filteredData = tableData;
    d3.event.preventDefault();

    var inputElement = d3.select("#winetype");
    var inputValue = inputElement.property("value").toLowerCase();
    console.log(inputValue);

    //filter the data according to user input
    if (inputValue != "") {
        filteredData = filteredData.filter(wine_recommendation_data => wine_recommendation_data.Name === inputValue);
    }
    else {
        filteredData = filteredData.filter(wine_recommendation_data => wine_recommendation_data.Name === "merlot");
    }


    console.log(filteredData);
    wine_table.html("")
    wine_table.selectAll("tr")
        .data(filteredData)
        .enter()
        .append("tr")
        .html(function (d) {
            return `<td>${d.title}</td><td>${d.avg_rating*100}</td><td>${d.price}</td><td>${d.Description}</td><th><img src=${d.url}></th>`
        });
});

// Build wine ratings and price plot
function buildPlot(data) {
    var ratings = data.map(d => d.avg_rating * 100);
    var prices = data.map(d => d.price);
    var titles = data.map(d => d.title);
    var names = data.map(d => d.Name);
    console.log(titles);

    // Format price label
    var price_label = []
    prices.forEach(price => {
        price_label.push(`${price}`)
    });

    // Price
    var trace1 = {
        y: prices,
        x: names,
        type: 'bar',
        text: titles,
        marker: {
            color: "#0080ff",
            size: 10
        },
        name: "Price",
    };

    // Rating
    var trace2 = {
        y: ratings,
        x: names,
        type: 'bar',
        text: titles,
        marker: {
            color: "#c0c0c0",
            size: 10
        },
        name: "Rating"
    };
    var data = [trace2, trace1,];

    var layout = {
        width: 900,
        height: 600,
        margin: {
            l: 50,
            r: 10,
            t: 50,
            b: 100

        },

        yaxis: {
            ticklen: 6,
            showgrid: false,
            title: { text: 'Rating/Price' },
        },
        xaxis: {
            title: { text: 'Wines' },
            showgrid: false,
            tickangle: -45
        },
        title: 'Charting Wine Ratings and Price',
        barmode: 'group'

    };

    Plotly.newPlot("plot", data, layout)
}

// Initialize page with bar chart
function init() {
    d3.select("#more_info").node().value = "";
    buildPlot(data);
}

init();