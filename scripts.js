height = 1500;
width = 1500;
var margin = 250;

var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
var x = d3.scaleLinear().domain([0, 100]).range([0, width]);

d3.csv("./state_demographics.csv").then(function (data) {
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .selectAll("circle")
    .data(data)
    .enter.append("circle")
    .attr("cx", function (d) {
      return d.Education.BachelorsDegreeorHigher;
    })
    .attr("cy", function (d) {
      return d.Income.MedianHouseholdIncome;
    })
    .attr("r", 10);
});

d3.select("svg")
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")")
  .call(d3.axisLeft(y));

d3.select("svg")
  .append("g")
  .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
  .call(d3.axisBottom(x));
