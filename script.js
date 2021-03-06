// !! IMPORTANT README:

// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. 

/***********
INSTRUCTIONS:
  - Select the project you would 
    like to complete from the dropdown 
    menu.
  - Click the "RUN TESTS" button to
    run the tests against the blank 
    pen.
  - Click the "TESTS" button to see 
    the individual test cases. 
    (should all be failing at first)
  - Start coding! As you fulfill each
    test case, you will see them go   
    from red to green.
  - As you start to build out your 
    project, when tests are failing, 
    you should get helpful errors 
    along the way!
    ************/

// PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

// Once you have read the above messages, you can delete all comments. 


//Defining chart size and padding
var margin = { top: 80, right: 10, bottom: 80, left: 10 },
width = 1500 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom,
padding = 50;

//currentWidth = parseInt(d3.select('#div_basicResize').style('width'), 10)


//Chart name definition
const title = d3.select('body').
append('title').
attr("id", "title").
text('United States GDP');

// Data extraction and main function
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function (data) {
  //extract data
  var dataset = data.data;

  var parseDate = d3.timeParse("%Y-%m-%d"); //convert to timestamp
  var formatDate = d3.timeFormat("%Y-%m-%d"); //convert to desired time format

  function displayDate(date) {
    /*Takes in timestamp and returns the year and business quarter*/
    if (date.getMonth() < 3) {
      return date.getFullYear() + " Q1";
    } else

    if (date.getMonth() < 6) {
      return date.getFullYear() + " Q2";
    } else

    if (date.getMonth() < 9) {
      return date.getFullYear() + " Q3";
    } else

    {
      return date.getFullYear() + " Q4";
    }
  }

  var xData = [];
  var length = dataset.length; // user defined length

  for (var i = 0; i < length; i++) {
    //save a copy of the original dataset date entries
    xData.push(dataset[i][0]);
  }

  dataset.forEach(function (d) {
    d[0] = parseDate(d[0]);
  });

  // Set x-axis scale based on timestamp limits
  xScale = d3.scaleTime().
  domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])]).
  range([padding, width - padding]);

  // Set y-axis scale based on GDP limits
  yScale = d3.scaleLinear().
  domain([0, d3.max(dataset, d => d[1])]).
  range([height - padding, padding]);

  // Define tooltip and style
  var tooltip = d3.select('body').
  append('div').
  attr('id', 'tooltip').
  attr('style', 'position: absolute; opacity: 0; \n' +
  'background-color: white; border: solid; border-width: 1px; \n' +
  'border-radius: 5px; padding: 10px');

  // Append SVG to body
  const svg = d3.select('body').
  append('svg').
  attr("width", width).
  attr("height", height);

  // Define the data bars
  var rect = svg.selectAll("rect").
  data(dataset).
  enter().append("rect").
  attr("class", "bar").
  attr("id", "rect").
  attr("data-date", d => formatDate(d[0])).
  attr("data-gdp", d => d[1]).
  attr("fill", "steelblue").
  attr("x", d => {return xScale(d[0]);}).
  attr("width", width / dataset.length - 0.2).
  attr("y", d => {return yScale(d[1]);}).
  attr("height", d => {return height - padding - yScale(d[1]);})

  // tooltip mouseover action
  .on('mouseover', d => {
    d3.select('#tooltip').
    attr('data-date', formatDate(d[0])).
    html(displayDate(d[0]) +
    "<br>$" + Intl.NumberFormat().format(d[1]) + " Billion").
    transition().duration(200).
    style('opacity', 1);
  })

  // tooltip mouseout action
  .on('mouseout', function () {
    d3.select('#tooltip').
    transition().duration(200).
    style('opacity', 0);
  })

  // tooltip mousemove action
  .on('mousemove', function () {
    d3.select('#tooltip').
    style('left', d3.event.pageX + padding / 2 + 'px').
    style('top', '500px');
  });

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Display X-Axis
  svg.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + (height - padding) + ")").
  call(xAxis);

  // Dispay Y-Axis
  svg.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + padding + ",0)").
  call(yAxis);

  // Display Y-axis title
  svg.append("text").
  attr("y", height - padding / 3).
  attr("x", width / 2).
  text("Years");

  // Display X-axis title
  svg.append("text").
  attr("transform", "rotate(-90)").
  attr("y", 60).
  attr("x", 0 - height / 2).
  attr("dy", "1em").
  style("text-anchor", "middle").
  text("Gross Domestic Product");

  // Add Chart title
  svg.append("text").
  attr("x", width / 2).
  attr("y", padding).
  style("text-anchor", "middle").
  text("United States GDP").
  style("font-size", "30");

  svg.append("text").
  attr("x", width - padding * 8).
  attr("y", height - padding / 10).
  style("text-anchor", "right").
  text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf").
  style("font-size", "15");

});