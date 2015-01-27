App = Ember.Application.create();

App.Router.map(function() {
  this.route("tourdates");
  this.resource("genres", function() {
    this.resource("genre", { path: "/:genre_id"});
  });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});
