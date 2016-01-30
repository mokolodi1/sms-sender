Twilio = Meteor.npmRequire("twilio");

Meteor.methods({
  sendMessages: function (messageId) {
    // allow next meteor method to run
    this.unblock();

    var authSid = Assets.getText("twilio_sid");
    var authToken = Assets.getText("twilio_token");
    console.log("authSid, authToken: |" + authSid + "|" + authToken + "|");

    twilioClient = Twilio(authSid, authToken);
    twilioClient.sendSms({
      to:'+16092161012', // Any number Twilio can deliver to
      from: "+15005550006",
      // from: '+18312004842', // A number you bought from Twilio and can use for outbound communication
      body: "wow such sms" // body of the SMS message
    }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (err) { // "err" is an error received during the request, if any
        console.log("err:", err);
      } else {
        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1
        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
      }
  });
  },
});
