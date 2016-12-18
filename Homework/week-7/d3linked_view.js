// Saskia Valstar

// svg margin, width and height for scatterplot
var margin = {top: 20, right: 80, bottom: 30, left: 80},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// axes for scatterplot
var xValue = function(d) { return d.happy_index;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yValue = function(d) { return (d.gdp*1000);}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color for scatterplot
var cValue = function(d) {
    // create variables with colors to fill for each range of values
    if (d.happy_index > 0 && d.happy_index <= 10){
        var fill_value = '#bae4b3';
    }

    else if (d.happy_index > 10 && d.happy_index <= 20){
        fill_value = '#74c476';
    }

    else if(d.happy_index > 20 && d.happy_index <= 30){
        fill_value = '#31a354';
    }

    else if(d.happy_index > 30){
        fill_value = '#006d2c';
    }

    return fill_value;}

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
        .attr("id", "scatterplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area for the scatterplot
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var title = svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Happy Index versus GDP - 2016");

var legendRectSize = 50,
    legendSpacing = 5;
var legendColors = d3.scale.ordinal()
    .domain(["No data", "0-10", "11-20", "21-30", ">30"])
    .range([ "#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);

var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(legendColors.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize;
        var x = 750;
        var y = i * height;
        return 'translate(' + x + ',' + y + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', legendColors)
    .style('stroke', legendColors);

legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

d3.json("d3linkedview_data.json", function(error, data) {
if (error) throw error;
data_set = {};
    data.forEach(function(d) {
        // create dictionary for country codes
        var dict_country = {};
        for (var i = 0; i < country_codes.length; i++){
            dict_country[country_codes[i][2]] = country_codes[i][1];
        }

        // initialize variables from json file
        var country_code = dict_country[d.country];
        var happy_index = +d.happy_index;
        var country_full = d.country;
        var gdp = +d.gdp;

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
        .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Happy Index");

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("GDP");

        // draw dots
        svg.selectAll(".dot")
            .data(data)
        .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return cValue(d);})
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(20)
                    .style("opacity", .9);
                tooltip.html(d.country + "<br/> (" + "Happy Index: " + xValue(d)
                + ", " + "GDP: " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

            // create variables with colors to fill for each range of values
            if (happy_index > 0 && happy_index <= 10){
                var fill_value = "LOW";
            }

            else if (happy_index > 10 && happy_index <= 20){
                fill_value = "MEDIUM";
            }

            else if(happy_index > 20 && happy_index <= 30){
                fill_value = "HIGH"
            }

            else if(happy_index > 30){
                fill_value = "SUPERHIGH"
            }

            // create structure with country code with object for whole dataset
            for (var i = 0; i < country_codes.length; i++){
                var land = country_code;
                data_set[land] = {fillKey: fill_value, happy_index: happy_index, name: country_full};
            }

    });

     // toggle function for scatterplot
    $(document).ready(function(){
        $("button").click(function(){
            $("#scatterplot").toggle();
        });
    });

    // draw map
    $("#container").datamap({
        scope: 'world',
        geography_config: {
        borderColor: 'rgba(200,200,200,0.3)',
        highlightBorderColor: 'rgba(0,0,0,0.6)',
        popupTemplate: _.template([
            '<div class="hoverinfo">',
            '<% if (data.name) { %> <strong><%= data.name %></strong><br/><% } %>',
            '<% if (data.happy_index) { %>',
            'Happy Index Score: <%= data.happy_index %><br/> <% } %>',
            '</div>'
        ].join('') )
        },
        fills: {
            defaultFill: '#edf8e9',
            LOW: '#bae4b3',
            MEDIUM: '#74c476',
            HIGH: '#31a354',
            SUPERHIGH: '#006d2c'
        },

    data: data_set

    });

});


