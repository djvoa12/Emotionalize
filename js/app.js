App = Ember.Application.create();

App.Router.map(function() {
  this.route("discover");
  this.route("feelit");
});

var playlist = {};
var playedTracks = [];
var playingTrack;

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
  }
});

