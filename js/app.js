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

    findTracks('darkstep');
    findTracks('dnb');
    findTracks('funkstep');
    findTracks('hardstep');
    findTracks('liquid funk');
    findTracks('neurofunk');
    findTracks('techstep');

    findTracks('brostep');
    findTracks('chillstep');
    findTracks('drumstep');
    findTracks('dubstep');
    findTracks('lovestep');
    findTracks('melodic dubstep');
    findTracks('ragestep');

    findTracks('chillwave');
    findTracks('dubtronica');
    findTracks('electronic');
    findTracks('electronica');
    findTracks('folktronica');
    findTracks('funktronica');

    findTracks('complextro');
    findTracks('deep house');
    findTracks('dutch house');
    findTracks('house');
    findTracks('progressive house');
    findTracks('tech house');

    findTracks('acid techno');
    findTracks('dub techno');
    findTracks('hard techno');
    findTracks('minimal techno');
    findTracks('nortec');
    findTracks('schranz');

    findTracks('trap');
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

    $('#next').click(function(){
      var trackTitle = playingTrack["title"];
      var trackArtwork = playingTrack["artwork_url"];
      playedTracks.unshift(playingTrack);
      $("#past-tracks-carousel").prepend("<div class='past-track'><p></p></div>");
      if (trackArtwork !== null) {
        $("#past-tracks-carousel").children().eq(0).css('background', "url(" + trackArtwork + ")");
      }
      $("#past-tracks-carousel").children().eq(0).find('p').text(trackTitle);

      var genre = $('.sub-genres div.active').text();
      embedTrack(genre);
    });

    $('#past-tracks').click(function(){
      $("#past-tracks-carousel").slideToggle('slow');
    });

    $('#past-tracks-carousel').on('click',"div", function(){
      var listPastTracks = document.getElementsByClassName('past-track');
      var indexNumber = $(this).index() + 1;

      var trackTitle = playingTrack["title"];
      var trackArtwork = playingTrack["artwork_url"];
      playedTracks.unshift(playingTrack);
      $("#past-tracks-carousel").prepend("<div class='past-track'><p></p></div>");
      if (trackArtwork !== null) {
        $("#past-tracks-carousel").children().eq(0).css('background', "url(" + trackArtwork + ")");
      }
      $("#past-tracks-carousel").children().eq(0).find('p').text(trackTitle);
      embedSpecificTrack(playedTracks[indexNumber]);
    });

    function embedSpecificTrack(track) {
      SC.oEmbed(track.uri, {auto_play: true, color: "#D1DBDD"}, document.getElementById('player'));
      playingTrack = track;
      setTimeout(autoNext, 4000);
    }
  }
});

