async function drawTable() {
  // Access Data
  const datasetRaw = await d3.csv("/../../../../../coal_exports_2018.csv");
  const dataset = await datasetRaw.map(d => {
    return {
      ...d,
      CoalExports: parseFloat(d["CoalExports"].replace(/,/g, "")) // remove commas from string to convert to int
    };
  });
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
  const rScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    .range([2, 50]);

  dataset.map(d => buildChart(d));

  //Draw Data

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
      .append("path")
      .attr(
        "d",

        "M462.5,497.5a24,24,0,0,1,.82,2.7c1.26,5,2.43,8.06,3.65,12.23,3.72,12.64,10.29,42.75,24.53,72.07,7.68,15.81,11.62,19.2,16,20,10.09,1.83,20.22-10.59,23-14,9.08-11.13,6.19-17,16-34,6-10.5,8.09-9.93,15-21,9.2-14.73,9.13-21.39,15-34,13.39-28.73,28.06-24.73,39-51,5.54-13.31,6.2-24.95,7-39,.85-15-.75-26.22-4-48-4.19-28.09-6.43-42.33-14-52-5.52-7.05-13-11.7-28-21-13-8-22.53-14-36-18-14.43-4.31-26-3.87-49-3-26.37,1-39.76,1.65-50,9-3.08,2.21-9.09,10.84-21,28-17.69,25.5-19.27,29.81-20,35-1.52,10.72,1.2,20.73,4,31a101.22,101.22,0,0,0,7,19c5.78,11.76,8.9,12,14,23,.71,1.53,2.81,8,7,21,3.26,10.08,7,22,7,22,5.8,9.95,9.07,15.62,11,19l4,7,4,7C460.17,493.05,461.41,494.57,462.5,497.5Z"
      )
      // .attr("width", 20)
      // .attr("height", 60)
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

  //Draw Peripherals

  //Set up interactions

  //tooltip
}

drawTable();
// window.addEventListener("resize", drawTable.render);
