const axios = require("axios");

const createToken = async (req, res) => {
  const secret = "dQSOC8BG3I2daPqJ";
  const consumer = "Av2RY6JntwNWNJr4GmI5YGFx9MIt3WSM";
  const auth = `Basic ${Buffer.from(`${consumer}:${secret}`).toString(
    "base64"
  )}`;
  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: auth },
      }
    );
    res.status(200).send(response.data);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const triggerStkPush = async () => {
  const stkUrl = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/send";
  const headers = {
    Authorization: `Bearer ${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`,
  };
  const body = {
    Initiator: "your-business-short-code",
    //Replace with your business short code
    //You can get it from M-Pesa Business Dashboard
    Target: "254712345678",
    //Replace with the customer phone number
    Amount: 100,
    //Replace with the amount to be charged
    //The minimum amount is KES 10
    AccountReference: "Your reference",
    //Replace with your reference
    //This will be displayed to the customer
    CallbackURL: "https://your-callback-url",
    //Replace with your callback URL
    //This will be called when the transaction is complete
  };

  try {
    const res = await axios.post(stkUrl, body, { headers });
    if (res.status === 200) {
      console.log("STK push sent successfully.");
    } else {
      console.log("Error sending STK push:", res.status, res.message);
    }
  } catch (error) {
    console.log("Error sending STK push:", error);
  }
};

if (process.env.CONSUMER_KEY && process.env.CONSUMER_SECRET) {
  triggerStkPush();
} else {
  console.log(
    "CONSUMER_KEY and CONSUMER_SECRET environment variables are not set."
  );
}

module.exports = { createToken };
