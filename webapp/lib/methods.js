Meteor.methods({
  removeGroup: function (groupId) {
    var name = Groups.findOne(groupId).name;

    Contacts.update({}, {
      $pull: {
        groups: name
      }
    }, { multi: true });

    Groups.remove(groupId);
  }
});
