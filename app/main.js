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
require(['jquery', 'bootstrap', 'handlebars', 'text!templates/fwk-params.hbs', 'text!templates/fwk-table.hbs'], function($, bootstrap, Handlebars, fwkParamsTemplate, fwkTableTemplate){
  $('header h1').html('Single Page Applications');
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
  d3.csv('app/csv/fwk-params.csv')
    .get(function(err, rows) {
      if ( err ) throw err;
      var model = processRows(rows);
      updateModel();
      console.log(model);
      console.log(tableModel());
      $('#table').html(tableTemplate(tableModel()));
      var paramGroup = $('#param-groups');
      model.forEach(function(row) {
        paramGroup.append(template(row));
      });
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
          group.total = (s/n).toFixed(2);
        });
      }
      function tableModel() {
        var header = ['Parameter'].concat(fwkKeys.map(function(fwk) { return fwkLabels[fwk]; }));
        var rows = model.map(function(group) {
          return [group.name].concat(fwkKeys.map(function(fwk) { return group[fwk]; }));
        });
        return {
          header: header,
          rows: rows
        };
      }
      $('.weight').on('change', function(){
        var id = this.id, val = this.value;
        /*
        $('#w-' + id + ' span.pull-right').html(val);
        var panel = $(this).closest('.panel');
        var n = 0, s = 0;
        panel.find('input').each(function(i, v) {
          if ( v.value !== '0' ) {
            n++;
            s += parseFloat(v.value);
          }
        });
        panel.find('.badge').html((s/n).toFixed(2));
        */
        updateModel(this.dataset['group'], id, val);
        console.log(model);
        $('#table').html(tableTemplate(tableModel()));
        $('#table').html(tableTemplate(tableModel()));
        var paramGroup = $('#param-groups');
        $('#param-groups').empty();
        model.forEach(function(row) {
          paramGroup.append(template(row));
        });
      });
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
})
