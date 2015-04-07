var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var collections = {};

app.get('/', function(req, res){
  res.sendFile('index.html');
});

app.post('/api/title', function(req, res){
  var url = req.body.url;
  request(url, function (err, resquest, body) {
    if (!err && res.statusCode == 200) {
      var title = 'no title found';
      body = body.replace(/\n/g,'');
      var match=body.match(/<title>(.*)<\/title>/im);
      if (match && match.length>1){
        title= (''+match[1]).trim();
      }
      res.send({title: title}); 
    }
  });
});

app.route('/api/collections')
  .get(function(req, res){
    var objs = [];
    Object.keys(collections).forEach(function(el){
      objs.push({id: el, title: collections[el].title});
    });
    res.send(objs);
  });

app.route('/api/collection')
  .get(function(req, res){
    res.send(collections[req.query.id]);
  })
  .post(function(req, res){
    collections[req.body.newId] = {title: req.body.title, links: []};
  })
  .delete(function(req, res){
    delete collections[req.body.id];
  });

app.route('/api/link')
  .get(function(req, res){
    console.log("nothing here");
  })
  .post(function(req, res){
    collections[req.body.id].links.push(req.body.item);
  })
  .delete(function(req, res){
    var index = req.body.index;
    var id = req.body.colId;
    var col = collections[id];
    col.links.splice(index, 1);
    collections[id] = col;
  });

module.exports = app;