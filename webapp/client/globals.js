// Template.registerHelper("horizontalLabelClass", function () {
//   return "col-md-3 col-sm-4 col-xs-6";
// });
//
// Template.registerHelper("horizontalInputColClass", function () {
//   return "col-md-9 col-sm-8 col-xs-6";
// });

filteredContacts = function () {
  return Contacts.find({
    notifications_active: true,
  });
};
