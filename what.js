const accountSid = 'AC189176d1df939f30e155b34dde88b05a';
const authToken = '7ae7f6d33b595cfc8cbc21e7072384ca';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'Your appointment is coming up on July 21 at 3PM',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+79258816499',
  })
  .then((message) => console.log(message.sid))
  .done();
