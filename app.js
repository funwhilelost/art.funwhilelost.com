'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();

var s3 = require('s3');
var _ = require('lodash');

// build the S3 client from environment variables
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: "" // US Standard??
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

app.use(express.static('public'));
app.get('/pack/:id', function(req, res) {
  // res.set('Content-Type', 'text/html');
  // res.status(404).send('Sorry, we cannot find that!');
  // res.send({ "list": [1, 2, 3] });

  // omit Prefix, get back "commonprefixes"
  var api_result = client.listObjects({
    "s3Params": {
      "Bucket": process.env.S3_BUCKET,
      "Prefix": req.params.id // TODO: I don't think this can result in injection problems...
    }
  });

  var object_list = [];

  api_result.on('data', function (data) {
    object_list = _.map(data.Contents, function (v) {
      return "https://s3.amazonaws.com/" + process.env.S3_BUCKET + "/" + v.Key
    });
    object_list = object_list.splice(1); // trim the "directory" off the top
  });

  api_result.on('end', function () {
    //res.send(api_result);
    res.send(object_list);
  });
});

app.get('/list', function(req, res) {
  // res.set('Content-Type', 'text/html');
  // res.status(404).send('Sorry, we cannot find that!');
  // res.send({ "list": [1, 2, 3] });

  // omit Prefix, get back "commonprefixes"
  var api_result = client.listObjects({
    "s3Params": {
      "Bucket": "art.funwhilelost.com",
      "Delimiter": "/"
    }
  });

  var object_list = [];

  api_result.on('data', function (data) {
    object_list = _.map(data.CommonPrefixes, function (v) { return v.Prefix.replace(/\/$/, "") });
  });

  api_result.on('end', function () {
    //res.send(api_result);
    res.send(object_list);
  });
});

app.get('/contents/:prefix', function(req, res) {
  res.sendfile('./public/index.html');
});

app.get('/show/:object', function(req, res) {
  res.sendfile('./public/index.html');
});

app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});

app.listen(process.env.PORT || 5000);
