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
    var parseTime = d3.timeParse('%M:%S');
    var formatTime = d3.timeFormat('%M:%S');

    // create scales
    const xScale = d3.scaleTime()
        .domain([d3.min(dataset.map(d => parseYear(d.Year))), d3.max(dataset.map(d => parseYear(d.Year)))])
        .range([padding, w - padding])
    xScale.ticks(d3.timeYear.every(2));
    const yScale = d3.scaleLinear()
        .domain([d3.min(dataset.map(d => d.Seconds)), d3.max(dataset.map(d => d.Seconds))])
        .range([h - padding, padding]);
    // yScale.ticks(d3.timeMinute.every(1));

    // AXES
    // add scales to axes
    const xAxis = d3.axisBottom()
                    .scale(xScale);
    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickFormat((d, i) => {
                        return dataset[i].Time;
                    });
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
            .attr("cx", (d) => xScale(parseYear(d.Year)))
            .attr("cy", (d) => yScale(d.Seconds))
            .attr("r", "5");

    
});
