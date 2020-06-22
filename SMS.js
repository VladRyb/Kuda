require('dotenv').config();

const client = require('twilio')(
  `${process.env.accountSid}`,
  `${process.env.authToken}`
);

async function SMS(body, to) {
  client.messages
    .create({
      body,
      from: '+12723599870',
      to,
    })
    .then((message) => console.log(message.sid))
    .done();
}
async function whatsapp(body, num) {
  client.messages
    .create({
      body,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${num}`,
    })
    .then((message) => console.log(message.sid))
    .done();
}

module.exports = { SMS, whatsapp };
