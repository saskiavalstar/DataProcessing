// Saskia Valstar
// 11423404

var tooltip = d3.select("body")
.append("div")
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden")
.text("a simple tooltip");

// set the dimensions of the canvas / graph
var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 900 - margin.left - margin.right,
	height = 560 - margin.top - margin.bottom;

// parse the date / time
var	parseDate = d3.time.format("%Y%m%d").parse;

// set the ranges
var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

// define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(10)

var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(10);

// define line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.minimum_temp); });

// define line2
var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.maximum_temp); });

// define line3
var valueline3 = d3.svg.line()
    .x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.average_temp); });

// adds the svg canvas
var	svg = d3.select("body")
	.append("svg")
		.attr("width", width + margin.left + margin.right + 150)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var focus = svg.append("g")
    .style("display", "none");

// add the title
svg.append("text")
        .attr("x", (width / 2.2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .style("fill", "MidnightBlue")
        .text("Minimum, maximum and average temperature in January 2016 in Maastricht");

// get the data
d3.json("d3line_data.json", function(error, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.minimum_temp = +d.minimum_temp/10;
		d.maximum_temp = +d.maximum_temp/10;
		d.average_temp = +d.average_temp/10;
	});

	// scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([-7, d3.max(data, function(d) { return Math.max(d.minimum_temp, d.maximum_temp, d.average_temp); })]);

	// add the valueline path.
	svg.append("path")
		.attr("class", "line")
		.attr("d", valueline(data));

	// add the valueline2 path.
    svg.append("path")
		.attr("class", "line2")
		.attr("d", valueline2(data));

    // add the valueline2 path.
    svg.append("path")
		.attr("class", "line3")
		.attr("d", valueline3(data));

    // draw the scatterplot for valueline
	svg.selectAll("dot")
		.data(data)
	.enter().append("circle")
		.attr("r", 3)
		.attr("class", "dot")
		.attr("cx", function(d) { return x(d.date); })
		.attr("cy", function(d) { return y(d.minimum_temp); })
    // interactivity
    .on("mouseover", function(d){
        tooltip.text(d.minimum_temp + " " + d.date);
        return tooltip.style("visibility", "visible");
        })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    // draw the scatterplot for valueline2
	svg.selectAll("dot2")
		.data(data)
	.enter().append("circle")
		.attr("r", 3)
		.attr("class", "dot")
		.attr("cx", function(d) { return x(d.date); })
		.attr("cy", function(d) { return y(d.maximum_temp); })
    // interactivity
    .on("mouseover", function(d){
        tooltip.text(d.maximum_temp + " " + d.date);
        return tooltip.style("visibility", "visible");
        })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    // draw the scatterplot for valueline3
	svg.selectAll("dot3")
		.data(data)
	.enter().append("circle")
		.attr("r", 3)
		.attr("class", "dot")
		.attr("cx", function(d) { return x(d.date); })
		.attr("cy", function(d) { return y(d.average_temp); })
    // interactivity
    .on("mouseover", function(d){
        tooltip.text(d.average_temp + " " + d.date);
        return tooltip.style("visibility", "visible");
        })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

	// add the X Axis
	svg.append("g")			// Add the X Axis
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// add the Y Axis
	svg.append("g")			// Add the Y Axis
		.attr("class", "y axis")
		.call(yAxis);

    // append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "blue")
        .attr("r", 4);

    // add label to valueline
    svg.append("text")
		.attr("transform", "translate(" + (width+5) + "," + y(data[31].minimum_temp) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "Olive")
		.style("font-weight", "bold")
		.text(" Minimum temperature");

    // add label to valueline2
	svg.append("text")
		.attr("transform", "translate(" + (width+5) + "," + y(data[31].maximum_temp) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "Teal")
		.style("font-weight", "bold")
		.text("Maximum temperature");

    // add label to valueline3
    svg.append("text")
		.attr("transform", "translate(" + (width+5) + "," + y(data[31].average_temp) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "MidnightBlue")
		.style("font-weight", "bold")
		.text(" Average temperature");


});
