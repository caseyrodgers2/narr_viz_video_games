/*
CS 416 Narrative Visualization
Casey Rodgers

References
// Data
- https://www.kaggle.com/datasets/gregorut/videogamesales?resource=download

// Main Coding References
- https://d3-graph-gallery.com/graph/line_several_group.html
- http://learnjsdata.com/group_data.html
- https://d3-graph-gallery.com/graph/line_basic.html
- https://stackoverflow.com/questions/46309959/using-nest-and-rollup-to-create-a-line-chart-with-a-mean-in-d3-v4
- https://stackoverflow.com/questions/51810621/d3-find-max-key-value-in-nested-arrays
- https://d3-graph-gallery.com/graph/custom_legend.html
- https://d3-annotation.susielu.com/#examples


// Helper Coding References
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
- https://d3-graph-gallery.com/graph/basic_datamanipulation.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- https://www.geeksforgeeks.org/d3-js-d3-max-function/
- https://observablehq.com/@d3/d3-ascending
- https://github.com/d3/d3-scale-chromatic
- https://stackoverflow.com/questions/11189284/d3-axis-labeling#:~:text=Axis%20labels%20aren't%20built,adding%20an%20SVG%20text%20element.
- https://www.essycode.com/posts/adding-gridlines-chart-d3/
- https://stackoverflow.com/questions/13715900/d3-js-plotting-multiple-data-sets-from-separate-files
- https://stackoverflow.com/questions/44248907/assign-mouse-click-handler-to-line-in-d3-with-snapping-behaviour
- https://stackoverflow.com/questions/28390754/get-one-element-from-d3js-selection-by-index
- https://www.w3schools.com/js/js_loop_for.asp
- https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
- https://observablehq.com/@d3/d3-sum
- https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
- https://stackoverflow.com/questions/1533568/what-is-the-correct-way-to-write-html-using-javascript
- https://stackoverflow.com/questions/30518546/how-to-append-text-to-a-div-in-d3
- https://observablehq.com/@d3/margin-convention
- https://observablehq.com/@d3/d3-extent
- https://stackoverflow.com/questions/73091012/remove-d3-annotation-after-transition
- https://www.w3schools.com/js/js_comparisons.asp
- https://www.w3schools.com/js/js_json.asp
- https://attacomsian.com/blog/javascript-array-populate#:~:text=In%20JavaScript%2C%20you%20can%20use,and%20returns%20the%20modified%20array.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs

*/

async function init() {

// Start loading data
const data2 = await d3.csv("vgsales.csv");
var data = data2.filter(function(d) { return d.Year != "N/A"; });  // Remove entries with year N/A
    
//console.log(JSON.stringify(data));
    
// Svg Properties
var margin = ({top: 75, bottom: 75, left: 75, right: 30});
var svg_width = 1000;
var svg_height = 500;

var legend_width = 100;
var legend_height = 500;
    
    
// Function to check if the annotations are going out of bounds
// absValue = either x or y
// dValue = either dx or dy
// direction = either in the x direction (0) or the y direction (1)
// Returns a new dValue to prevent it from going out of bounds or the original dValue
function outOfBounds(absValue, dValue, direction) {
    var result = dValue;
    // X direction
    if (direction == 0) {
        if (absValue + dValue - 50 < 0 || absValue + dValue + 50 > svg_width) {
            result = -dValue;
        }
    } else if (direction == 1) {
        if (absValue + dValue - 50 < 0) {
            result = -dValue;
        }
    }
    return result;
}

    
///////////* Overview */////////
// Set up initial svg
var overview_svg = d3.select("#byOverview")
    .append("svg")
        .attr("width", svg_width + margin.left + margin.right)
        .attr("height", svg_height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

// Prepare data (total global sales vs year)
var total_sales_by_year = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return {
        total_sales: d3.sum(v, function(d) { return d.Global_Sales; }) }; })
    .sortKeys(d3.ascending)
    .entries(data);

console.log(JSON.stringify(total_sales_by_year));
    
// Graph Title
overview_svg.append("text")
    .attr("class", "graph_title")
    .attr("text-anchor", "middle")
    .attr("x", svg_width / 2)
    .attr("y", -10)
    .text("Total Global Sales over Time");
    
// Add X axis => year
var overview_x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([0, svg_width]);
    
overview_svg.append("g")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(d3.axisBottom(overview_x).ticks(10));

// X axis label
overview_svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", svg_width / 2)
    .attr("y", svg_height + 40)
    .text("Year");
    
// X axis grid lines
overview_svg.append("g")
    .attr("class", "x axis-grid")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(d3.axisBottom(overview_x).tickSize(-svg_height).tickFormat('').ticks(10));
    
    
// Add Y axis => Total Global Sales
var overview_y = d3.scaleLinear()
    .domain([0, d3.max(total_sales_by_year, function(d) { return d.value.total_sales})])
    .range([svg_height, 0]);
    
overview_svg.append("g")
    .call(d3.axisLeft(overview_y).ticks(10));
    
// Y axis label
overview_svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -svg_height / 2)
    .attr("y", -50)
    .attr("dy", "0.75em")
    .text("Total Global Sales (in millions)")
    .attr("style", "transform: rotate(-90deg);");
    
// Y axis grid lines
overview_svg.append("g")
    .attr("class", "y axis-grid")
    .call(d3.axisLeft(overview_y).tickSize(-svg_width).tickFormat('').ticks(10));

    
// Define the line
var overview_line = d3.line()
    .x(function(d) { return overview_x(d.key); })
    .y(function(d) { return overview_y(d.value.total_sales); });


// Draw the line
overview_svg.selectAll(".line_over")
    .data(total_sales_by_year)
    .enter()
    .append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", overview_line(total_sales_by_year))
        .attr("class", "line_over");
    

