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
    console.log("sendMessages");
    this.unblock(); // allow next meteor method to run

    // get the message to send
    var message = Messages.findOne(messageId);

    var sent_contacts = [];
    var failed_contacts = [];
    var twilioPromises = [];
    Contacts.find({}).forEach(function (contact) {
      console.log("contact:", contact);

      var messageBody;
      if (contact.preferred_language === "English") {
        messageBody = message.english_message;
      } else {
        messageBody = message.spanish_message;
      }

      var deferred = Q.defer();
      // console.log("contact.phone_number:", contact.phone_number);
      // console.log("fromNumber:", fromNumber);
      // console.log("messageBody:", messageBody);
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
      console.log("sent all texts");
    }));
  },
});
