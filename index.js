const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('underscore');

const port = process.env.port || 3000;

app.use(cors());

app.get('/', (req, res) => {
  var url = req.query.url;
  axios.get(url)
    .then(response => {
      var $ = cheerio.load(response.data);
      var data = parseHTML($);
      res.json(data);
    }).catch(error => {
      res.send(error);
    });
});

function parseHTML($) {
  var staff = [];
  $('.richtext').find('p').each(function(index, element) {
    var name = $(element).find('strong').text().split(',');
    var firstName = name[1];
    var lastName = name[0];
    var text = $(element).text();
    phoneNumber = text.replace(/[^0-9\-]/g,'');
    var email = $(element).find('a').text();
    if(name.length > 1) {
      staff.push({
        firstName: firstName.trim().split(' ')[0],
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email
      });
    }
  });
  return staff;
}

const server = app.listen(port, 'localhost', () => {
  console.log(`Listening on http://${server.address().address}:${server.address().port}`);
});