// Draw line for clicking
var transparentLine_over = overview_svg.selectAll(".clickLine_over")
    .data(total_sales_by_year)
    .enter()
    .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 20)
        .attr("opacity", 0)
        .attr("cursor", "pointer")
        .attr("class", "clickLine_over")
        .attr("d", overview_line(total_sales_by_year));
   
    
// Make all other lines low opacity
transparentLine_over.on("click", function(d, i) {
    // Opacity
    var curr_i = i;
    
    /*
    console.log(platform_svg.selectAll(".plat_dots"));
    overview_svg.selectAll(".over_dots")
        .style("opacity", 0);
    overview_svg.selectAll(".over_dots")
        .filter(function(d, i) { console.log(d); console.log(company_names[curr_i]); return d == company_names[curr_i]; })
        .style("opacity", 1);*/
    
    // Text
    console.log(d);
    var curr_d = d;
    var total_global_sales = d3.sum(data, d => d.Global_Sales);
    total_global_sales = Math.round((total_global_sales + Number.EPSILON) * 100) / 100;  // Round to 2 decimals
    var over_max_size = d3.min([data.length, 50]);
    
    
    var info_div = document.getElementById("information");
    info_div.innerHTML = "<h1>Overview</h1>";
    info_div.innerHTML += "<p>Total Global Sales over Life Time: " + total_global_sales + " millions</p>";
    info_div.innerHTML += "<h2>Top Games</h2>";
    
    // Table of games
    var table_string = "";
    table_string += "<table>";
    
    // Header
    table_string += "<tr>";
    table_string += "<th>Rank</th>";
    table_string += "<th>Name</th>";
    table_string += "<th>Year</th>";
    table_string += "<th>Genre</th>";
    table_string += "<th>Platform</th>";
    table_string += "<th>Publisher</th>";
    table_string += "<th>Global Sales (in millions)</th>";
    table_string += "</tr>";
    
    // Actual Games
    for (let i = 0; i < over_max_size; i++) {
        table_string += "<tr>";
        table_string += "<td>" + (i + 1) + "</td>";
        table_string += "<td>" + data[i].Name + "</td>";
        table_string += "<td>" + data[i].Year + "</td>";
        table_string += "<td>" + data[i].Genre + "</td>";
        table_string += "<td>" + data[i].Platform + "</td>";
        table_string += "<td>" + data[i].Publisher + "</td>";
        table_string += "<td>" + data[i].Global_Sales + "</td>";
        table_string += "</tr>";
    }
    
    table_string += "</table>";
    info_div.innerHTML += table_string;
    
    
    // Annotations
    // Get annotation data ready
    var over_ann_x = [];  // X value
    var over_ann_y = [];  // Y value
    
    for (let i = 0; i < 3; i++) {
        over_ann_x.push(overview_x(data[i].Year));
        
        var ann_data_over_filtered = total_sales_by_year.filter(function(d) { return d.key == data[i].Year; })
        //console.log(ann_data_plat_filtered);
        over_ann_y.push(overview_y(ann_data_over_filtered[0].value.total_sales));
    }
    
    console.log(over_ann_x);
    console.log(over_ann_y);
    
    // Sort top 3 games by year
    let top3_games_year_txt = '[{ "index":0, "x":' + over_ann_x[0] + '},' + 
        '{ "index":1, "x":' + over_ann_x[1] + '},' + 
        '{ "index":2, "x":' + over_ann_x[2] + '}]';
    //console.log(top3_games_year_txt);
    const top3_games_year = JSON.parse(top3_games_year_txt);
    var sorted_top3_games_year = top3_games_year.slice().sort((a, b) => d3.ascending(a.x, b.x));
    
    //console.log(top3_games_year);
    //console.log(sorted_top3_games_year);
    console.log(over_ann_x);
    console.log(over_ann_y);
    
    // Make sure annotations won't overlap
    var over_ann_dx = new Array(3).fill(0);  // dx value (value relative to x)
    var over_ann_dy = new Array(3).fill(0);  // dy value (value relative to y)
    var close_thres = 100;  // Closeness threshold. < threshold means it's too close!
    var move_amt_global = 100;  // How much to move if it's in the way.
    
    // For first tag
    var dx1 = -10;
    var dy1 = -10;
    //console.log(dy1);
    dx1 = outOfBounds(over_ann_x[0], dx1, 0);
    dy1 = outOfBounds(over_ann_y[0], dy1, 1);
    //console.log(dy1);
    over_ann_dx[sorted_top3_games_year[0].index] = dx1;
    over_ann_dy[sorted_top3_games_year[0].index] = dy1;
    
    // Second tag
    var dx2 = -10;
    var dy2 = -10;
    dx2 = outOfBounds(over_ann_x[1], dx2, 0);
    dy2 = outOfBounds(over_ann_y[1], dy2, 1);
    // If distance for both x and y between two tags is smaller than 150, then adjust height
    if (Math.abs((over_ann_x[0] + dx1) - (over_ann_x[1] + dx2)) < close_thres && Math.abs((over_ann_y[0] + dy1) - (over_ann_y[1] + dy2)) < close_thres) {
        //console.log(Math.abs((over_ann_x[0] + dx1) - (over_ann_x[1] + dx2)));
        //console.log(Math.abs((over_ann_y[0] + dy1) - (over_ann_y[1] + dy2)));
        var move_amt = -move_amt_global;
        // If it goes past the top of the canvas, then push tag down.
        if (over_ann_y[1] + dy2 + -100 < 0) {
            move_amt *= -1;
        }
        dy2 += move_amt;
        //console.log(2, move_amt);
    }
    over_ann_dx[sorted_top3_games_year[1].index] = dx2;
    over_ann_dy[sorted_top3_games_year[1].index] = dy2;
    
    // Third tag
    var dx3 = 10;
    var dy3 = -10;
    dx3 = outOfBounds(over_ann_x[2], dx3, 0);
    dy3 = outOfBounds(over_ann_y[2], dy3, 1);
    // If x distance between two tags is smaller than 150, then adjust height.
    // Check with first tag
    if (Math.abs((over_ann_x[0] + dx1) - (over_ann_x[2] + dx3)) < close_thres && Math.abs((over_ann_y[0] + dy1) - (over_ann_y[2] + dy3)) < close_thres) {
        //console.log(Math.abs((over_ann_x[0] + dx1) - (over_ann_x[2] + dx3)));
        //console.log(Math.abs((over_ann_y[0] + dy1) - (over_ann_y[2] + dy3)));
        var move_amt = -move_amt_global;
        // If it goes past the top of the canvas, then push tag down.
        if (over_ann_y[2] + dy3 + -100 < 0) {
            move_amt *= -1;
        }
        dy3 += move_amt;
        //console.log(3.1, move_amt);
    }
    // Check with second tag
    if (Math.abs((over_ann_x[1] + dx2) - (over_ann_x[2] + dx3)) < close_thres && Math.abs((over_ann_y[1] + dy2) - (over_ann_y[2] + dy3)) < close_thres) {
        //console.log(Math.abs((over_ann_x[1] + dx2) - (over_ann_x[2] + dx3)));
        //console.log(Math.abs((over_ann_y[1] + dy2) - (over_ann_y[2] + dy3)));
        var move_amt = move_amt_global;
        // If it goes past the right part of the canvas, then push tag down.
        if (over_ann_y[2] + dy3 + 100 > svg_height) {
            move_amt *= -1;
        }
        dy3 += move_amt;
        dx3 += 20;
        console.log(dx3);
        console.log(3.2, move_amt);
    }
    over_ann_dx[sorted_top3_games_year[2].index] = dx3;
    over_ann_dy[sorted_top3_games_year[2].index] = dy3;
    
    /*
    console.log(filtered_data[0].Year, platform_x(filtered_data[0].Year));
    console.log(filtered_data[0].Global_Sales, platform_y(filtered_data[0].Global_Sales));
    
    console.log(filtered_data[1].Year, platform_x(filtered_data[1].Year));
    console.log(filtered_data[1].Global_Sales, platform_y(filtered_data[1].Global_Sales));
    
    console.log(filtered_data[2].Year, platform_x(filtered_data[2].Year));
    console.log(filtered_data[2].Global_Sales, platform_y(filtered_data[2].Global_Sales));*/
    
    // Get rid of previous annotations
    d3.select(".annotation-group").remove();
    
    // Annotations
    const annotations = [
        {
            x: over_ann_x[0],
            y: over_ann_y[0],
            dx: over_ann_dx[0],
            dy: over_ann_dy[0],
            note: {
                label: data[0].Year,
                title: data[0].Name
            }
        },
        {
            x: over_ann_x[1],
            y: over_ann_y[1],
            dx: over_ann_dx[1],
            dy: over_ann_dy[1],
            note: {
                label: data[1].Year,
                title: data[1].Name
            }
        },
        {
            x: over_ann_x[2],
            y: over_ann_y[2],
            dx: over_ann_dx[2],
            dy: over_ann_dy[2],
            note: {
                label: data[2].Year,
                title: data[2].Name
            }
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .type(d3.annotationCalloutElbow)
        .annotations(annotations);
    
    overview_svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
});
  


///////////* Platform */////////
// Set up initial svg
// Graph
var platform_svg = d3.select("#byPlatform")
    .append("svg")
        .attr("width", svg_width + margin.left + margin.right)
        .attr("height", svg_height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");
    
// Prepare data (total global sales vs year)
var sales_by_platform = d3.nest()
    .key(function(d) { return d.Platform; })
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return {
        total_sales: d3.sum(v, function(d) { return d.Global_Sales; }) }; })
    .sortKeys(d3.ascending)
    .entries(data);

//console.log(JSON.stringify(sales_by_platform));
    
sales_by_platform = sales_by_platform.slice().sort((a, b) => d3.ascending(a.values[0].key, b.values[0].key));
    
//console.log(JSON.stringify(sales_by_platform));
    
// Create Legend
// Set up svg
var plat_leg_svg = d3.select("#byPlatform")
    .append("svg")
        .attr("width", legend_width + margin.left + margin.right)
        .attr("height", legend_height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

// Legend variables
var plat_leg_keys = ["Sony", "Bandai", "Nintendo", "Sega", "Microsoft", 
                    "SNK Corp", "NEC", "Atari", "Parasonic", "General"];
var plat_leg_colors = d3.scaleOrdinal(d3.schemeTableau10);

// Create dots and names
plat_leg_svg.selectAll(".plat_dots")
    .data(plat_leg_keys)
    .enter()
    .append("circle")
        .attr("cx", 0)
        .attr("cy", function(d, i){ return 100 + i * 25; })
        .attr("r", 7)
        .style("fill", function(d){ return plat_leg_colors(d);})
        .attr("class", "plat_dots");
    
plat_leg_svg.selectAll(".plat_names")
    .data(plat_leg_keys)
    .enter()
    .append("text")
        .attr("x", 20)
        .attr("y", function(d, i){ return 100 + i * 25; })
        .text(function(d){ return d; })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("fill", function(d){ return plat_leg_colors(d);})
        .attr("class", "plat_names");
    
    
// Graph Title
platform_svg.append("text")
    .attr("class", "graph_title")
    .attr("text-anchor", "middle")
    .attr("x", svg_width / 2)
    .attr("y", -10)
    .text("Total Global Sales by Console over Time");
    

// Add X axis => year
var platform_x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([0, svg_width]);
    
platform_svg.append("g")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(d3.axisBottom(platform_x).ticks(10));
    
// X axis label
platform_svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", svg_width / 2)
    .attr("y", svg_height + 40)
    .text("Year")
    
// X axis grid lines
platform_svg.append("g")
    .attr("class", "x axis-grid")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(d3.axisBottom(overview_x).tickSize(-svg_height).tickFormat('').ticks(10));
    
    
// Add Y axis => Total Global Sales
var max_total_sales = d3.max(sales_by_platform.map(d => d3.max(d.values.map(d => d.value.total_sales))));
//console.log(max_total_sales);
var platform_y = d3.scaleLinear()
    .domain([0, max_total_sales])
    .range([svg_height, 0]);
    
platform_svg.append("g")
    .call(d3.axisLeft(platform_y));
    
// Y axis label
platform_svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -svg_height / 2)
    .attr("y", -50)
    .attr("dy", "0.75em")
    .text("Total Global Sales (in millions)")
    .attr("style", "transform: rotate(-90deg);");
    
// Y axis grid lines
platform_svg.append("g")
    .attr("class", "y axis-grid")
    .call(d3.axisLeft(overview_y).tickSize(-svg_width).tickFormat('').ticks(10));
    

// Line Colors
var platform_names = sales_by_platform.map(function(d) { return d.key; });
//console.log(platform_names);
    
var platform_colors = d3.scaleOrdinal()
    .domain(platform_names)
    .range(["#ff9da7", "#e15759", "#bab0ab", "#e15759", "#e15759", 
            "#76b7b2", "#76b7b2", "#76b7b2", "#edc949", "#4e79a7",
           "#76b7b2", "#9c755f", "#af7aa1", "#e15759", "#af7aa1",
           "#76b7b2", "#f28e2c", "#4e79a7", "#e15759", "#59a14f", 
           "#e15759", "#e15759", "#4e79a7", "#59a14f", "#e15759", 
           "#4e79a7", "#e15759", "#4e79a7", "#e15759", "#4e79a7", 
           "#59a14f"]);

var company_names = ["Atari", "Nintendo", "General", "Nintendo", "Nintendo",
                      "Sega", "Sega", "Sega", "SNK Corp", "Sony",
                      "Sega", "Parasonic", "NEC", "Nintendo", "NEC",
                      "Sega", "Bandai", "Sony", "Nintendo", "Microsoft",
                      "Nintendo", "Nintendo", "Sony", "Microsoft", "Nintendo", 
                      "Sony", "Nintendo", "Sony", "Nintendo", "Sony", 
                       "Microsoft"];
/*
// Define the line
var platform_line = d3.line()
    .x(function(d) { return platform_x(d.key); })
    .y(function(d) { return platform_y(d.value.total_sales); });
*/
    
var nest_func = function(data_p) {
    //console.log(data_p);
    var new_line = d3.line()
        .x(function(d) {return platform_x(d.key);})
        .y(function(d) { return platform_y(d.value.total_sales);})
    //console.log(new_line(data_p));
    return new_line(data_p);
}

//console.log(nest_func);

// Draw the line
var realLine = platform_svg.selectAll(".line")
    .data(sales_by_platform)
    .enter()
    .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return platform_colors(d.key); })
        .attr("stroke-width", 2)
        .attr("class", "line")
        .attr("d", function(d){return nest_func(d.values); });
    

