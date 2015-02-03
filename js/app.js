App = Ember.Application.create();

App.Router.map(function() {
  this.route("discover");
  this.route("feelit");
});

var playlist = {};
var playedTracks = [];
var playingTrack;
var iframeElement;
var widget;

App.IndexView = Ember.View.extend({
  templateName: 'index',
  didInsertElement : function(){
    $('#slick').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false
    });

    $('#note-pad').click(function(){
      $('#note').get().hideFocus = true;
      $('#note').slideToggle('slow');
    });

    SC.initialize({
      client_id: '470675f330cce425f111481f1ed69b09'
    });

    function findTracks(genre) {
      SC.get('/tracks', {
        genres: genre,
        limit: 150
      }, function(tracks){
        playlist[genre] = tracks;
      });
    }

    findTracks('brostep');
    findTracks('chillstep');
    findTracks('drumstep');
    findTracks('dubstep');
    findTracks('lovestep');
    findTracks('melodic dubstep');
    findTracks('ragestep');

    findTracks('complextro');
    findTracks('deep house');
    findTracks('dutch house');
    findTracks('house');
    findTracks('progressive house');
    findTracks('tech house');
  }
});

App.DiscoverView = Ember.View.extend({
  templateName: 'discover',
  didInsertElement : function(){
    $("#carousel").smoothDivScroll({
      visibleHotSpotBackgrounds: "",
      manualContinuousScrolling: true
    });

    $('#carousel').hover(function(){
      $('#left-scroll').show();
      $('#right-scroll').show();
    },function() {
      $('#left-scroll').hide();
      $('#right-scroll').hide();
    });

    $('.genres').click(function(){
      $('#choose-genre').hide();
      $('.sub-genres').removeClass('active');
      var genre = $(this).data('genre');
      $(genre).addClass('active');
    });

    $('.sub-genres div').click(function(){
      var genre = $(this).text();
      $(this).addClass('active');

      $('#glass').hide();
      $('#player').toggleClass('active');
      $('#controls').show();
      embedTrack(genre);
    });

    $('#back').click(function(){
      $('.sub-genres div').removeClass('active');
      $('#player').empty();
      $('#player').toggleClass('active');
      $('#controls').hide();
      $('#glass').show();
    });
  }
});

