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

require(['d3', 'radar-chart'], function(d3, RadarChart) {
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
  //Legend titles
  var LegendOptions = ['AngularJS','BackboneJS', 'EmberJS', 'KnockoutJS', 'Meteor', 'ExtJS'];

  d3.csv('app/csv/fwk-params.csv')
    .get(function(err, rows) {
      if ( err ) throw err;

      var fwks = {
        'angular-js': [],
        'backbone-js': [],
        'ember-js': [],
        'knockout-js': [],
        'meteor-js': [],
        'ext-js': []
      };
      rows.forEach(function(row) {
        fwkKeys.forEach(function(fwk) {
          fwks[fwk].push({axis: row.parameter, value: row[fwk] });
        })
      });
      var radarData = fwkKeys.map(function(fwk) {
        return fwks[fwk];
      });
      drawChart(radarData);
    });

  function drawLegend() {
    var svg = d3.select('#right')
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
  function drawChart(data) {
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
    RadarChart.draw("#right", data, radarCfg);
    drawLegend();
    var svg = d3.select('#right')
        .select('svg').attr('width', w+300);

    d3.selectAll('svg polygon')[0].forEach(function(polygon, i) {
      polygon.id = 'p-' + fwkKeys[i];
    });
  }
});
require(['jquery', 'bootstrap', 'handlebars', 'text!templates/fwk-params.hbs'], function($, bootstrap, Handlebars, fwkParamsTemplate){
  $('header h1').html('Single Page Applications');
  var template = Handlebars.compile(fwkParamsTemplate);
  var nameToId = function(name) {
    return name.replace(/\W+/g, '-').toLowerCase();
  };
  var qId = 0;
  console.log(d3);
  d3.csv('app/csv/fwk-params.csv')
    .get(function(err, rows) {
      if ( err ) throw err;
      var left = $('#left');
      processRows(rows).forEach(function(row) {
        left.append(template(row));
      });
      $('.weight').on('change', function(){
        var id = this.id, val = this.value;
        $('#w-' + id + ' span.pull-right').html(val);
      });
    });
  function processRows(rows) {
    var m = {};
    var ro = [];
    rows.forEach(function(row) {
      ro.push(row.group);
      var a = m[row.group] || [];
      row.id = nameToId(row.parameter);
      a.push(row);
      m[row.group] = a;
    });
    ro = ro.sort().filter(function(g, i, a) { return i == 0 ? true : a[i-1] != g; });
    return ro.map(function(g) {
      return {
        id: nameToId(g),
        name: g,
        children: m[g]
      };
    });
  }
})
