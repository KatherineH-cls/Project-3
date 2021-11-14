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
                    <br>Age difference: ${d.difference}`;
                }
                console.log("inside tool tip");
                console.log(d.year);
                return tipText;
            });


        circlesGroup.call(toolTip);



        circlesGroup.on("mouseover", function (data) {
            toolTip.show(data);
            // mouseover;
            console.log("mouseover");
            d3.select(this)
                .transition()
                .duration(300)
            // .attr("fill", "teal")
            // .attr("r", "15")
            // .style("stroke", "black");
        })
            // onmouseout event
            .on("mouseout", function (data) {
                toolTip.hide(data);
                d3.select(this)
                    .transition()
                    .duration(300)
                // .attr("fill", "lightseagreen")
                // .attr("r", "10")
                // .style("stroke", "none");
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



        bondGroup.on("mouseover", function (data) {
            bondTip.show(data);
            // mouseover;
            console.log("mouseover");
            d3.select(this)
                .transition()
                .duration(300)
            // .attr("fill", "teal")
            // .attr("r", "15")
            // .style("stroke", "black");
        })
            // onmouseout event
            .on("mouseout", function (data) {
                bondTip.hide(data);
                d3.select(this)
                    .transition()
                    .duration(300)
                // .attr("fill", "lightseagreen")
                // .attr("r", "10")
                // .style("stroke", "none");
            });

        return bondGroup;
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

        console.log(yScale(70 - 33));


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



        var actress_ageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -50)
            .attr("value", "actress_age") // value to grab for event listener
            .classed("inactive", true)
            .attr("fill", "#f55f1f")
            .text("Age of Bond girl");

        var averageLabel = ylabelsGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -30)
            .attr("value", "average_girl_age") // value to grab for event listener
            .classed("active", true)
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
            .style("font-size", "14px")
            .text("Bond Girl")
            ;

        console.log("title added");

        //add box for 25 percentile to 75 percentile
        // ==============================
        chartGroup.selectAll(".spread")
            .data(data)
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

        // Step 5: Create Circles
        // ==============================
        console.log(chosenXAxis);
        console.log(chosenYAxis);
        var circlesGroup = chartGroup.selectAll("girls")
            .data(data)
            .enter()
            .append("circle")
            // .attr("value", function (d) {
            //     // console.log("assigning value");
            //     // console.log(d.actor);
            //     return d.year
            // })
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d[chosenYAxis]))
            .attr("r", "8")
            .attr("fill", "#f55f1f")
            .attr("opacity", ".6")
            ;

        // add separate circles for Bond
        // ==============================
        // Color scale: give me a specie name, I return a color
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
            .data(data)
            .enter()
            .append("circle")
            .attr("value", function (d) {
                // console.log("assigning value");
                // console.log(d.actor);
                return d.actor
            })
            .attr("class", "bond")
            // .attr("class", function (d) { 
            //     console.log(`"${d.actor}"`);
            //     return `"${d.actor}"`})
            .attr("cx", d => xScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d['bond_actor_age']))
            .attr("r", "8")
            .attr("fill", function (d) { return color(d.actor) })
            .attr("opacity", ".5")
        // .on("mouseover", highlight)
        // .on("mouseleave", doNotHighlight)

        // Activate tooltips
        // ==============================
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
        bondGroup = updateBondTip(chosenYAxis, bondGroup);
        console.log("tooltips updated");

        // Step 6: Add event listeners
        // ==============================

        // function highlight(value_test) {
        //     d3.selectAll(".bond")
        //     .style("fill", function (d){
        //         if d.actor === value_test
        //         return "red"
        //         else return "green"
        //     })
        // }

        // bond event listener
        chartGroup.selectAll(".bond")
            .on("click", function () {
                console.log("get ready");
                var value = d3.select(this).attr("value");
                console.log("I am clicking");
                console.log(value);
                // highlight(value);
            })


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
                    circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                    // changes classes to change bold text

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

// var ylabel;
// if (chosenYAxis === "actress_age") {
//     ylabel = "one";
// }
// else if (chosenYAxis === "average_girl_age") {
//     ylabel = "two";
// }
// else if (chosenYAxis === "bond_actor_age") {
//     ylabel = "three";
// }
// else ylabel = "no data";
// console.log(chosenYAxis);
// console.log(ylabel);

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
// create a tooltip
// var toolTip = d3.select("circle")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "2px")
//     .style("border-radius", "5px")
//     .style("padding", "5px")
//     .text("this is a tooltip")

// console.log("after tooltip");

// circlesGroup.on("mouseover", function (data) {
//     toolTip.show(data);
//     d3.select(this)
//         .transition()
//         .duration(300)
//         // .attr("fill", "teal")
//         // .attr("r", "15")
//         // .style("stroke", "black");
// })

// var toolTip = d3.tip()
// .attr("class", "tooltip")
// .offset([-10, -60])
// .style("background-color", "white")
// .style("border", "solid")
// .style("border-width", "1px")
// .style("border-radius", "5px")
// .style("padding", "10px")
// .html(function (d) {
//     return (`<strong>${d.year}</strong>
// <br>${ylabel} ${d[chosenYAxis]}
// <br>${ylabel} ${d[chosenYAxis]} %`);
// })
// ;


