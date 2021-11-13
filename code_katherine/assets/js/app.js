// @TODO: YOUR CODE HERE!
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
    // function used for updating circles text location when circles move
    // function renderText(circlesText,
    //     xScale, chosenXAxis,
    //     yScale, chosenYAxis) {

    //     circlesText.transition()
    //         .duration(1000)
    //         .attr("x", d => xScale(d[chosenXAxis]))
    //         .attr("y", d => yScale(d[chosenYAxis]));

    //     return circlesText;
    // }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenYAxis, circlesGroup) {

        // var xlabel;
        // if (chosenXAxis === "year") {
        //     xlabel = "Film Release Year";
        // }
        // else if (chosenXAxis === "age") {
        //     xlabel = "Age: ";
        // }
        // else if (chosenXAxis === "income") {
        //     xlabel = "Income: ";
        // }
        // else xlabel = "No data";

        var ylabel;
        if (chosenYAxis === "actress_age") {
            ylabel = "one";
        }
        else if (chosenYAxis === "average_girl_age") {
            ylabel = "two";
        }
        else if (chosenYAxis === "bond_actor_age") {
            ylabel = "three";
        }
        else ylabel = "no data";
        console.log(chosenYAxis);
        console.log(ylabel);

        console.log("before tooltip");

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([-10, -60])
            // .style("background-color", "white")
            // .style("border", "solid")
            // .style("border-width", "1px")
            // .style("border-radius", "5px")
            // .style("padding", "10px")
            .html(function (d) {
                // console.log("inside tool tip");
                return (d.year);
            });

        console.log("after tooltip");

        // return (`<strong>${d.year}</strong>
        // <br>${ylabel} ${d[chosenYAxis]} %`);
        // });



        console.log("toolTip");

        circlesGroup.call(toolTip);

        console.log("toolTip2");

        circlesGroup.on("mouseover", function (data) {
            toolTip.show(data);
            console.log("mouseover");
            d3.select(this)
                .transition()
                .duration(300)
                .attr("fill", "teal")
                .attr("r", "15")
                .style("stroke", "black");
        })
            // onmouseout event
            .on("mouseout", function (data) {
                toolTip.hide(data);
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("fill", "lightseagreen")
                    .attr("r", "10")
                    .style("stroke", "none");
            });

        return circlesGroup;
    }

    // Fetch data and draw the graph
    // ==============================

    // Initial Params
    var chosenXAxis = "year";
    var chosenYAxis = "average_girl_age";
    console.log(chosenYAxis);

    // Load data from data.csv
    d3.csv("assets/data/bond_girls.csv").then(function (data) {
        console.log("you are here")
        // Print the data
        // if (error) throw error;
        console.log(data);

        console.log("got past error")

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        data.forEach(function (data) {
            // console.log(data);
            data.actress_age = +data.actress_age;
            // console.log(data.actress_age);
            data.bond_actor_age = +data.bond_actor_age;
            // console.log(data.bond_age);
            data.year = +data.year;
            // console.log(data.year);
            data.actress = data.actress;
            // console.log(data.bond_girl);
            data.actor = data.actor;
            // console.log(data.bond);
            data.average_girl_age = +data.average_girl_age;
            data.difference = +data.difference;
            // console.log(data.difference);
        });

        // Step 2: Create scale functions
        // ==============================
        // var xScale = xLinearScale(data, chosenXAxis);
        var xScale = d3.scaleLinear()
            .domain([1950, 2030])
            .range([0, chartWidth]);
        // var yScale = yLinearScale(data, chosenYAxis);
        var yScale = d3.scaleLinear()
            .domain([0, 70])
            .range([chartHeight, 0]);


        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xScale);
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
            .text("Film Release Year");

        console.log("added x label");

        // Add yaxis labels to the chart
        // ==============================
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            ;

        // var bond_ageLabel = ylabelsGroup.append("text")
        //     .attr("x", -chartHeight / 2)
        //     .attr("y", -70)
        //     // .attr("value", "bond_actor_age") // value to grab for event listener
        //     // .classed("inactive", true)
        //     .text("Age of Bond actor")
        //     .style('fill', 'red')
        //     ;

        var actress_ageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -50)
            .attr("value", "actress_age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age of Bond girl");

        var averageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -30)
            .attr("value", "average_girl_age") // value to grab for event listener
            .classed("active", true)
            .text("Average age of Bond girl");


        // add bond axis
        ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -70)
            .attr("value", "bond_actor_age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age of Bond actor")
            .style('fill', 'red')
            ;


        // Add title to the chart
        // ==============================
        chartGroup.append("text")
            .attr("x", (chartWidth / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Bond Girl")
            ;

        console.log("title added");

        // Step 5: Create Circles
        // ==============================
        console.log(chosenXAxis);
        console.log(chosenYAxis);
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d[chosenYAxis]))
            .attr("r", "8")
            .attr("fill", "lightseagreen")
            .attr("opacity", ".5")
            ;

        // add separate data for bond
        var bondGroup = chartGroup.selectAll(".bond")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d['bond_actor_age']))
            .attr("r", "8")
            .attr("fill", "red")
            .attr("opacity", ".5")

        console.log("circles added");

        // // add state labels to circles
        // var circlesText = chartGroup.selectAll(".st_label")
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .style("font-size", "10px")
        //     .attr("x", d => xScale(d[chosenXAxis]))
        //     .attr("y", d => yScale(d[chosenYAxis]))
        //     .attr("text-anchor", "middle")
        //     .attr("alignment-baseline", "central")
        //     .attr("fill", "azure")
        //     .text(d => d.girl);

        // updateToolTip function above csv import
        // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
        console.log("tooltips updated");

        // Step 6: Add event listeners
        // ==============================



        // y axis labels event listener
        ylabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                console.log("are you sleeping?");
                var value = d3.select(this).attr("value");
                console.log("I am listening");
                console.log(value);

                // && (value === "actress_age" || value === "average_age")

                if (value !== chosenYAxis && value !== "bond_actor_age") {
                    // replaces chosenYAxis with value
                    chosenYAxis = value;
                    console.log(chosenYAxis);
                    // updates y scale for new data
                    // yScale = yLinearScale(data, chosenYAxis);
                    // updates y axis with transition
                    // yAxis = renderAxesY(yScale, yAxis);
                    // updates circles with new x, y values
                    circlesGroup = renderCircles(circlesGroup,
                        xScale, chosenXAxis,
                        yScale, chosenYAxis);
                    // circlesText = renderText(circlesText,
                    //     xScale, chosenXAxis,
                    //     yScale, chosenYAxis);
                    // updates tooltips with new info
                    // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                    // changes classes to change bold text
                    // if (chosenYAxis === "bond_actor_age") {
                    //     bond_ageLabel
                    //         .classed("active", true)
                    //         .classed("inactive", false);
                    //     actess_ageLabel
                    //         .classed("active", false)
                    //         .classed("inactive", true);
                    //     averageLabel
                    //         .classed("active", false)
                    //         .classed("inactive", true);
                    // }
                    if (chosenYAxis === "actress_age") {
                        // bond_ageLabel
                        //     .classed("active", false)
                        //     .classed("inactive", true);
                        actress_ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        averageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "average_girl_age") {
                        // bond_ageLabel
                        //     .classed("active", false)
                        //     .classed("inactive", true);
                        actress_ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        averageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });

    }).catch(function (error) {
        console.log(error);
    });

}

makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);