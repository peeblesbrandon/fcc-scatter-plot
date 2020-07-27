var w = 1000;
var h = 500;
var padding = 50;

// svg for plot
var svg = d3.select("#chart")
            .append("svg")
            .attr("height", h)
            .attr("width", w)
// div for creating tooltip
var tooltipDiv = d3.select("#chart")
                    .append("div")
                    .attr("id", "tooltip")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(err, dataset) {
    if (err) {
        throw err;
    }
    
    // var yearsArr = dataset.
    var parseYear  = d3.timeParse('%Y'); 
    var formatYear = d3.timeFormat('%Y');
    // var parseSecond = d3.timeParse('%S'); 
    var parseTime = d3.timeParse('%M:%S');
    var formatTime = d3.timeFormat('%M:%S');

    var parsedYears = dataset.map((d) => {
        return parseYear(d.Year);
    });
    var parsedTimes = dataset.map((d) => {
        return parseTime(d.Time);
    });

    // create scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(parsedYears))
        .range([padding, w - padding])
        .nice();
    const yScale = d3.scaleTime()
        .domain(d3.extent(parsedTimes))
        .range([h - padding, padding])
        .nice();

    // AXES
    // add scales to axes
    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(d3.timeYear.every(2));
    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    // .tickValues(parsedTimes)
                    .tickFormat((d) => {
                        return formatTime(d);
                    })
                    .ticks(d3.timeSecond.every(30));
    // append group and insert axes
    svg.append("g")
        .call(xAxis)
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .attr("id", "x-axis");
    svg.append("g")
        .call(yAxis)
        .attr("transform", "translate(" + padding + ", 0)")
        .attr("id", "y-axis");
    
        // DOTS
        svg.selectAll(".dot")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("data-xvalue", (d) => parseYear(d.Year))
            .attr("data-yvalue", (d) => parseTime(d.Time))
            .attr("cx", (d) => xScale(parseYear(d.Year)))
            .attr("cy", (d) => yScale(parseTime(d.Time)))
            .attr("r", 7)
            .style("fill", (d) => {
                return d.Doping === "" ? "lightgreen" : "darkred";
            })
            .on("mouseover", function(d) {
                d3.select(this).transition()
                    .duration("200")
                    .attr("r", 15);
                tooltipDiv.transition()
                    .duration("200")
                    .style("opacity", 0.9)
                tooltipDiv.html("<b>Name: </b>" + d.Name + " (" + d.Nationality + ")"
                    + "</br><strong>Year: </b>" + d.Year + ", <b>Time: </b>" + d.Time
                    + (d.Doping === "" ? "" : '</br><b>Summary: ' + d.Doping))
                    .style("left", (d3.event.pageX + 25) + "px")
                    .style("top", (d3.event.pageY - 20) + "px")
                    .attr("data-year", parseYear(d.Year));
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration("200")
                    .attr("r", 7);
                tooltipDiv.transition()
                    .duration("200")
                    .style("opacity", 0);
            });

    
});
