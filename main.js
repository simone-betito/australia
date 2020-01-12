async function drawTable() {
  // Access Data
  const datasetRaw = await d3.csv('/../../../../../coal_exports_2018.csv');
  const dataset = await datasetRaw.map(d => {
    return {
      ...d,
      CoalExports: parseFloat(d['CoalExports'].replace(/,/g, '')) // remove commas from string to convert to int
    };
  });

  //Create Chart Dimensions
  let dimensions = {
    width: 200,
    height: 380,
    margin: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    }
  };

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const tooltip = d3
    .select('#wrapper')
    .append('div')
    .style('opacity', 0)
    .attr('id', 'tooltip');

  const yAccessor = d => d.CoalExports;

  //Create Scales
  const rScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    .range([0.05, 0.62]);

  dataset.map(d => buildChart(d));

  //Draw Data
  function buildChart(d) {
    const wrapper = d3
      .select('#wrapper')
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const bounds = wrapper
      .append('g')
      .style('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

    bounds
      .selectAll('text')
      .data([d])
      .enter()
      .append('text')
      .text(d => `#${d.Rank} ${d.Exporter}`)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${dimensions.boundedWidth / 2}, 0)`)
      .attr('y', dimensions.boundedHeight);

    const plumeGroup = bounds
      .append('g')
      .attr('id', 'plume-group')
      .attr('transform', `translate(-2, -145)`);

    plumeGroup
      .selectAll('path')
      .data([d])
      .enter()
      .append('path')
      .style('fill', '#d9e3e3')
      .attr(
        'd',
        'M64.5,230.5a24,24,0,0,1,.82,2.7c1.26,5,2.43,8.06,3.65,12.23,3.72,12.64,10.29,42.75,24.53,72.07,7.68,15.81,11.62,19.2,16,20,10.09,1.83,20.22-10.59,23-14,9.08-11.13,6.19-16.95,16-34,6-10.5,8.09-9.93,15-21,9.2-14.73,9.13-21.39,15-34,13.39-28.73,28.06-24.73,39-51,5.54-13.31,6.2-24.95,7-39,.85-15-.75-26.22-4-48-4.19-28.09-6.43-42.33-14-52-5.52-7-13-11.7-28-21-12.95-8-22.53-14-36-18-14.43-4.31-26-3.87-49-3-26.37,1-39.76,1.65-50,9-3.08,2.21-9.09,10.84-21,28C4.81,65,3.23,69.31,2.5,74.5c-1.52,10.72,1.2,20.73,4,31a101.22,101.22,0,0,0,7,19c5.78,11.76,8.9,12,14,23,.71,1.53,2.81,8,7,21,3.26,10.08,7,22,7,22,5.8,9.95,9.07,15.62,11,19l4,7,4,7C62.17,226.05,63.41,227.57,64.5,230.5Z'
      )
      .attr('transform', d => `translate(-5) rotate(3) scale(${rScale(d.CoalExports)})`)
      .on('mousemove', function(d) {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 1);

        tooltip
          .html(
            `<p>Amount Exported in USD</p>
              ${d3.format('$,')(d.CoalExports)}`
          )
          .style('left', d3.event.clientX + 30 + 'px')
          .style('top', d3.event.clientY - 30 + 'px');
      })
      .on('mouseleave', () => {
        tooltip
          .transition()
          .duration(100)
          .style('opacity', 0);
      });

    const stackGroup = bounds
      .append('g')
      .attr('id', 'stack-group')
      .attr(
        'transform',
        `translate(${dimensions.boundedWidth / 2 - 13}, ${dimensions.boundedHeight -
          135}) scale(0.8)`
      );
    stackGroup.append('polyline').attr('points', '0.71 1.95 0.25 140.44 32.75 140.55 33.21 2.06');
    stackGroup
      .append('ellipse')
      .attr('cx', 16.98)
      .attr('cy', 2.5)
      .attr('rx', 16)
      .attr('ry', 2);
  }
}

drawTable();
// window.addEventListener("resize", drawTable.render);
