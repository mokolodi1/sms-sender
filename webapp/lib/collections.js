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
  group: { type: String, optional: true },

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

SimpleSchema.messages({
  invalidPhoneNumber: "Invalid phone number",
  wrongCountryCode: "Only US numbers (+1) are supported",
  groupAlreadyExists: "Group already exists",
});

function getNumbers (uglyText) {
  return uglyText.replace(/\D/g, "");
}

Contacts = new Meteor.Collection("contacts");
Contacts.attachSchema(new SimpleSchema({
  date_created: { type: Date, autoValue: dateCreatedAutoValue, optional: true },
  date_modified: { type: Date, autoValue: dateModifiedAutoValue, optional: true },

  name: { type: String },
  phone_number: {
    type: String,
    custom: function () {
      var onlyNumbers = getNumbers(this.value);
      if (onlyNumbers.length === 11) {
        if (onlyNumbers[0] !== "1") {
          return "wrongCountryCode";
        }
        // okay
      } else if (onlyNumbers.length !== 10) {
        return "invalidPhoneNumber";
      }
    },
    autoValue: function () {
      if (this.isSet) {
        var onlyNumbers = getNumbers(this.value);
        if (onlyNumbers.length === 11) {
          if (onlyNumbers[0] === "1") {
            onlyNumbers = onlyNumbers.slice(1);
          } else {
            return onlyNumbers; // error will be picked up in custom validation
          }
        }

        var areaCode = onlyNumbers.slice(0, 3);
        var secondThree = onlyNumbers.slice(3, 6);
        var lastThree = onlyNumbers.slice(6, 10);
        return "+1 (" + areaCode + ") " + secondThree + "-" + lastThree;
      }
    },
  },
  preferred_language: {
    type: String,
    allowedValues: [
      "English",
      "Spanish",
    ]
  },
  groups: {
    type: [String],
    defaultValue: [],
    optional: true,
  },

  messages_sent: { type: [Meteor.ObjectID], defaultValue: [], optional: true },
  messages_sent_count: {
    type: Number,
    autoValue: _.partial(lengthOfArray, "messages_sent"),
    optional: true,
  },

  notifications_active: { type: Boolean, defaultValue: true, optional: true },
}));

Groups = new Meteor.Collection("groups");
Groups.attachSchema(new SimpleSchema({
  name: {
    type: String,
    custom: function () {
      if (Groups.findOne({name: this.value})) {
        return "groupAlreadyExists";
      }
    },
  },
}));
