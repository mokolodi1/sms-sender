Q = Meteor.npmRequire("q");

var twilioClient;
var fromNumber;

Meteor.startup(function () {
  // authenticate with Twilio
  var authSid;
  var authToken;
  if (Meteor.settings.testing) {
    authSid = Assets.getText("test_twilio_sid");
    authToken = Assets.getText("test_twilio_token");
    fromNumber = "+15005550006";
  } else {
    authSid = Assets.getText("twilio_sid");
    authToken = Assets.getText("twilio_token");
    fromNumber = "+18312004842";
  }
  console.log("authSid, authToken: |" + authSid + "|" + authToken + "|");

  twilioClient = Meteor.npmRequire("twilio")(authSid, authToken);
});

Meteor.methods({
  sendMessages: function (messageId) {
    this.unblock(); // allow next meteor method to run

    // get the message to send
    var message = Messages.findOne(messageId);

    if (message.group) {
      console.log('Sending messages to contacts in group "' +
          message.group + '"');
    } else {
      console.log("Sending messages to all contacts...");
    }

    var sent_contacts = [];
    var failed_contacts = [];
    var twilioPromises = [];
    filteredContacts(message.group).forEach(function (contact) {
      var messageBody;
      if (contact.preferred_language === "English") {
        messageBody = message.english_message;
      } else {
        messageBody = message.spanish_message;
      }

      console.log('Sending "' + messageBody + '" to ' + contact.name +
          ' at ' + contact.phone_number);

      var deferred = Q.defer();
      twilioClient.sendSms({
        to: contact.phone_number,
        from: fromNumber,
        body: messageBody,
      }, function(err, responseData) {
        if (err) {
          console.log("err:", err);
          failed_contacts.push(contact._id);
        } else {
          sent_contacts.push(contact._id);
          // // http://www.twilio.com/docs/api/rest/sending-sms#example-1
          // console.log(responseData.from);
          // console.log(responseData.body);
        }
        deferred.resolve();
      });

      twilioPromises.push(deferred.promise);
    });

    console.log("done starting sending to all contacts");
    Q.all(twilioPromises).done(Meteor.bindEnvironment(function (values) {
      Messages.update(messageId, {
        $set: {
          sent_contacts,
          failed_contacts,
          status: "sent",
        }
      });

      _.each(sent_contacts, function (contactId) {
        Contacts.update(contactId, {
          $addToSet: {
            messages_sent: messageId
          },
          $inc: {
            messages_sent_count: 1,
          },
        });
      });
      console.log("sent all texts");
    }));
  },
});
