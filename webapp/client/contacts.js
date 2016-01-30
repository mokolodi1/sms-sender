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
});

Template.showContact.helpers({
  listGroupItemClass: function () {
    if (this.notifications_active) {
      return "";
    }
    return "list-group-item-danger";
  },
  editing: function () {
    return Template.instance().editing.get();
  },
});

Template.showContact.events({
  "click .toggle-editing": function (event, instance) {
    var editing = Template.instance().editing;

    editing.set(!editing.get());
  },
  "click .notifications-toggle": function (event, instance) {
    // !!! means the opposite but boolean
    Contacts.update(instance.data._id, {
      $set: {
        notifications_active: !!!instance.data.notifications_active
      }
    });
  },
  "click .remove-contact": function (event, instance) {
    Contacts.remove(instance.data._id);
  },
});
