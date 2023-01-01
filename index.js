require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const shortUrl = require('./database');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

//app.use(cors());

// function that saves url
function saveUrl(url, id) {
  let short_url = new shortUrl({
    originUrl: url,
    shortUrlId: id
  });
  return short_url;
};

app.use('/public', express.static(`${process.cwd()}/public`));

// middleware of body-parser
app.use('/api/shorturl', bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// url shortener
app.post('/api/shorturl', (req, res) => {
  let originUrl = req.body.url;
  let patron = /^https?:\/\//i;
  let id = 1;
  if (patron.test(originUrl)) {
    let hostname = originUrl.slice(originUrl.indexOf('//') + 2);
    hostname = hostname.slice(0, hostname.indexOf('/'));
    dns.lookup(hostname, (err, address) => {
      if (err) {
        res.json({ error: 'invalid url' });
        console.error(err)
      } else {
        shortUrl.find().sort({ shortUrlId: -1 }).limit(1).exec((err, data) => {
          if (err) console.error(err)
          if (Object.keys(data).length === 0) {
            let firstUrl = saveUrl(originUrl, id);
            firstUrl.save((err, data) => {
              if (err) console.error(err);
              console.log(data);
            })
          } else {
            id = id + data[0].shortUrlId;
            let short_url = saveUrl(originUrl, id);
            short_url.save((err, data) => {
              if (err) console.error(err);
              console.log(data);
            });
            res.json({ original_url: originUrl, short_url: id })
          }
        });
      }
    });
  } else {
    res.json({ error: 'invalid url' });
  };
});

app.get('/api/test', (req, res) => {
  shortUrl.find().sort({ shortUrlId: -1 }).limit(1).exec((err, data) => {
    if (err) console.error(err)
    if (Object.keys(data).length === 0) {
      console.log(12)
    }
    console.log(data + typeof (data))
  });
});

// return url
app.get('/api/shorturl/:id', (req, res) => {

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
