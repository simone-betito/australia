async function drawTable() {
  // Access Data

  const dataset = await d3.csv("/../../../../../coal_exports_2018.csv");
  const yAccessor = d => d.CoalExports;
  const xAccessor = d => d.Rank;

  console.log(dataset);
  //Create Chart Dimensions

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //Draw Canvas

  const wrapper = d3
    .select("#wrapper")
    //console.log(wrapper);
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  //Create Scales

  const yScale = d3
    .scaleLinear()
    //console.log(d3.extent(dataset, yAccessor));
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  //Draw Data

  const bars = wrapper
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      return `translate(${(i * window.innerWidth) / dataset.length}, 0)`;
    })
    .attr("cat", (d, i) => {
      return d.CoalExports;
    })
    .style("fill", "gold");

  bars
    .append("rect")
    .attr("width", window.innerWidth / dataset.length)
    .attr("height", (d, i) => {
      return (d.CoalExports / 100) * window.innerHeight;
    })
    .attr("y", (d, i) => {
      return window.innerHeight - (d.CoalExports / 100) * window.innerHeight;
    })
    .attr("id", "output");

  //Draw Peripherals
  bars
    .append("text")
    .text(d => {
      return d.Exporter;
    })
    .attr("transform", (d, i) => {
      return `translate(${window.innerWidth / dataset.length}, ${
        window.innerHeight
      }) rotate(-90)`;
    })
    .style("fill", "black");

  //Set up interactions
}

drawTable();
window.addEventListener("resize", drawTable.render);