// Draw line for clicking
var transparentLine = platform_svg.selectAll(".clickLine")
    .data(sales_by_platform)
    .enter()
    .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 20)
        .attr("opacity", 0)
        .attr("cursor", "pointer")
        .attr("class", "clickLine")
        .attr("d", function(d){return nest_func(d.values); });
    
    
// Hover over line displays platform and company
transparentLine.on("mouseover", function(d, i) {
        d3.select("#tooltip").style("opacity", 1)
            .style("position", "absolute")
            .style("background-color", "black")
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY+10) + "px")
            .text("Console: " + d.key + ", Company: " + company_names[i]);
    });
    
    
// Make all other lines low opacity
transparentLine.on("click", function(d, i) {
    // Opacity
    var curr_i = i;
    //console.log(i);
    platform_svg.selectAll(".line")
        .style("opacity", 0.25);
    platform_svg.selectAll(".line")
        .filter(function(d, i) { return i == curr_i; })
        .style("opacity", 1);
    
    /*
    console.log(platform_svg.selectAll(".plat_dots"));
    platform_svg.selectAll(".plat_dots")
        .style("opacity", 0);
    platform_svg.selectAll(".plat_dots")
        .filter(function(d, i) { console.log(d); console.log(company_names[curr_i]); return d == company_names[curr_i]; })
        .style("opacity", 1);*/
    
    // Text
    var curr_d = d;
    var filtered_data = data.filter(function(d) { return d.Platform == curr_d.key; });  // Filter data by platform
    var total_global_sales = d3.sum(filtered_data, d => d.Global_Sales);
    total_global_sales = Math.round((total_global_sales + Number.EPSILON) * 100) / 100;  // Round to 2 decimals
    var plat_max_size = d3.min([filtered_data.length, 50]);
    
    //console.log(filtered_data);
    
    var info_div = document.getElementById("information");
    info_div.innerHTML = "<h1>" + d.key + " (" + company_names[i] + ")</h1>";
    info_div.innerHTML += "<p>Total Global Sales over Life Time: " + total_global_sales + " millions</p>";
    info_div.innerHTML += "<h2>Top Games</h2>";
    
    // Table of games
    var table_string = "";
    table_string += "<table>";
    
    // Header
    table_string += "<tr>";
    table_string += "<th>Rank</th>";
    table_string += "<th>Name</th>";
    table_string += "<th>Year</th>";
    table_string += "<th>Genre</th>";
    table_string += "<th>Publisher</th>";
    table_string += "<th>Global Sales (in millions)</th>";
    table_string += "</tr>";
    
    // Actual Games
    for (let i = 0; i < plat_max_size; i++) {
        table_string += "<tr>";
        table_string += "<td>" + (i + 1) + "</td>";
        table_string += "<td>" + filtered_data[i].Name + "</td>";
        table_string += "<td>" + filtered_data[i].Year + "</td>";
        table_string += "<td>" + filtered_data[i].Genre + "</td>";
        table_string += "<td>" + filtered_data[i].Publisher + "</td>";
        table_string += "<td>" + filtered_data[i].Global_Sales + "</td>";
        table_string += "</tr>";
    }
    
    table_string += "</table>";
    info_div.innerHTML += table_string;
    
    
    /*
    info_div.innerHTML += "<p>Top Games:</p>";
    info_div.innerHTML += "<p>1.) " + filtered_data[0].Name + " (" + filtered_data[0].Year + "), Genre: " + filtered_data[0].Genre + ", Publisher: " + filtered_data[0].Publisher + ", " + filtered_data[0].Global_Sales + " million global sales</p>";
    info_div.innerHTML += "<p>2.) " + filtered_data[1].Name + " (" + filtered_data[1].Year + "), " + filtered_data[1].Global_Sales + " million global sales</p>";
    info_div.innerHTML += "<p>3.) " + filtered_data[2].Name + " (" + filtered_data[2].Year + "), " + filtered_data[2].Global_Sales + " million global sales</p>";
    */
    
    // Get annotation data ready
    var ann_data_plat = d.values; // Data for specific platform by year
    var plat_ann_x = [];  // X value
    var plat_ann_y = [];  // Y value
    
    //console.log(ann_data_plat);
    
    for (let i = 0; i < 3; i++) {
        plat_ann_x.push(platform_x(filtered_data[i].Year));
        
        var ann_data_plat_filtered = ann_data_plat.filter(function(d) { return d.key == filtered_data[i].Year; })
        //console.log(ann_data_plat_filtered);
        plat_ann_y.push(platform_y(ann_data_plat_filtered[0].value.total_sales));
    }
    
    // Sort top 3 games by year
    let top3_games_year_txt = '[{ "index":0, "x":' + plat_ann_x[0] + '},' + 
        '{ "index":1, "x":' + plat_ann_x[1] + '},' + 
        '{ "index":2, "x":' + plat_ann_x[2] + '}]';
    //console.log(top3_games_year_txt);
    const top3_games_year = JSON.parse(top3_games_year_txt);
    var sorted_top3_games_year = top3_games_year.slice().sort((a, b) => d3.ascending(a.x, b.x));
    
    //console.log(top3_games_year);
    //console.log(sorted_top3_games_year);
    console.log(plat_ann_x);
    console.log(plat_ann_y);
    
    // Make sure annotations won't overlap
    var plat_ann_dx = new Array(3).fill(0);  // dx value (value relative to x)
    var plat_ann_dy = new Array(3).fill(0);  // dy value (value relative to y)
    var close_thres = 100;  // Closeness threshold. < threshold means it's too close!
    var move_amt_global = 100;  // How much to move if it's in the way.
    
    // For first tag
    var dx1 = -10;
    var dy1 = -10;
    //console.log(dy1);
    dx1 = outOfBounds(plat_ann_x[0], dx1, 0);
    dy1 = outOfBounds(plat_ann_y[0], dy1, 1);
    //console.log(dy1);
    plat_ann_dx[sorted_top3_games_year[0].index] = dx1;
    plat_ann_dy[sorted_top3_games_year[0].index] = dy1;
    
    // Second tag
    var dx2 = 10;
    var dy2 = -10;
    dx2 = outOfBounds(plat_ann_x[1], dx2, 0);
    dy2 = outOfBounds(plat_ann_y[1], dy2, 1);
    // If distance for both x and y between two tags is smaller than 150, then adjust height
    if (Math.abs((plat_ann_x[0] + dx1) - (plat_ann_x[1] + dx2)) < close_thres && Math.abs((plat_ann_y[0] + dy1) - (plat_ann_y[1] + dy2)) < close_thres) {
        //console.log(Math.abs((plat_ann_x[0] + dx1) - (plat_ann_x[1] + dx2)));
        //console.log(Math.abs((plat_ann_y[0] + dy1) - (plat_ann_y[1] + dy2)));
        var move_amt = -move_amt_global;
        // If it goes past the top of the canvas, then push tag down.
        if (plat_ann_y[1] + dy2 + -100 < 0) {
            move_amt *= -1;
        }
        dy2 += move_amt;
        //console.log(2, move_amt);
    }
    plat_ann_dx[sorted_top3_games_year[1].index] = dx2;
    plat_ann_dy[sorted_top3_games_year[1].index] = dy2;
    
    // Third tag
    var dx3 = 10;
    var dy3 = -10;
    dx3 = outOfBounds(plat_ann_x[2], dx3, 0);
    dy3 = outOfBounds(plat_ann_y[2], dy3, 1);
    // If x distance between two tags is smaller than 150, then adjust height.
    // Check with first tag
    if (Math.abs((plat_ann_x[0] + dx1) - (plat_ann_x[2] + dx3)) < close_thres && Math.abs((plat_ann_y[0] + dy1) - (plat_ann_y[2] + dy3)) < close_thres) {
        //console.log(Math.abs((plat_ann_x[0] + dx1) - (plat_ann_x[2] + dx3)));
        //console.log(Math.abs((plat_ann_y[0] + dy1) - (plat_ann_y[2] + dy3)));
        var move_amt = -move_amt_global;
        // If it goes past the top of the canvas, then push tag down.
        if (plat_ann_y[2] + dy3 + -100 < 0) {
            move_amt *= -1;
        }
        dy3 += move_amt;
        //console.log(3.1, move_amt);
    }
    // Check with second tag
    if (Math.abs((plat_ann_x[1] + dx2) - (plat_ann_x[2] + dx3)) < close_thres && Math.abs((plat_ann_y[1] + dy2) - (plat_ann_y[2] + dy3)) < close_thres) {
        //console.log(Math.abs((plat_ann_x[1] + dx2) - (plat_ann_x[2] + dx3)));
        //console.log(Math.abs((plat_ann_y[1] + dy2) - (plat_ann_y[2] + dy3)));
        var move_amt = move_amt_global;
        // If it goes past the right part of the canvas, then push tag down.
        if (plat_ann_y[2] + dy3 + 100 > svg_height) {
            move_amt *= -1;
        }
        dy3 += move_amt;
        dx3 += 20;
        console.log(dx3);
        console.log(3.2, move_amt);
    }
    plat_ann_dx[sorted_top3_games_year[2].index] = dx3;
    plat_ann_dy[sorted_top3_games_year[2].index] = dy3;
    
    /*
    console.log(filtered_data[0].Year, platform_x(filtered_data[0].Year));
    console.log(filtered_data[0].Global_Sales, platform_y(filtered_data[0].Global_Sales));
    
    console.log(filtered_data[1].Year, platform_x(filtered_data[1].Year));
    console.log(filtered_data[1].Global_Sales, platform_y(filtered_data[1].Global_Sales));
    
    console.log(filtered_data[2].Year, platform_x(filtered_data[2].Year));
    console.log(filtered_data[2].Global_Sales, platform_y(filtered_data[2].Global_Sales));*/
    
    // Get rid of previous annotations
    d3.select(".annotation-group").remove();
    
    // Annotations
    const annotations = [
        {
            x: plat_ann_x[0],
            y: plat_ann_y[0],
            dx: plat_ann_dx[0],
            dy: plat_ann_dy[0],
            note: {
                label: filtered_data[0].Year,
                title: filtered_data[0].Name
            }
        },
        {
            x: plat_ann_x[1],
            y: plat_ann_y[1],
            dx: plat_ann_dx[1],
            dy: plat_ann_dy[1],
            note: {
                label: filtered_data[1].Year,
                title: filtered_data[1].Name
            }
        },
        {
            x: plat_ann_x[2],
            y: plat_ann_y[2],
            dx: plat_ann_dx[2],
            dy: plat_ann_dy[2],
            note: {
                label: filtered_data[2].Year,
                title: filtered_data[2].Name
            }
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .type(d3.annotationCalloutElbow)
        .annotations(annotations);
    
    platform_svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
    
});
    

    
    
    
///////////* Genre */////////
// Set up initial svg
var genre_svg = d3.select("#byGenre")
    .append("svg")
        .attr("width", svg_width + margin.left + margin.right)
        .attr("height", svg_height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");
    
// Prepare data (total global sales vs year)
var sales_by_genre = d3.nest()
    .key(function(d) { return d.Genre; })
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return {
        total_sales: d3.sum(v, function(d) { return d.Global_Sales; }) }; })
    .sortKeys(d3.ascending)
    .entries(data);

//console.log(JSON.stringify(sales_by_genre));
    
sales_by_genre = sales_by_genre.slice().sort((a, b) => d3.ascending(a.values[0].key, b.values[0].key));
    
//console.log(JSON.stringify(sales_by_platform));
    
    
// Graph Title
genre_svg.append("text")
    .attr("class", "graph_title")
    .attr("text-anchor", "middle")
    .attr("x", svg_width / 2)
    .attr("y", -10)
    .text("Total Global Sales by Genre over Time");
    

// Add X axis => year
var genre_x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([0, svg_width]);
    
genre_svg.append("g")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(d3.axisBottom(genre_x).ticks(10));
    
// X axis label
genre_svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", svg_width / 2)
    .attr("y", svg_height + 40)
    .text("Year")
    
// X axis grid lines
genre_svg.append("g")
    .attr("class", "x axis-grid")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(d3.axisBottom(overview_x).tickSize(-svg_height).tickFormat('').ticks(10));
    
    
// Add Y axis => Total Global Sales
var max_total_sales_genre = d3.max(sales_by_genre.map(d => d3.max(d.values.map(d => d.value.total_sales))));
var genre_y = d3.scaleLinear()
    .domain([0, max_total_sales_genre])
    .range([svg_height, 0]);
    
genre_svg.append("g")
    .call(d3.axisLeft(genre_y));
    
// Y axis label
genre_svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -svg_height / 2)
    .attr("y", -50)
    .attr("dy", "0.75em")
    .text("Total Global Sales (in millions)")
    .attr("style", "transform: rotate(-90deg);");
    
