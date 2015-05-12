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
  var nameToId = function(name) {
    return name.replace(/\W+/g, '-').toLowerCase();
  };
  var qId = 0;
  questionGroups.forEach(function(question) {
    question.id = nameToId(question.name);
    question.children.forEach(function(child) {
      child.id = nameToId(child.name);
      if ( child.questions != undefined ) {
        child.questions.forEach(function(q) {
          q.id = 'q-' + qId++;
        });
      }
    });
    $('#questions').append(template(question));
  });
  $('[data-toggle="popover"]').popover({html: true, container: 'body'})
})
