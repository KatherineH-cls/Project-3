// @TODO: YOUR CODE HERE!

var girl_data={};

// Load data from data.csv
d3.json("/api/get_bond_girls").then(function (data) {
    
     
    console.log(data);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function (data) {
        data.actress_age = +data.actress_age;
        data.bond_actor_age = +data.bond_actor_age;
        data.year = +data.year;
        data.actress = data.actress;
        data.actor = data.actor;
        data.average_girl_age = +data.average_girl_age;
        data.difference = +data.difference;
        data.diff_avg = +data.diff_avg;
    });

girl_data = data;



}).catch(function (error) {
    console.log(error)});

function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Define SVG area dimensions
    var svgWidth = parseInt(d3.select("#scatter").style("width"), 10);
    var svgHeight = svgWidth * 0.6;

    // Define the chart's margins as an object
    var margin = {
        top: 60,
        right: 60,
        bottom: 100,
        left: 100
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set its dimensions
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append a group area, then set its margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);



    // Functions for Interactivity
    // ==============================

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup,
        xScale, chosenXAxis,
        yScale, chosenYAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d[chosenYAxis]));

        return circlesGroup;
    }


    // function used for updating circles group with new tooltip
    function updateToolTip(chosenYAxis, circlesGroup) {
        var toolTip = d3.tip()
            .offset([-10, -60])
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("fill", "black")
            .html(function (d) {
                var tipText
                if (chosenYAxis === "actress_age") {
                    tipText = `<strong>${d.film_title}</strong>
                    <br>${d.actress}
                    <br>Age: ${d.actress_age}`;
                }
                else if (chosenYAxis === "average_girl_age") {
                    tipText = `<strong>${d.actor}</strong>
                    <br>Age difference: ${d.diff_avg} years`;
                }
                return tipText;
            });


        circlesGroup.call(toolTip);



        circlesGroup.on("mouseover", function (girl_data) {
            toolTip.show(girl_data);
            // mouseover;
            d3.select(this)
                .transition()
                .duration(300);
        })
            // onmouseout event
            .on("mouseout", function (girl_data) {
                toolTip.hide(girl_data);
                d3.select(this)
                    .transition()
                    .duration(300)
                    ;
            });

        return circlesGroup;
    }

    // function used for updating bond group with new tooltip
    function updateBondTip(chosenYAxis, bondGroup) {
        var bondTip = d3.tip()
            .offset([-10, -60])
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("fill", "black")
            .html(function (d) {
                var tipText
                tipText = `<strong>${d.film_title}</strong>
                    <br>${d.actor}
                    <br>Age: ${d.bond_actor_age}`;
                return tipText;
            });

        bondGroup.call(bondTip);

        bondGroup
            .on("mouseover", function (girl_data) {
                bondTip.show(girl_data);
            })
            .on("mouseout", function (girl_data) {
                bondTip.hide(girl_data);
            });

        return bondGroup;
    }

    // Fetch data and draw the graph
    // ==============================

    // Initial Params
    var chosenXAxis = "year";
    var chosenYAxis = "actress_age";
    // console.log(chosenYAxis);

    

        

        // Step 2: Create scale functions
        // ==============================
        // var xScale = xLinearScale(data, chosenXAxis);
        var xScale = d3.scaleLinear()
            .domain([1950, 2030])
            .range([0, chartWidth])
            ;
        // var yScale = yLinearScale(data, chosenYAxis);
        var yScale = d3.scaleLinear()
            .domain([0, 70])
            .range([chartHeight, 0]);

        
        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format(""));
        var leftAxis = d3.axisLeft(yScale);

        // Step 4: Append Axes to the chart
        // ==============================
        var xAxis = chartGroup.append("g")
            .classed("axis", true)
            .attr("transform", "translate(0, " + chartHeight + ")")
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("axis", true)
            .call(leftAxis);


        // Add xaxis labels to the chart
        // ==============================
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
            ;

        var yearLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "year") // value to grab for event listener
            .classed("active", true)
            .style("fill", "black")
            .style("font-weight", "lighter")
            .text("Film Release Year");

        // Add yaxis labels to the chart
        // ==============================
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            ;

        var actress_ageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -50)
            .attr("value", "actress_age") // value to grab for event listener
            .classed("active", true)
            .attr("fill", "#f55f1f")
            .text("Age of Bond girl");

        var averageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -30)
            .attr("value", "average_girl_age") // value to grab for event listener
            .classed("inactive", true)
            .attr("fill", "#f55f1f")
            .text("Average age of Bond girl");


        // add bond axis
        ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -70)
            .attr("value", "bond_actor_age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age of Bond actor")
            .style('fill', "#0064d8")
            ;


        // Add title to the chart
        // ==============================
        chartGroup.append("text")
            .attr("x", (chartWidth / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "22px")
            .style("fill", "black")
            .text("Age profile of Bond girls")
            ;

        //add box for 25 percentile to 75 percentile
        // ==============================
        chartGroup.selectAll(".IQR")
            .data(girl_data)
            .enter()
            .append("rect")
            .attr('x', 0)
            .attr('y', yScale(33))
            .attr('width', chartWidth)
            .attr('height', yScale(70 - 9))
            // .attr('height', function(d){return(y(d.actress_age.q1)-y(d.actress_age.q3))})
            .attr('stroke', '#dddddd')
            .attr('fill', '#fadacd')
            .attr("opacity", ".2")
            ;

        chartGroup
            .append("text")
            .attr('x', xScale(2017))
            .attr('y', yScale(26))
            .style("font-size", "14px")
            .style("fill", "#f78c60")
            .text("middle 50% of ages")
            ;

        // Step 5: Create Circles
        // ==============================
        // consolgit pulle.log(chosenYAxis);
        var circlesGroup = chartGroup.selectAll("girls")
            .data(girl_data)
            .enter()
            .append("circle")
            .attr("class", "girls")
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d[chosenYAxis]))
            .attr("r", "8")
            .attr("fill", "#f55f1f")
            .attr("opacity", ".6")
            ;

        // add separate circles for Bond
        // ==============================
        // Color scale: give each bond actor a different color
        var color = d3.scaleOrdinal()
            .domain(['Sean Connery', 'George Lazenby', 'Roger Moore', 'Timothy Dalton',
                'Pierce Brosnan', 'Daniel Craig'])
            .range([
                "#002445",
                "#003468",
                "#00448c",
                "#0054b1",
                "#0064d8",
                "#0073ff"])

        var bondGroup = chartGroup.selectAll("bond")
            .data(girl_data)
            .enter()
            .append("circle")
            .attr("value", function (d) {
                return d.actor
            })
            .attr("class", "bond")
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d['bond_actor_age']))
            .attr("r", "8")
            .attr("fill", function (d) { return color(d.actor) })
            .attr("opacity", ".5")

        // Activate tooltips
        // ==============================
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
        bondGroup = updateBondTip(chosenYAxis, bondGroup);

        // Step 6: Add event listeners
        // ==============================

        // bond event listener

        chartGroup.selectAll(".bond")
            .on("click", function () {
                var bond = d3.select(this).attr("value");
                console.log(bond);
                // return colour to greyed circles
                d3.selectAll(".bond")
                    .data(girl_data)
                    .filter(function (d) { return d.actor === bond })
                    .transition()
                    .duration(200)
                    .style("fill", function (d) { return color(d.actor) })
                    ;
                // highlight;
                d3.selectAll(".bond")
                    .data(girl_data)
                    .filter(function (d) { return d.actor !== bond })
                    .transition()
                    .duration(200)
                    .style("fill", "lightgrey")
                    ;
            });
// return colour to greyed circles when girls are clicked
        chartGroup.selectAll(".girls")
            .on("click", function () {
                d3.selectAll(".bond")
                    .data(girl_data)
                    .transition()
                    .duration(200)
                    .style("fill", function (d) { return color(d.actor) })
                    ;
            });

        // y axis labels event listener
        ylabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenYAxis && value !== "bond_actor_age") {
                    // replaces chosenYAxis with value
                    chosenYAxis = value;
                     // updates circles with new x, y values
                    circlesGroup = renderCircles(circlesGroup,
                        xScale, chosenXAxis,
                        yScale, chosenYAxis);
                                        // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                    // changes classes to change bold text

                    if (chosenYAxis === "actress_age") {
                        actress_ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        averageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "average_girl_age") {
                        actress_ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        averageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });

    ;



makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
        };
