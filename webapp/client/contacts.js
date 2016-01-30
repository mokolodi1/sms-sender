// Template.contacts

Template.contacts.helpers({
  Contacts,
  getContacts: function () {
    return Contacts.find({});
  },
});

// Template.showContact

Template.showContact.helpers({
  listGroupItemClass: function () {
    if (this.notifications_active) {
      return "";
    }
    return "list-group-item-danger";
  },
});

Template.showContact.events({
  "click .notifications-toggle": function (event, instance) {
    // !!! means the opposite but boolean
    Contacts.update(instance.data._id, {
      $set: {
        notifications_active: !!!instance.data.notifications_active
      }
    });
  },
});
