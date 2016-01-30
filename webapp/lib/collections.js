// https://github.com/aldeed/meteor-collection2#autovalue
function dateCreatedAutoValue () {
  if (this.isInsert) {
    return new Date();
  } else if (this.isUpsert) {
    return { $setOnInsert: new Date() };
  } else {
    this.unset();  // Prevent user from supplying their own value
  }
}

function dateModifiedAutoValue () {
  if (this.isUpdate) {
    return new Date();
  }
}

function lengthOfArray (fieldName) {
  var array = this.field(fieldName).value;
  console.log("array:", array);
  if (array) {
    return array.length;
  } else {
    this.unset();
  }
}

Messages = new Meteor.Collection("messages");
Messages.attachSchema(new SimpleSchema({
  english_message: { type: String },
  spanish_message: { type: String },

  date_created: { type: Date, autoValue: dateCreatedAutoValue },

  status: {
    type: String,
    defaultValue: "sending",
    allowedValues: [
      "sending",
      "sent",
      "failed"
    ],
  },

  sent_contacts: { type: [Meteor.ObjectID], optional: true },
  sent_contacts_count: {
    type: Number,
    autoValue: _.partial(lengthOfArray, "sent_contacts"),
    optional: true,
  },
  failed_contacts: { type: [Meteor.ObjectID], optional: true },
  failed_contacts_count: {
    type: Number,
    autoValue: _.partial(lengthOfArray, "failed_contacts"),
    optional: true,
  },
}));

Contacts = new Meteor.Collection("contacts");
Contacts.attachSchema(new SimpleSchema({
  date_created: { type: Date, autoValue: dateCreatedAutoValue, optional: true },
  date_modified: { type: Date, autoValue: dateModifiedAutoValue, optional: true },

  first_name: { type: String },
  last_name: { type: String },
  phone_number: { type: Number },
  preferred_language: {
    type: String,
    allowedValues: [
      "english",
      "spanish",
    ]
  },
}));
