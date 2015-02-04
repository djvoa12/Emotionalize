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
var request;
var requestEvents;
var artistInfo;
var upcomingShows;

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

    function embedTrack(genre) {
      var random = Math.floor(Math.random() * playlist[genre].length);
      SC.oEmbed(playlist[genre][random].uri, {auto_play: true, color: "#D1DBDD"}, document.getElementById('player'));
      playingTrack = playlist[genre].splice(random, 1)[0];
      setTimeout(autoNext, 4000);
    }

    function autoNext() {
      var iframeElement = document.querySelector('iframe');
      var widget = SC.Widget(iframeElement);

      widget.bind(SC.Widget.Events.FINISH, function(player, data) {
        $('#next').trigger("click");
      });
    }
  }
});

App.FeelitView = Ember.View.extend({
  templateName: 'feelit',
  didInsertElement : function(){

    function getTourInfoByArtist(artist) {
      request = $.ajax({
        url: "http://api.songkick.com/api/3.0/search/artists.json?query=" + artist +"&apikey=AeUCzqlFh26ZK4mL",
        type: "GET",
        dataType: 'json'
      });

      request.done(function(response1) {
        artistInfo = response1;
        if (response1["resultsPage"]["results"]["artist"] === undefined) {
          $('#upcoming-events').append("<p id='error'>Artist Not Found</p>");
        }
        else {
          var artistId = response1["resultsPage"]["results"]["artist"][0].id
          getUpcomingShows(artistId)
        }
      });
    }

    function getUpcomingShows(artistId) {
      requestEvents = $.ajax({
        url: "http://api.songkick.com/api/3.0/artists/" + artistId + "/calendar.json?apikey=AeUCzqlFh26ZK4mL",
        type: "GET",
        dataType: 'json'
      });

      requestEvents.done(function(response2) {
        upcomingShows = response2["resultsPage"]["results"]["event"];
        displayUpcomingShows(upcomingShows)
      });
    }

    function displayUpcomingShows(array) {
      array.forEach(function(upcomingEvent) {
        var eventName = upcomingEvent["displayName"];
        var eventType = upcomingEvent["type"];
        var location = upcomingEvent["location"]["city"];
        var date = upcomingEvent["start"]["date"];
        var time = upcomingEvent["start"]["time"];

        $('#upcoming-events').show();
        $('#upcoming-events').append("<hr><div class='upcoming-event'><p class='event-name'>" + eventName + "</p><p class='event-type'>" + eventType + "</p><p class='location'>Location: " + location + "</p><p class='date'>Date: " + date + "</p><p class='time'>Time: " + time + "</p></div>");
      });
    }

    $('#search-artist-button').click(function(e) {
      e.preventDefault();
      $('#upcoming-events').empty();
      var artist = $('#search-artist-input').val();
      getTourInfoByArtist(artist);
    });
  }
});
