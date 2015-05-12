require.config({
  baseDir: 'app',
  shim : {
    bootstrap : {
      deps : ['jquery']
    }
  },
  paths: {
    jquery: 'vendor/jquery/dist/jquery',
    bootstrap: 'vendor/bootstrap/dist/js/bootstrap',
    handlebars: 'vendor/handlebars/handlebars',
    text: 'vendor/text/text'
  }
});

require(['jquery', 'bootstrap', './questions', 'text!templates/question-group.hbs', 'handlebars'], function($, bootstrap, questionGroups, tmpl, Handlebars){
  $('header h1').html('Single Page Applications');
  var template = Handlebars.compile(tmpl);
  questionGroups.forEach(function(question) {
    $('#questions').append(template(question));
  });
})
