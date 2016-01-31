// Template.contacts

Template.contacts.helpers({
  Contacts,
  getContacts: function () {
    return Contacts.find({}, {
      sort: { date_created: -1 }
    });
  },
});

// Template.showContact

Template.showContact.onCreated(function () {
  var instance = this;

  instance.editing = new ReactiveVar(false);
  instance.deleteClicked = new ReactiveVar(false);
  instance.errorsEditing = new ReactiveVar(false);

  var hooksObject = {};
  hooksObject[instance.data._id] = {
    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {
      instance.errorsEditing.set(false);
    },
    // Called when any submit operation fails
    onError: function(formType, error) {
      instance.errorsEditing.set(true);
    },
  };

  AutoForm.hooks(hooksObject);
});

Template.showContact.helpers({
  listGroupItemClass: function () {
    if (this.notifications_active) {
      return "";
    }
    return "list-group-item-danger";
  },
  getDoc: function () {
    return Template.currentData();
  },
  Contacts,

  // ReactiveVars
  editing: function () {
    return Template.instance().editing.get();
  },
  deleteClicked: function () {
    return Template.instance().deleteClicked.get();
  },
  errorsEditing: function () {
    return Template.instance().errorsEditing.get();
  },
  getGroups: function () {
    return Groups.find({});
  },
  getNewGroups: function () {
    return _.difference(_.pluck(Groups.find().fetch(), "name"),
        this.groups);
  },
});

Template.showContact.events({
  "click .toggle-editing": function (event, instance) {
    var editing = Template.instance().editing;

    editing.set(!editing.get());
    if (editing.get()) {
      Template.instance().errorsEditing.set(false);
      // so that the autoform has already shown up
      Meteor.defer(function () {
        AutoForm.validateForm(instance.data._id);
      });
    }
  },
  "click .notifications-toggle": function (event, instance) {
    // !!! means the opposite but boolean
    Contacts.update(instance.data._id, {
      $set: {
        notifications_active: !instance.data.notifications_active
      }
    });
  },
  "click .remove-contact": function (event, instance) {
    var deleteClicked = instance.deleteClicked;
    if (deleteClicked.get()) {
      Contacts.remove(instance.data._id);
    } else {
      deleteClicked.set(true);

      // wait until propogation finishes before registering event
      Meteor.defer(function () {
        $("html").one("click",function() {
          deleteClicked.set(false);
        });
      });
    }
  },
  "click .add-new-group": function (event, instance) {
    Contacts.update(instance.data._id, {
      $addToSet: {
        groups: instance.$("select.new-group")[0].value
      }
    });
  },
  "click .remove-group": function (event, instance) {
    console.log("event.target.dataset.value:", event.target.dataset.value);
    console.log("event:", event);
    console.log("instance.data._id:", instance.data._id);
    Contacts.update(instance.data._id, {
      $pull: {
        groups: event.target.dataset.value
      }
    });
  },
});
