# SMSr

SMSr allows you to send bilingual text messages to a list of contacts. You can also create groups and send notifications only to contacts in a specific group.

# Devpost submission for UCSC HACK

## Inspiration

During the pitches for UCSC HACK, a representative from the California Rural Legal Assistance (CRLA) pitched an app that allows the organization to send out SMS notifications to their clients. Many of their clients have cell phones but cannot afford an expensive data plan so they do not necessarily receive email notifications.

After talking with the representative, she mentioned that many clients prefer Spanish language and also said it would be nice to be able to send to specific groups of clients so that not everyone has to receive every text.

## What it does

SMSr allows an organization such as the CRLA to send bilingual SMS notifications to groups of contacts. It has a built-in contact manager and group manager.

While SMSr currently only supports English and Spanish language notifications, SMSr can easily be extended for other languages.

## How we built it

SMSr was created with Meteor and bootstrap. For SMS integration, SMSr uses Twilio through their npm package.

## Challenges we ran into

Integration with Twilio for SMS was the hardest challenge.

## Accomplishments that we're proud of

We're proud of making a product that works and is useful to an organization that needs it!

## What we learned

Simple apps can efficiently solve problems in the community.

This is a technical detail, but we learned about `this.unblock()` in Meteor methods, which allows queued methods called after the current method to begin executing. This is important because sending SMSs through Twilio takes a noticeable amount of time—-enough to appear as lag in the UI.

## What's next for SMSr

After the hackathon we will schedule to meet with CRLA to deploy SMSr at their offices.

In terms of development, the next logical step would be to add testing and set up CI (aka Travis).

Depending on how many contacts they have, I will have to do some work to paginate the contacts manager and add search functionality. Another possible feature is an importer that reads contacts from a file.