// Y axis grid lines
genre_svg.append("g")
    .attr("class", "y axis-grid")
    .call(d3.axisLeft(overview_y).tickSize(-svg_width).tickFormat('').ticks(10));
    

// Line Colors
var genre_names = sales_by_genre.map(function(d) { return d.key; });
//console.log(genre_names);
    
var genre_colors = d3.scaleOrdinal(d3.schemePaired)
    .domain(genre_names);
    /*
    .range(["#ff9da7", "#e15759", "#bab0ab", "#e15759", "#e15759", 
            "#76b7b2", "#76b7b2", "#76b7b2", "#edc949", "#4e79a7",
           "#76b7b2", "#9c755f", "#af7aa1", "#e15759", "#af7aa1",
           "#76b7b2", "#f28e2c", "#4e79a7", "#e15759", "#59a14f", 
           "#e15759", "#e15759", "#4e79a7", "#59a14f", "#e15759", 
           "#4e79a7", "#e15759", "#4e79a7", "#e15759", "#4e79a7", 
           "#59a14f"]);*/

/*
// Define the line
var genre_line = d3.line()
    .x(function(d) { return genre_x(d.key); })
    .y(function(d) { return genre_y(d.value.total_sales); });
*/
    
var nest_func_genre = function(data_p) {
    //console.log(data_p);
    var new_line = d3.line()
        .x(function(d) {return genre_x(d.key);})
        .y(function(d) {return genre_y(d.value.total_sales);})
    //console.log(new_line(data_p));
    return new_line(data_p);
}

