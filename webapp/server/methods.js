var twilioClient;
var fromNumber;

Meteor.startup(function () {
  // authenticate with Twilio
  var authSid;
  var authToken;
  var fromNumber;
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

    var sent_contacts = ["hello", "second"];
    var failed_contacts = [];
    Contacts.find({}).forEach(function (contact) {
      console.log("contact:", contact);

      var message;
      if (contact.preferred_language === "english") {
        message = message.english_message;
      } else {
        message = message.spanish_message;
      }

      twilioClient.sendSms({
        to:"+1 (609) 216-1012",
        from: fromNumber,
        body: message,
      }, function(err, responseData) {
        if (err) {
          failed_contacts.push(contact._id);
        } else {
          sent_contacts.push(contact._id);
          // // http://www.twilio.com/docs/api/rest/sending-sms#example-1
          // console.log(responseData.from);
          // console.log(responseData.body);
        }
      });

      Messages.update({
        $set: {
          sent_contacts,
          failed_contacts
        }
      });
    });
  },
});
