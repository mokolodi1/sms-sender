Template.messages.onCreated(function () {
  var instance = this;

  // instance.subscribe("messages");
});

Template.messages.helpers({
  getMessages: function () {
    return Messages.find({}, {
      sort: {
        "date_created": -1
      }
    });
  },
  fromNow: function () {
    return moment(this.date_created).fromNow();
  },
  Messages: Messages,
  allContacts: function () {
    return Contacts.find({});
  },
  filteredContacts: function () {
    return filteredContacts(AutoForm.getFieldValue("group", "insertMessage"));
  },
  listGroupItemClass: function () {
    if (this.status === "sent") {
      return "list-group-item-success";
    } else {
      return "list-group-item-info";
    }
  },
  groupOptions: function () {
    return Groups.find({}).map(function (group) {
      return {
        label: group.name,
        value: group.name,
      };
    });
  },
});

AutoForm.hooks({
  insertMessage: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var newId = Messages.insert(_.extend(insertDoc, {
        status: "sending",
      }));

      Meteor.call("sendMessages", newId, _.noop);

      this.done();
      return false;
    }
  }
});