//console.log(nest_func);

// Draw the line
genre_svg.selectAll(".lineGenre")
    .data(sales_by_genre)
    .enter()
    .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return genre_colors(d.key); })
        .attr("stroke-width", 2)
        .attr("class", "lineGenre")
        .attr("d", function(d){return nest_func_genre(d.values); });


// Create Legend
// Set up svg
var genr_leg_svg = d3.select("#byGenre")
    .append("svg")
        .attr("width", legend_width + margin.left + margin.right)
        .attr("height", legend_height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

// Legend variables
var genr_leg_keys = genre_names;
var genr_leg_colors = genre_colors;

// Create dots and names
genr_leg_svg.selectAll(".genr_dots")
    .data(genr_leg_keys)
    .enter()
    .append("circle")
        .attr("cx", 0)
        .attr("cy", function(d, i){ return 100 + i * 25; })
        .attr("r", 7)
        .style("fill", function(d){ return genr_leg_colors(d);})
        .attr("class", "genr_dots");
    
genr_leg_svg.selectAll(".genr_names")
    .data(genr_leg_keys)
    .enter()
    .append("text")
        .attr("x", 20)
        .attr("y", function(d, i){ return 100 + i * 25; })
        .text(function(d){ return d; })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("fill", function(d){ return genr_leg_colors(d);})
        .attr("class", "genr_names");
    

// Draw line for clicking
var transparentLine_genre = genre_svg.selectAll(".clickLineGenre")
    .data(sales_by_genre)
    .enter()
    .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 20)
        .attr("opacity", 0)
        .attr("cursor", "pointer")
        .attr("class", "clickLineGenre")
        .attr("d", function(d){return nest_func_genre(d.values); });
    
    
