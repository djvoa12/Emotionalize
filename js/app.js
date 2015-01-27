App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});

App.Router.map(function() {
  this.route("upload");
  this.resource("flights", function() {
    this.resource("flight", { path: "/:flight_id"});
  });
});