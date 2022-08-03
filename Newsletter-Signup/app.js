const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

client.setConfig({
  apiKey: "",
  server: ""
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const listId = "60232678a1";

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  async function run() {
    const response = await client.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscribingUser.fName,
        LNAME: subscribingUser.lName
      }
    });
    console.log(`Successfully added and the ID is ${response.id}`);
    res.sendFile(__dirname + "/success.html");

  }
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT, function() {
  console.log("Server is up on port 3000");
});