// Hover over line displays genre
transparentLine_genre.on("mouseover", function(d, i) {
        d3.select("#tooltip").style("opacity", 1)
            .style("position", "absolute")
            .style("background-color", "black")
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY+10) + "px")
            .text("Genre: " + d.key);
    });
    
// Make all other lines low opacity
transparentLine_genre.on("click", function(d, i) {
    // Opacity
    var curr_i = i;
    //console.log(i);
    genre_svg.selectAll(".lineGenre")
        .style("opacity", 0.25);
    genre_svg.selectAll(".lineGenre")
        .filter(function(d, i) { return i == curr_i; })
        .style("opacity", 1);
    
    // Text
    var curr_d = d;
    var filtered_data = data.filter(function(d) { return d.Genre == curr_d.key; });  // Filter data by genre
    var total_global_sales = d3.sum(filtered_data, d => d.Global_Sales);
    total_global_sales = Math.round((total_global_sales + Number.EPSILON) * 100) / 100;  // Round to 2 decimals
    var plat_max_size = d3.min([filtered_data.length, 50]);
    
    var info_div = document.getElementById("information");
    info_div.innerHTML = "<h1>" + d.key + "</h1>";
    info_div.innerHTML += "<p>Total Global Sales over Life Time: " + total_global_sales + " millions</p>";
    info_div.innerHTML += "<h2>Top Games</h2>";
    
    // Table of games
    var table_string = "";
    table_string += "<table>";
    
    // Header
    table_string += "<tr>";
    table_string += "<th>Rank</th>";
    table_string += "<th>Name</th>";
    table_string += "<th>Year</th>";
    table_string += "<th>Console</th>";
    table_string += "<th>Publisher</th>";
    table_string += "<th>Global Sales (in millions)</th>";
    table_string += "</tr>";
    
    // Actual Games
    for (let i = 0; i < plat_max_size; i++) {
        table_string += "<tr>";
        table_string += "<td>" + (i + 1) + "</td>";
        table_string += "<td>" + filtered_data[i].Name + "</td>";
        table_string += "<td>" + filtered_data[i].Year + "</td>";
        table_string += "<td>" + filtered_data[i].Platform + "</td>";
        table_string += "<td>" + filtered_data[i].Publisher + "</td>";
        table_string += "<td>" + filtered_data[i].Global_Sales + "</td>";
        table_string += "</tr>";
    }
    
    table_string += "</table>";
    info_div.innerHTML += table_string;
    
    
    /*
    info_div.innerHTML += "<p>Top Games:</p>";
    info_div.innerHTML += "<p>1.) " + filtered_data[0].Name + " (" + filtered_data[0].Year + "), Genre: " + filtered_data[0].Genre + ", Publisher: " + filtered_data[0].Publisher + ", " + filtered_data[0].Global_Sales + " million global sales</p>";
    info_div.innerHTML += "<p>2.) " + filtered_data[1].Name + " (" + filtered_data[1].Year + "), " + filtered_data[1].Global_Sales + " million global sales</p>";
    info_div.innerHTML += "<p>3.) " + filtered_data[2].Name + " (" + filtered_data[2].Year + "), " + filtered_data[2].Global_Sales + " million global sales</p>";
    */
    
    
    // Get annotation data ready
    var ann_data_genre = d.values; // Data for specific platform by year
    var genre_ann_x = [];  // X value
    var genre_ann_y = [];  // Y value
    
    for (let i = 0; i < 3; i++) {
        genre_ann_x.push(genre_x(filtered_data[i].Year));
        
        var ann_data_genre_filtered = ann_data_genre.filter(function(d) { return d.key == filtered_data[i].Year; })
        //console.log(ann_data_genre_filtered);
        genre_ann_y.push(genre_y(ann_data_genre_filtered[0].value.total_sales));
    }
    
    // Sort top 3 games by year
    let top3_games_year_txt = '[{ "index":0, "x":' + genre_ann_x[0] + '},' + 
        '{ "index":1, "x":' + genre_ann_x[1] + '},' + 
        '{ "index":2, "x":' + genre_ann_x[2] + '}]';
    //console.log(top3_games_year_txt);
    const top3_games_year = JSON.parse(top3_games_year_txt);
    var sorted_top3_games_year = top3_games_year.slice().sort((a, b) => d3.ascending(a.x, b.x));
    
    //console.log(top3_games_year);
    //console.log(sorted_top3_games_year);
    console.log(genre_ann_x);
    console.log(genre_ann_y);
    
    // Make sure annotations won't overlap
    var genre_ann_dx = new Array(3).fill(0);  // dx value (value relative to x)
    var genre_ann_dy = new Array(3).fill(0);  // dy value (value relative to y)
    var close_thres = 100;  // Closeness threshold. < threshold means it's too close!
    var move_amt_global = 100;  // How much to move if it's in the way.
    
    // For first tag
    var dx1 = -10;
    var dy1 = -10;
    //console.log(dy1);
    dx1 = outOfBounds(genre_ann_x[0], dx1, 0);
    dy1 = outOfBounds(genre_ann_y[0], dy1, 1);
    //console.log(dy1);
    genre_ann_dx[sorted_top3_games_year[0].index] = dx1;
    genre_ann_dy[sorted_top3_games_year[0].index] = dy1;
    
    // Second tag
    var dx2 = 10;
    var dy2 = -10;
    dx2 = outOfBounds(genre_ann_x[1], dx2, 0);
    dy2 = outOfBounds(genre_ann_y[1], dy2, 1);
    // If distance for both x and y between two tags is smaller than 150, then adjust height
    if (Math.abs((genre_ann_x[0] + dx1) - (genre_ann_x[1] + dx2)) < close_thres && Math.abs((genre_ann_y[0] + dy1) - (genre_ann_y[1] + dy2)) < close_thres) {
        //console.log(Math.abs((genre_ann_x[0] + dx1) - (genre_ann_x[1] + dx2)));
        //console.log(Math.abs((genre_ann_y[0] + dy1) - (genre_ann_y[1] + dy2)));
        var move_amt = -move_amt_global;
        // If it goes past the top of the canvas, then push tag down.
        if (genre_ann_y[1] + dy2 + -100 < 0) {
            move_amt *= -1;
        }
        dy2 += move_amt;
        //console.log(2, move_amt);
    }
    genre_ann_dx[sorted_top3_games_year[1].index] = dx2;
    genre_ann_dy[sorted_top3_games_year[1].index] = dy2;
    
    // Third tag
    var dx3 = 10;
    var dy3 = -10;
    dx3 = outOfBounds(genre_ann_x[2], dx3, 0);
    dy3 = outOfBounds(genre_ann_y[2], dy3, 1);
    // If x distance between two tags is smaller than 150, then adjust height.
    // Check with first tag
    if (Math.abs((genre_ann_x[0] + dx1) - (genre_ann_x[2] + dx3)) < close_thres && Math.abs((genre_ann_y[0] + dy1) - (genre_ann_y[2] + dy3)) < close_thres) {
        //console.log(Math.abs((genre_ann_x[0] + dx1) - (genre_ann_x[2] + dx3)));
        //console.log(Math.abs((genre_ann_y[0] + dy1) - (genre_ann_y[2] + dy3)));
        var move_amt = -move_amt_global;
        // If it goes past the top of the canvas, then push tag down.
        if (genre_ann_y[2] + dy3 + -100 < 0) {
            move_amt *= -1;
        }
        dy3 += move_amt;
        //console.log(3.1, move_amt);
    }
    // Check with second tag
    if (Math.abs((genre_ann_x[1] + dx2) - (genre_ann_x[2] + dx3)) < close_thres && Math.abs((genre_ann_y[1] + dy2) - (genre_ann_y[2] + dy3)) < close_thres) {
        //console.log(Math.abs((genre_ann_x[1] + dx2) - (genre_ann_x[2] + dx3)));
        //console.log(Math.abs((genre_ann_y[1] + dy2) - (genre_ann_y[2] + dy3)));
        var move_amt = move_amt_global;
        // If it goes past the right part of the canvas, then push tag down.
        if (genre_ann_y[2] + dy3 + 100 > svg_height) {
            move_amt *= -1;
        }
        dy3 += move_amt;
        dx3 += 20;
        console.log(dx3);
        console.log(3.2, move_amt);
    }
    genre_ann_dx[sorted_top3_games_year[2].index] = dx3;
    genre_ann_dy[sorted_top3_games_year[2].index] = dy3;
    
    /*
    console.log(filtered_data[0].Year, platform_x(filtered_data[0].Year));
    console.log(filtered_data[0].Global_Sales, platform_y(filtered_data[0].Global_Sales));
    
    console.log(filtered_data[1].Year, platform_x(filtered_data[1].Year));
    console.log(filtered_data[1].Global_Sales, platform_y(filtered_data[1].Global_Sales));
    
    console.log(filtered_data[2].Year, platform_x(filtered_data[2].Year));
    console.log(filtered_data[2].Global_Sales, platform_y(filtered_data[2].Global_Sales));*/
    
    // Get rid of previous annotations
    d3.select(".annotation-group").remove();
    
    // Annotations
    const annotations = [
        {
            x: genre_ann_x[0],
            y: genre_ann_y[0],
            dx: genre_ann_dx[0],
            dy: genre_ann_dy[0],
            note: {
                label: filtered_data[0].Year,
                title: filtered_data[0].Name
            }
        },
        {
            x: genre_ann_x[1],
            y: genre_ann_y[1],
            dx: genre_ann_dx[1],
            dy: genre_ann_dy[1],
            note: {
                label: filtered_data[1].Year,
                title: filtered_data[1].Name
            }
        },
        {
            x: genre_ann_x[2],
            y: genre_ann_y[2],
            dx: genre_ann_dx[2],
            dy: genre_ann_dy[2],
            note: {
                label: filtered_data[2].Year,
                title: filtered_data[2].Name
            }
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .type(d3.annotationCalloutElbow)
        .annotations(annotations);
    
    genre_svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
    
    
});
    
    
    
} //Very End