// Three function that change the tooltip when user hover / move / leave a cell
// var mouseover = function (d) {
//     toolTip
//         .style("opacity", 1)
//     d3.select(this)
//         .style("stroke", "black")
//         .style("opacity", 1)
// }
// var mousemove = function (d) {
//     toolTip
//         .html("The exact value of<br>this cell is: " + d.year)
//         .style("left", (d3.mouse(this)[0] + 70) + "px")
//         .style("top", (d3.mouse(this)[1]) + "px")
// }
// var mouseleave = function (d) {
//     toolTip
//         .style("opacity", 0)
//     d3.select(this)
//         .style("stroke", "none")
//         .style("opacity", 0.8)
// }

// return (`<strong>${d.year}</strong>
// <br>${ylabel} ${d[chosenYAxis]} %`);
// });



// console.log("toolTip");

// circlesGroup.call(toolTip);

// console.log("toolTip2");

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

// var bond_ageLabel = ylabelsGroup.append("text")
//     .attr("x", -chartHeight / 2)
//     .attr("y", -70)
//     // .attr("value", "bond_actor_age") // value to grab for event listener
//     // .classed("inactive", true)
//     .text("Age of Bond actor")
//     .style('fill', 'red')
//     ;

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

        // /* Initialize tooltip */
        // tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

        // /* Invoke the tip in the context of your visualization */
        // chartGroup.call(tip)

        // chartGroup.selectAll('circle')
        //   .data(data)
        //   .enter()
        //   .append('rect')
        //   .attr('width', function() { return x.rangeBand() })
        //   .attr('height', function(d) { return h - y(d) })
        //   .attr('y', function(d) { return y(d) })
        //   .attr('x', function(d, i) { return x(i) })
        //   .on('mouseover', tip.show)
        //   .on('mouseout', tip.hide)

        // updateToolTip function above csv import
        // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
//         d3.select("#div_template")
        // .selectAll("div")
        //   .data(data)
        // .enter().append("div")
        //   .style("width", function(d) { return x(d) + "px"; })
        //   .text(function(d) { return d; })
        //   .on("mouseover", function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
        //     .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        //     .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        //     console.log("after mouse events");

        // Highlight the specie that is hovered
        // var highlight = function (d) {

        //     selected_actor = d.actor
        //     console.log("went to highlight");
        //     console.log(d.actor);

        //     d3.selectAll(".dot")
        //         .transition()
        //         .duration(200)
        //         .style("fill", "lightgrey")
        //         .attr("r", 3)

        //     d3.selectAll("dot " + d.actor)
        //         .transition()
        //         .duration(200)
        //         .style("fill", color(selected_actor))
        //         .attr("r", 7)
        // }

        // Highlight the specie that is hovered
        // var doNotHighlight = function () {
        //     d3.selectAll(".dot")
        //         .transition()
        //         .duration(200)
        //         .attr("r", "8")
        //     .style("fill", function (d) { return color(d.actor) })
        //     .attr("opacity", ".5")
        // }