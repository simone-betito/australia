async function drawTable() {
  // Access Data
  const datasetRaw = await d3.csv("/../../../../../coal_exports_2018.csv");
  const dataset = await datasetRaw.map(d => {
    return {
      ...d,
      CoalExports: parseFloat(d["CoalExports"].replace(/,/g, "")) // remove commas from string to convert to int
    };
  });
  console.log(dataset);
  //Create Chart Dimensions

  let dimensions = {
    width: 125,
    height: 200,
    margin: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    }
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //Draw Canvas

  const yAccessor = d => d.CoalExports;
  const xAccessor = d => d.Rank;

  //Create Scales

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const rScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    .range([2, 50]);

  dataset.map(d => buildChart(d));

  function buildChart(d) {
    const wrapper = d3
      .select("#wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      );

    bounds
      .selectAll("text")
      .data([d])
      .enter()
      .append("text")
      .text(d => d.Exporter)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${dimensions.boundedWidth / 2}, 0)`)
      .attr("y", dimensions.boundedHeight);

    bounds
      .append("rect")
      .attr("width", 20)
      .attr("height", 60)
      .attr(
        "transform",
        `translate(${dimensions.boundedWidth / 2 -
          10}, ${dimensions.boundedHeight - 80})`
      );

    bounds
      .selectAll("circle")
      .data([d])
      .enter()
      .append("circle")
      .attr("r", d => rScale(d.CoalExports))
      .attr(
        "transform",
        d =>
          `translate(${dimensions.boundedWidth /
            2}, ${dimensions.boundedHeight - 90 - rScale(d.CoalExports)})`
      );
  }

  //Draw Data

  //Set up interactions
}

drawTable();
window.addEventListener("resize", drawTable.render);
