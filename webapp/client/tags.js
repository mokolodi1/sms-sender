Template.groups.helpers({
  Groups,
  getGroups: function () {
    return Groups.find({});
  },
});

// Template.showGroup

Template.showGroup.events({
  "click .remove-group": function (event, instance) {
    Meteor.call("removeGroup", instance.data._id);
  },
});
