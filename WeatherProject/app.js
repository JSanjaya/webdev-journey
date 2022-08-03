const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");

})

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = "87480d0cf0a607a5a80d7b66be5733b8";
  const units = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query + "&appID=" + apiKey +"&units=" + units;

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData);

      const temp = weatherData.main.temp;

      const desc = weatherData.weather[0].description;

      const icon = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon +
       "@2x.png";

      res.write("<p>The weather is currently " + desc + "<p>");
      res.write("<h1>The temp in " + req.body.cityName + " is: " + temp + " in celcius</h1>");
      res.write("<img src='" + icon + "'/>");
      res.send();

    })
  });
})



app.listen(3000, function() {
  console.log("Server up port 3000");
});
