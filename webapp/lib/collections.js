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


Messages = new Meteor.Collection("messages");
Messages.attachSchema(new SimpleSchema({
  english_message: { type: String },
  spanish_message: { type: String },

  date_created: { type: Date, autoValue: dateCreatedAutoValue },

  recipient_count: { type: Number, optional: true },
  status: {
    type: String,
    defaultValue: "sending",
    allowedValues: [
      "sending",
      "sent",
      "failed"
    ],
  },
}));

Contacts = new Meteor.Collection("contacts");
Contacts.attachSchema(new SimpleSchema({
  date_created: { type: Date, autoValue: dateCreatedAutoValue },
  date_modified: { type: Date, autoValue: dateModifiedAutoValue },

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
