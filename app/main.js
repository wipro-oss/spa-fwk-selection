require.config({
  baseDir: 'app',
  shim : {
    bootstrap : {
      deps : ['jquery']
    }
  },
  paths: {
    jquery: 'vendor/jquery/dist/jquery',
    bootstrap: 'vendor/bootstrap/dist/js/bootstrap'
  }
});

require(['jquery', 'bootstrap'], function($, bootstrap){
  $('header h1').html('Single Page Applications');
})
