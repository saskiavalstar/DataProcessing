var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0,width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "pink")
    .style("opacity", 0.5);

tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .style("font-family", "Helvetica")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");


d3.json("data.json", function(error, data) {
    data.forEach(function(d) {
        d.jaar = +d.jaar;
        d.zuigelingensterfte = +d.zuigelingensterfte;
    });


    x.domain(data.map(function(d) {return d.jaar}));
    y.domain([0, d3.max(data, function(d) {return d.zuigelingensterfte;})]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor","end")
        .text("Zuigelingensterfte");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {return x(d.jaar); })
            .attr("y", function(d) {return y(d.zuigelingensterfte); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) {return height - y(d.zuigelingensterfte); })
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 15;
                var yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d.zuigelingensterfte);
            });

    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", 50 - margin.top )
        .style("text-anchor", "middle")
        .style("font-family", "Helvetica")
        .style("font-size", "22px")
        .attr("fill", "SlateGray")
        .text("Zuigelingensterfte per 1000 levendgeborenen");

});

