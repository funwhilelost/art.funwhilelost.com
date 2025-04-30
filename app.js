'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();

// Use Node.js built-in modules for filesystem operations
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

// Define the path to the packs directory
var packsDir = path.join(__dirname, 'packs');

app.use(express.static('public'));

app.get('/pack/:id', function(req, res) {
  const packId = req.params.id;
  const packPath = path.join(packsDir, packId);
  
  // Validate the path to prevent directory traversal attacks
  const resolvedPath = path.resolve(packPath);
  if (!resolvedPath.startsWith(packsDir)) {
    return res.status(403).send('Forbidden');
  }
  
  fs.readdir(packPath, function(err, files) {
    if (err) {
      return res.status(404).send('Pack not found');
    }
    
    // Map files to full URLs
    var object_list = _.map(files, function(file) {
      // Create the URL path similar to how S3 URLs were formatted before
      return `/packs/${packId}/${file}`;
    });
    
    res.send(object_list);
  });
});

app.get('/list', function(req, res) {
  fs.readdir(packsDir, function(err, files) {
    if (err) {
      return res.status(500).send('Error reading packs directory');
    }
    
    // Filter out any non-directories
    fs.stat(path.join(packsDir, files[0]), function(err, stats) {
      if (err) {
        return res.status(500).send('Error reading directory stats');
      }
      
      // Get directories only
      var dirPromises = files.map(function(file) {
        return new Promise(function(resolve, reject) {
          fs.stat(path.join(packsDir, file), function(err, stats) {
            if (err) reject(err);
            else resolve({ name: file, isDirectory: stats.isDirectory() });
          });
        });
      });
      
      Promise.all(dirPromises).then(function(results) {
        var directories = results
          .filter(function(item) { return item.isDirectory; })
          .map(function(item) { return item.name; });
        
        res.send(directories);
      }).catch(function(err) {
        res.status(500).send('Error reading directory structure');
      });
    });
  });
});

// Serve static files from the packs directory
app.use('/packs', express.static('packs'));

app.get('/contents/:prefix', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/show/:object', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT || 5001);
console.log('Server started on port ' + (process.env.PORT || 5001));
