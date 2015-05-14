require.config({
  baseDir: 'app',
  shim : {
    bootstrap : {
      deps : ['jquery']
    },
    'radar-chart': {
      deps: ['d3'],
      exports: 'RadarChart'
    }
  },
  paths: {
    jquery: 'vendor/jquery/dist/jquery',
    bootstrap: 'vendor/bootstrap/dist/js/bootstrap',
    handlebars: 'vendor/handlebars/handlebars',
    text: 'vendor/text/text',
    d3: 'vendor/d3/d3',
    'radar-chart': 'vendor/radar-chart-d3/src/radar-chart'
  }
});

require(['jquery', 'bootstrap', 'd3', 'radar-chart', 'handlebars', 'text!templates/fwk-params.hbs', 'text!templates/fwk-table.hbs'], function($, bootstrap, d3, RadarChart, Handlebars, fwkParamsTemplate, fwkTableTemplate) {
  var s = 400, w = s, h = s;
  var colorscale = d3.scale.category10();
  var fwkKeys = [
    'angular-js',
    'backbone-js',
    'ember-js',
    'knockout-js',
    'meteor-js',
    'ext-js'
  ];
  var fwkLabels = {
    'angular-js'  : 'AngularJs',
    'backbone-js' : 'BackboneJs',
    'ember-js'    : 'EmberJs',
    'knockout-js' : 'KnockoutJs',
    'meteor-js'   : 'Meteor',
    'ext-js'      : 'ExtJs'
  };
  var gidMap = {};
  var pidMap = {};
  var template = Handlebars.compile(fwkParamsTemplate);
  var tableTemplate = Handlebars.compile(fwkTableTemplate)
  var nameToId = function(name) {
    return name.replace(/\W+/g, '-').toLowerCase();
  };
  var qId = 0;

  //Legend titles
  var LegendOptions = fwkKeys.map(function(fwk) { return fwkLabels[fwk]; });

  function drawLegend() {
    var svg = d3.select('#radar-chart')
        .selectAll('svg')
        .append('svg')
        .attr("width", w+300)
        .attr("height", h)

    //Create the title for the legend
    var text = svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,0)')
        .attr("x", w - 70)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#404040")
        .text("SPA Frameworks");

    //Initiate Legend
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)')
    ;
    //Create colour squares
    legend.selectAll('rect')
      .data(LegendOptions)
      .enter()
      .append("rect")
      .attr("x", w - 65)
      .attr("y", function(d, i){ return i * 20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i){ return colorscale(i);})
    ;
    //Create text next to squares
    legend.selectAll('a')
      .data(LegendOptions)
      .enter()
      .append('a')
      .attr("id", function(d, i) { return 'l-' + fwkKeys[i] })
      .attr("xlink:href", '#')
      .on('click', function(e) {
        //debugger;
        var id = this.id.replace(/l-/, '');
        var poly = d3.select('#p-' + id);
        var cls = poly.attr('class').replace(/^.*(radar-chart-serie\d+).*$/, '.$1');
        var val = poly.style('visibility') === 'visible' ? 'hidden' : 'visible';
        d3.selectAll(cls).style('visibility', val);
        d3.select(this).style('text-decoration', val == 'visible' ? 'none' : 'line-through');
      })
      .append("text")
      .attr("x", w - 52)
      .attr("y", function(d, i){ return i * 20 + 9;})
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text(function(d) { return d; });
  }
  function drawRadarChart(data) {
    //Options for the Radar chart, other than default
    var radarCfg = {
      w: w,
      h: h,
      maxValue: 1,
      levels: 10,
      ExtraWidthX: 300
    }
    //Call function to draw the Radar chart
    //Will expect that data is in %'s
    RadarChart.draw("#radar-chart", data, radarCfg);
    drawLegend();
    var svg = d3.select('#radar-chart')
        .select('svg').attr('width', w+300);

    d3.selectAll('svg polygon')[0].forEach(function(polygon, i) {
      polygon.id = 'p-' + fwkKeys[i];
    });
  }
  d3.csv('app/csv/fwk-params.csv')
    .get(function(err, rows) {
      if ( err ) throw err;
      var model = processRows(rows);
      handleChange();
      function handleChange() {
        if ( this.dataset == undefined  ) {
          updateModel()
        } else {
          var id = this.id, val = this.value;
          updateModel(this.dataset['group'], id, val);
        }
        console.log(model);
        $('#table').html(tableTemplate(tableModel()));
        $('#table').html(tableTemplate(tableModel()));
        var paramGroup = $('#param-groups');
        $('#param-groups').empty();
        model.forEach(function(row) {
          paramGroup.append(template(row));
        });
        showRadarChart();
        $('#bubble-chart').empty();
        drawBubbleChart(toBubbleModel(100));
        //$('#linear-bubble-chart').empty();
        //drawLinearBubbleChart(toBubbleModel(100));
        $('#grouped-bar-chart').empty();
        drawGroupedBarChart();
        $('.weight').on('change', handleChange);
      }
      function updateModel(gid, id, val) {
        model.forEach(function(group) {
          if ( gid === group.id ) {
            group.children.forEach(function(param) {
              if ( id === param.id ) {
                param.weight = parseFloat(val);
              }
            });
          }
          var n = 0, s = 0;
          fwkKeys.forEach(function(fwk) {
            group[fwk] = 0;
          });
          group.children.forEach(function(param) {
            if ( param.weight != 0 ) {
              n++;
              s += param.weight;
            }
            var pvMap = group.parameters[param.id];
            fwkKeys.forEach(function(fwk) {
              group[fwk] = group[fwk] || 0;
              group[fwk] += (param.weight * pvMap[fwk]);
            })
          });
          // convert to percentage
          fwkKeys.forEach(function(fwk) {
            group[fwk] = (group[fwk] / (n * 10)).toFixed(2);
          })
          group.total = (s/n).toFixed(2);
        });
      }
      function tableModel() {
        var header = ['Parameter'].concat(fwkKeys.map(function(fwk) { return fwkLabels[fwk]; }));
        var rows = model.map(function(group) {
          var values = fwkKeys.map(function(fwk) { return group[fwk]; });
          var max = Math.max.apply(null, values);
          return [group.name].concat(values.map(function(v) { return v == max ? '<strong>' + v + '</strong>' : v }));
        });
        return {
          header: header,
          rows: rows
        };
      }
      function showRadarChart() {
        // data
        var fwks = {
          'angular-js': [],
          'backbone-js': [],
          'ember-js': [],
          'knockout-js': [],
          'meteor-js': [],
          'ext-js': []
        };
        model.forEach(function(group) {
          fwkKeys.forEach(function(fwk) {
            fwks[fwk].push({axis: group.name, value: group[fwk] });
          })
        });
        var radarData = fwkKeys.map(function(fwk) {
          return fwks[fwk];
        });
        drawRadarChart(radarData);
      }
      function toBubbleModel(scale) {
        var fwkMap = {};
        fwkKeys.forEach(function(fwk) {
          fwkMap[fwk] = { name: fwkLabels[fwk], children: [] };
        });
        model.forEach(function(group) {
          fwkKeys.forEach(function(fwk) {
            var size = scale * group[fwk];
            fwkMap[fwk].children.push({ name: group.name, size: size });
          });
        });
        return {
          name: "Frameworks",
          children: fwkKeys.map(function(fwk) { return fwkMap[fwk]; })
        };
      }
      function drawBubbleChart(root) {
        var margin = 20,
            diameter = 400;

        var color = d3.scale.linear()
            .domain([-1, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        var leafColor = d3.scale.category10();

        var pack = d3.layout.pack()
            .padding(2)
            .size([diameter - margin, diameter - margin])
            .value(function(d) { return d.size; })

        var svg = d3.select("#bubble-chart").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

        var focus = root,
            nodes = pack.nodes(root),
            view;
        var leaf = {
          "Application Needs": 0,
          "Client/User Environment": 1,
          "Developer Support": 2,
          "Server Environment": 3,
          "User Interface": 4
        }
        var circle = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .style("fill", function(d) { return d.children ? color(d.depth) : leafColor(leaf[d.name]); })
            .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

        var text = svg.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            .style("display", function(d) { return d.parent === root ? null : "none"; })
            .text(function(d) { return d.size ? d.name + ' (' + d.size + ')' : d.name ; });

        var node = svg.selectAll("circle,text");

        d3.select("#bubble-chart")
          .on("click", function() { zoom(root); });

        zoomTo([root.x, root.y, root.r * 2 + margin]);

        function zoom(d) {
          var focus0 = focus; focus = d;

          var transition = d3.transition()
              .duration(d3.event.altKey ? 7500 : 750)
              .tween("zoom", function(d) {
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                return function(t) { zoomTo(i(t)); };
              });

          transition.selectAll("#bubble-chart text")
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
              .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }

        function zoomTo(v) {
          var k = diameter / v[2]; view = v;
          node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
          circle.attr("r", function(d) { return d.r * k; });
        }
      }
      function drawLinearBubbleChart(root) {
        // from http://neuralengr.com/asifr/journals/journals_optogenetic.html
        var margin = {top: 20, right: 200, bottom: 0, left: 20},
            width = 300,
            height = 400;

        var start_year = 1,
            end_year = 5;

        var c = d3.scale.category20c();

        var x = d3.scale.linear()
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        var formatYears = d3.format("0000");
        //xAxis.tickFormat(formatYears);
        xAxis.tickValues(fwkKeys.map(function(fwk) { return fwkLabels[fwk]; }));

        var svg = d3.select("#linear-bubble-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-left", margin.left + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // var dataset = [[ [2002, 8], [2003, 1], [2004, 1], [2005, 1], [2006, 3], [2007, 3], [2009, 3], [2013, 3]], [ [2004, 5], [2005, 1], [2006, 2], [2010, 20], [2011, 3] ] ,[ [2001, 5], [2005, 15], [2006, 2], [2010, 20], [2012, 25] ]];
        // var dataset = [ [2001, 5], [2005, 15], [2006, 2], [2010, 20], [2012, 25] ];

        x.domain([start_year, end_year]);
        var xScale = d3.scale.linear()
            .domain(fwkKeys.map(function(fwk) { return fwkLabels[fwk]; }))
            .range([0, width]);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + 0 + ")")
          .call(xAxis);
        data = [];
        for (var j = 0; j < data.length; j++) {
          var g = svg.append("g").attr("class","journal");

          var circles = g.selectAll("circle")
              .data(data[j]['articles'])
              .enter()
              .append("circle");

          var text = g.selectAll("text")
              .data(data[j]['articles'])
              .enter()
              .append("text");

          var rScale = d3.scale.linear()
              .domain([0, d3.max(data[j]['articles'], function(d) { return d[1]; })])
              .range([2, 9]);

          circles
            .attr("cx", function(d, i) { return xScale(d[0]); })
            .attr("cy", j*20+20)
            .attr("r", function(d) { return rScale(d[1]); })
            .style("fill", function(d) { return c(j); });

          text
            .attr("y", j*20+25)
            .attr("x",function(d, i) { return xScale(d[0])-5; })
            .attr("class","value")
            .text(function(d){ return d[1]; })
            .style("fill", function(d) { return c(j); })
            .style("display","none");

          g.append("text")
            .attr("y", j*20+25)
            .attr("x",width+20)
            .attr("class","label")
            .text(truncate(data[j]['name'],30,"..."))
            .style("fill", function(d) { return c(j); })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
        };

        function mouseover(p) {
          var g = d3.select(this).node().parentNode;
          d3.select(g).selectAll("circle").style("display","none");
          d3.select(g).selectAll("text.value").style("display","block");
        }

        function mouseout(p) {
          var g = d3.select(this).node().parentNode;
          d3.select(g).selectAll("circle").style("display","block");
          d3.select(g).selectAll("text.value").style("display","none");
        }
      }
      function toGroupedBarModel(scale) {
        var fwkMap = {};
        fwkKeys.forEach(function(fwk) {
          fwkMap[fwk] = {"Framework": fwkLabels[fwk]};
        });
        model.forEach(function(group) {
          fwkKeys.forEach(function(fwk) {
            var size = scale * group[fwk];
            fwkMap[fwk][group.name] = size;
          });
        });

        return fwkKeys.map(function(fwk) { return fwkMap[fwk]; });
      }
      function drawGroupedBarChart(root) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 500 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();
        //d3.scale.ordinal()
        //    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var svg = d3.select("#grouped-bar-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data = toGroupedBarModel(100);
        var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Framework"; });

        data.forEach(function(d) {
          d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x0.domain(data.map(function(d) { return d.Framework; }));
        x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Score");

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.Framework) + ",0)"; });

        state.selectAll("rect")
          .data(function(d) { return d.ages; })
          .enter().append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
            .data(ageNames.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

        legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });
      }
    });
  function processRows(rows) {
    var m = {}, t = {}, wm = wm = {};
    var ro = [];
    rows.forEach(function(row) {
      ro.push(row.group);
      var a = m[row.group] || [];
      var ti = t[row.group] || { n: 0, s: 0};
      row.id = nameToId(row.parameter);
      pidMap[row.id] = row.parameter;
      a.push({ id: row.id, parameter: row.parameter, group: row.group, weight: parseFloat(row.weight) });
      m[row.group] = a;
      if ( row.weight != '0' ) {
        ti.n++;
        ti.s += parseFloat(row.weight);
      }
      t[row.group] = ti;
      var gid = nameToId(row.group);
      gidMap[gid] = row.group;
      var wi = wm[gid] || {};
      wi[row.id] = {};
      fwkKeys.forEach(function(fwk) {
        var v = '' == row[fwk] ? 0 : parseFloat(row[fwk]);
        wi[row.id][fwk] = v == NaN ? 0 : v;
      });
      wm[gid] = wi;
    });
    ro = ro.sort().filter(function(g, i, a) { return i == 0 ? true : a[i-1] != g; });
    return ro.map(function(g) {
      var gid = nameToId(g);
      return {
        id: gid,
        name: g,
        total: (t[g].s / t[g].n).toFixed(2),
        parameters: wm[gid],
        children: m[g]
      };
    });
  }
  function truncate(str, maxLength, suffix) {
    if(str.length > maxLength) {
      str = str.substring(0, maxLength + 1);
      str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
      str = str + suffix;
    }
    return str;
  }

})
