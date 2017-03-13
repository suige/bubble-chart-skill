(function() {
  var logo = "M27.08,43c0.34-1.57,1.23-3.45,2.76-3.33a2.72,2.72,0,0,1,1.73,1.07C35,44.7,33.09,51,34.28,56.25a3.23,3.23,0,0,0,1,1.89,3.35,3.35,0,0,0,2.06.49L64.4,59a41.52,41.52,0,0,1,1.18-14.73,5.13,5.13,0,0,1,1-2.18c1.17-1.29,3.36-1,4.59.26A8,8,0,0,1,73,47.22a22.06,22.06,0,0,1-2.46,12.65,39.8,39.8,0,0,1,23,18.22,43.25,43.25,0,0,1,4.87,29.82A73.81,73.81,0,0,1,93,123.54c-1.26,2.8-2.63,5.66-4.93,7.6s-5.12,2.7-7.92,3.38c-19.66,4.79-40.77,5.78-59.63-1.76-3.88-1.55-7.74-3.53-10.56-6.73a27.53,27.53,0,0,1-4.56-7.92A64.26,64.26,0,0,1,.66,94.75c-0.08-6.77,1-13.81,4.7-19.36a43.65,43.65,0,0,1,6.32-7c3.84-3.69,7.93-7.55,13.08-9,1.64-.46,1.87,0,2.06-1.67,0.16-1.41-.48-3.31-0.56-4.76A37.41,37.41,0,0,1,27.08,43Z";
  var height = 600;
  var width = 1000;

  function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
  }

// d3.select("#viz").append("svg")
//     .attr("width", 960)
//     .attr("height", 500)
//     .call(responsivefy);

  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(0,0)")

  var defs = svg.append("defs");
  defs.append("pattern")
    .attr("id", "logo")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("svg")
    .attr("viewBox", "0 0 98.62 98.62")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRation", "none")
    .append("path")
    .attr("d", logo)
    .attr("transform", function(d) { return "translate(-0.66 -39.65)"; });

  var radiusScale = d3.scaleSqrt().domain([0, 100]).range([10, 60])

  //the simulation is a collentio of forces
  //about where we want our circles to go
  //and how we want our circles to interact
  //STEP ONE: get them to the middle
  //STEP TWO: don't have them collide

  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force("collide", d3.forceCollide(function(d) {
      return radiusScale(d.parcent) + 1;
    }))

  d3.queue()
    .defer(d3.csv, "webskills.csv")
    .await(ready)

  function ready (error, datapoints) {
    var circles = svg.selectAll(".skill")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "skill")
      .attr("r", function(d) {
        return radiusScale(d.parcent);
      })
      .attr("fill", function(d) {
        return "url(#logo)"
      })
      .on('click', function(d) {
        console.log(d);
      })


    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }

  }

})();