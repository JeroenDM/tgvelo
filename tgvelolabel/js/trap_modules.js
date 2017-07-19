// var dataModule = (function() {
//   // Bike data can not be changed at the moment
//   var bikeData = [
//     {
//       name: "Nuvinci",
//       gearRatios: [1.2, 2, 3]
//     },
//     {
//       name: "Nexus 8",
//       gearRatios: [1.3, 2, 3.1]
//     },
//     {
//       name: "Nexus 6",
//       gearRatios: [2, 2.5, 3]
//     }
//   ];
//
//   // bike names in seperate vector for use of plot flexible function
//   var bikeNames = [];
//   for (i=0; i<bikeData.length; i++) {
//     bikeNames.push(bikeData[i].name);
//   }
//
//   // Init data for speed plot, changed by updateData
//   var speedData = [
//     {
//       small: 10,
//       big: 30
//     },
//     {
//       small: 5,
//       big: 20
//     },
//     {
//       small: 7,
//       big: 25
//     }
//   ];
//
//   function updateData(wheelSize, front, back) {
//     if (back == 0) {
//       console.log("back is zero");
//     } else {
//       var circ = parseFloat(wheelSize) / 10;
//       var factor = parseFloat(front) / parseFloat(back) * circ;
//       console.log("factor:" + factor);
//       // create speedData
//       for (i=0; i<bikeData.length; i++) {
//         speedData[i].small = bikeData[i].gearRatios[0] * factor;
//         speedData[i].big = bikeData[i].gearRatios.slice(-1)[0] * factor;
//       }
//       // update alert DEBUG
//       var msg = "Wheel size: " + wheelSize + " front " + front + " back " + back;
//       console.log(msg);
//     }
//   }
//
//   return {
//     update: updateData,
//     speedData: speedData,
//     bikeNames: bikeNames
//   }
// })();


var plotModule = (function(){

  // layout constants
  const HEIGHT = 250; // xx bars AAAAARgh, flexibel maken?
  const WIDTH = 600;
  const MARGIN = 20;
  const LEFT_MARGIN = 90;
  const MAX_SPEED = 40;
  // input dependent layout constants
  var catLength = 5;
  // make categories constant to simplify temporary
  const BAR_MARGIN = HEIGHT / catLength / 5;
  const BAR_HEIGHT = HEIGHT / catLength - BAR_MARGIN;

  // define axes unitlities
  var xScale = d3.scale.linear().domain([0, MAX_SPEED]).range([0, WIDTH]);
  var yScale = d3.scale.linear().domain([0, catLength]).range([0, HEIGHT]);
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  //var yAxis = d3.svg.axis().scale(yScale).orient("left");

  // color scale
  var colors = ["steelblue", "yellowgreen", "coral", "seagreen", "indianred"];
  var plotCount = 1;

  function addPlot(data){
    // make plot unique
    var plotID = "plot" + plotCount;
    plotCount++;
    console.log("addPlot:plotCount: " + plotCount);

    // Setup canvas
    var svg = d3.select(".chart").append("svg")
              .attr("id", plotID)
              .attr("width", WIDTH + LEFT_MARGIN + MARGIN) // WIDTH + LEFT_MARGIN + MARGIN
              .attr("height", HEIGHT + 2*MARGIN);

      //var grid = d3.range(0, MAX_SPEED + 5, 5);

      // var gridLines = $canvas.append('g')
      //           .attr('id','grid')
      //           .attr('transform',"translate(" + LEFT_MARGIN + ", " + MARGIN + ")")
      //           .selectAll('line')
      //           .data(grid)
      //           .enter()
      //           .append('line')
      //           .attr({'x1': function(d){ return xScale(d); },
      //              'y1': 0,
      //              'x2': function(d){ return xScale(d); },
      //              'y2': HEIGHT,
      //           })
      //           .style({'stroke':'#adadad','stroke-width':'1px'});

    svg.append("g")
    .attr("transform", "translate(" + LEFT_MARGIN + "," + MARGIN + ")")
    .selectAll("g").data(data).enter().append("g")
        .attr("transform", function(d, i) {
          var xPos = xScale(d.small);
          var yPos = i * (BAR_HEIGHT + BAR_MARGIN);
          return "translate(" + xPos + "," + yPos + ")";
        })
        .append("rect")
        .attr("width", function(d) {return xScale(d.big - d.small);})
        .attr("height", BAR_HEIGHT)
        .attr("fill", function(d, i) {return colors[i];});

    // add x axes and labels
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + LEFT_MARGIN + "," + (MARGIN + HEIGHT) + ")")
      .call(xAxis);

    svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", MARGIN)
        .attr("y", function(d, i) {return yScale(i) + BAR_HEIGHT;})
        .text(function(d) {return d.name;});
  }

  function updatePlot(data, plotID) {
    var svg = d3.select("#" + plotID);
    var bars = svg.select("g").selectAll("g").data(data);
      
    // update already existing bars
    bars.attr("transform", function(d, i) {
        var xPos = xScale(d.small);
        var yPos = i * (BAR_HEIGHT + BAR_MARGIN);
        return "translate(" + xPos + "," + yPos + ")";
    });
    bars.select("rect")
    .attr("width", function(d) {return xScale(d.big - d.small);})
    .attr("height", BAR_HEIGHT)
    .attr("fill", function(d, i) {return colors[i];});
      
    // new bars, add g element
    bars.enter()
          .append("g")
          .attr("transform", function(d, i) {
            var xPos = xScale(d.small);
            var yPos = i * (BAR_HEIGHT + BAR_MARGIN);
            return "translate(" + xPos + "," + yPos + ")";
          })
          .append("rect")
          .attr("width", function(d) {return xScale(d.big - d.small);})
          .attr("height", BAR_HEIGHT)
          .attr("fill", function(d, i) {return colors[i];});
      
    // remove no longer important bars
    bars.exit().remove();
      
    // Update x and y axis
    svg.select(".x .axis").call(xAxis);
      
    yScale.domain([0,data.length]);

    var labels = svg.select(".labels").selectAll("text").data(data);
    labels
        .attr("x", MARGIN)
        .attr("y", function(d, i) {return yScale(i) + BAR_HEIGHT;})
        .text(function(d) {return d.name;});
    labels.enter()
        .append("text")
        .attr("x", MARGIN)
        .attr("y", function(d, i) {return yScale(i) + BAR_HEIGHT;})
        .text(function(d) {return d.name;});
    labels.exit().remove();
  }

  function getCount() {
    return plotCount;
  }
  // reveale public functions
  return {
    add: addPlot,
    getCount: getCount,
    update: updatePlot
  }
})();
