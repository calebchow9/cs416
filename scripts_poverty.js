var margin = 50;

plot_height = 500;
plot_width = 500;

chart_height = 500;
chart_width = 500;

var svg = d3
  .select("#scatterplot")
  .append("svg")
  .attr("width", plot_width + margin + margin)
  .attr("height", plot_height + margin + margin)
  .attr("transform", "translate(" + margin + "," + margin + ")");

var bar_svg = d3
  .select("#barchart")
  .append("svg")
  .attr("width", chart_width + margin + margin)
  .attr("height", chart_height + margin + margin)
  .attr("transform", "translate(" + margin + "," + margin + ")");

var y = d3.scaleLinear().domain([0, 100]).range([plot_height, 0]);
var x = d3.scaleLinear().domain([0, 100]).range([0, plot_width]);

var bar_y = d3.scaleLinear().domain([0, 100]).range([chart_height, 0]);
var bar_x = d3
  .scaleBand()
  .domain(["White", "Black", "Hispanic/Latino", "Asian"])
  .range([0, chart_width]);

var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

bar_svg
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")")
  .call(d3.axisLeft(bar_y).tickFormat(d3.format("~s")));

bar_svg
  .append("g")
  .attr(
    "transform",
    "translate(" + margin + "," + (chart_height + margin) + ")"
  )
  .call(d3.axisBottom(bar_x));

d3.csv("https://calebchow9.github.io/cs416/state_demographics.csv").then(
  function (data) {
    d3.select("svg")
      .append("g")
      .attr("transform", "translate(" + margin + "," + margin + ")")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", function (d) {
        return y(d["Income.Persons Below Poverty Level"]);
      })
      .attr("cx", function (d) {
        return x(d["EducationBachelorsDegreeorHigher"]);
      })
      .attr("r", 3)
      .on("click", function (d) {
        d3.select("h4").html(`${d["State"]}`);
        bar_data = [
          { n: "White", v: d["Ethnicities.White Alone"] },
          { n: "Black", v: d["Ethnicities.Black Alone"] },
          { n: "Hispanic/Latino", v: d["Ethnicities.Hispanic or Latino"] },
          { n: "Asian", v: d["Ethnicities.Asian Alone"] },
        ];
        bar_svg
          .append("g")
          .selectAll("rect")
          .data(bar_data)
          .enter()
          .append("rect")
          .attr("x", function (d, i) {
            return 125 * i + margin;
          })
          .attr("y", function (d) {
            return margin + bar_y(d.v);
          })
          .style("fill", "lightgreen")
          .attr("width", bar_x.bandwidth())
          .attr("height", function (d) {
            return chart_height - bar_y(d.v);
          });
      })
      .on("mouseover", function (d) {
        div.style("opacity", 1);
        div
          .html(
            `${d.State}<hr>${d.EducationBachelorsDegreeorHigher}%, $${d["Income.Persons Below Poverty Level"]}`
          )
          .style("left", `${d3.event.pageX + 10}px`)
          .style("top", d3.event.pageY - 15 + "px");
      })
      .on("mouseout", function (d) {
        div.style("opacity", 0);
      });
  }
);

d3.select("svg")
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")")
  .call(d3.axisLeft(y).tickFormat(d3.format("~s")));

d3.select("svg")
  .append("g")
  .attr("transform", "translate(" + margin + "," + (plot_height + margin) + ")")
  .call(d3.axisBottom(x).tickFormat(d3.format("~s")));

const annotations = [
  {
    note: {
      label: "22% have bachelor's, 19.6% below poverty line",
      title: "Mississippi",
    },
    type: d3.annotationCalloutCircle,
    subject: {
      radius: 10, // circle radius
      radiusPadding: 0,
    },
    x: x(22) + margin,
    y: y(19.6) + margin,
    dy: -100,
    dx: 50,
  },
  {
    note: {
      label: "43.7% have bachelor's, 9.4% below poverty line",
      title: "Massachusetts",
    },
    type: d3.annotationCalloutCircle,
    subject: {
      radius: 10, // circle radius
      radiusPadding: 0,
    },
    x: x(43.7) + margin,
    y: y(9.4) + margin,
    dy: -100,
    dx: 100,
  },
];

// Add annotation to the chart
const makeAnnotations = d3.annotation().annotations(annotations);
svg.append("g").call(makeAnnotations);

svg
  .append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", plot_width)
  .attr("y", margin + plot_height + margin - 6)
  .text("Population with a Bachelor's Degree or Higher (%)");

svg
  .append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", 0)
  .attr("x", -175)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Population living below Poverty Line (%)");
