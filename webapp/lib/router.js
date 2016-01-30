FlowRouter.notFound = {
  action: function () {
    BlazeLayout.render("appLayout", {content: "pageNotFound"});
  }
};

FlowRouter.route("/", {
  name: "home",
  action: function() {
    FlowRouter.go("messages");
  }
});

FlowRouter.route("/messages", {
  name: "messages",
  action: function() {
    BlazeLayout.render("appLayout", {content: "messages"});
  }
});

FlowRouter.route("/contacts", {
  name: "contacts",
  action: function() {
    BlazeLayout.render("appLayout", {content: "contacts"});
  }
});

FlowRouter.route("/tags", {
  name: "tags",
  action: function() {
    BlazeLayout.render("appLayout", {content: "tags"});
  }
});
