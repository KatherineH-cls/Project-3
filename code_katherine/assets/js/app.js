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

    // function used for updating x-scale var upon click on axis label
    function xLinearScale(data, chosenXAxis) {
        var xscale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[chosenXAxis])).nice()
            .range([0, chartWidth]);
        return xscale;
    }

    // function used for updating xAxis var upon click on axis label
    function renderAxesX(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xAxis;
    }

    // function used for updating y-scale var upon click on yaxis label
    function yLinearScale(data, chosenYAxis) {
        var yscale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[chosenYAxis])).nice()
            .range([chartHeight, 0]);
        return yscale;
    }

    // function used for updating yAxis var upon click on yaxis label
    function renderAxesY(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
            .duration(1000)
            .call(leftAxis);
        return yAxis;
    }

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
    function renderText(circlesText,
        xScale, chosenXAxis,
        yScale, chosenYAxis) {

        circlesText.transition()
            .duration(1000)
            .attr("x", d => xScale(d[chosenXAxis]))
            .attr("y", d => yScale(d[chosenYAxis]));

        return circlesText;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

        var xlabel;
        if (chosenXAxis === "year") {
            xlabel = "Film Release Year";
        }
        else if (chosenXAxis === "age") {
            xlabel = "Age: ";
        }
        else if (chosenXAxis === "income") {
            xlabel = "Income: ";
        }
        else xlabel = "No data";

        var ylabel;
        if (chosenYAxis === "actress_age") {
            ylabel = "Age of Bond Girl:";
        }
        else if (chosenYAxis === "smokes") {
            ylabel = "Smokers: ";
        }
        else if (chosenYAxis === "healthcare") {
            ylabel = "Lacks Healthcare: ";
        }
        else ylabel = "no data";

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([-10, -60])
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .html(function (d) {
                return (`<strong>${d.girl_name}</strong>
            <br>${xlabel} ${d[chosenXAxis]}
            <br>${ylabel} ${d[chosenYAxis]} %`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
            toolTip.show(data);
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
    var chosenYAxis = "actress_age";

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
            data.actress_age = +data.actress_age;
            data.bond_age = +data.bond_age;
            data.film_release_year = data.year;
            data.bond_girl_name = data.girl;
            data.bond_actor = data.bond;
        });

        // Step 2: Create scale functions
        // ==============================
        var xScale = xLinearScale(data, chosenXAxis);

        var yScale = yLinearScale(data, chosenYAxis);

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

        var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household income (median)");

        // Add yaxis labels to the chart
        // ==============================
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            ;

        var bond_ageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -70)
            .attr("value", "bond_age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age of Bond actor");

        var actess_ageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -50)
            .attr("value", "actress_age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age of Bond girl");

        var healthcareLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -30)
            .attr("value", "healthcare") // value to grab for event listener
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        // Add title to the chart
        // ==============================
        chartGroup.append("text")
            .attr("x", (chartWidth / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Bond Girl")
            ;

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d[chosenYAxis]))
            .attr("r", "10")
            .attr("fill", "lightseagreen")
            .attr("opacity", ".5")
            ;

        // add state labels to circles
        var circlesText = chartGroup.selectAll(".st_label")
            .data(data)
            .enter()
            .append("text")
            .style("font-size", "10px")
            .attr("x", d => xScale(d[chosenXAxis]))
            .attr("y", d => yScale(d[chosenYAxis]))
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr("fill", "azure")
            .text(d => d.girl);

        // updateToolTip function above csv import
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Step 6: Add event listeners
        // ==============================

        // x axis labels event listener
        xlabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {
                    // replaces chosenXAxis with value
                    chosenXAxis = value;
                    // updates x scale for new data
                    xScale = xLinearScale(data, chosenXAxis);
                    // updates x axis with transition
                    xAxis = renderAxesX(xScale, xAxis);
                    // updates circles with new x values
                    circlesGroup = renderCircles(circlesGroup,
                        xScale, chosenXAxis,
                        yScale, chosenYAxis);
                    circlesText = renderText(circlesText,
                        xScale, chosenXAxis,
                        yScale, chosenYAxis);
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // changes classes to change bold text
                    if (chosenXAxis === "year") {
                        yearLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "age") {
                        yearLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "income") {
                        yearLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });

        // y axis labels event listener
        ylabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {
                    // replaces chosenXAxis with value
                    chosenYAxis = value;
                    console.log(chosenYAxis)
                    // updates x scale for new data
                    yScale = yLinearScale(data, chosenYAxis);
                    // updates x axis with transition
                    yAxis = renderAxesY(yScale, yAxis);
                    // updates circles with new x, y values
                    circlesGroup = renderCircles(circlesGroup,
                        xScale, chosenXAxis,
                        yScale, chosenYAxis);
                    circlesText = renderText(circlesText,
                        xScale, chosenXAxis,
                        yScale, chosenYAxis);
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // changes classes to change bold text
                    if (chosenYAxis === "bond_age") {
                        bond_ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        actess_ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "smokes") {
                        bond_ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        actress_ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "healthcare") {
                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
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