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
    return filteredContacts();
  },
  listGroupItemClass: function () {
    if (this.status === "sent") {
      return "list-group-item-success";
    } else {
      return "list-group-item-info";
    }
  },
});

AutoForm.hooks({
  insertMessage: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var newId = Messages.insert(_.extend(insertDoc, {
        status: "sending",
      }));

      Meteor.call("sendMessages", newId, function (error, result) {
        console.log("error, result:", error, result);
        // if (error) {
        //   this.done(new Error("Couldn't send email"));
        //   return true;
        // }
        //
        // return false;
      });

      this.done();
      return false;
    }
  }
});
