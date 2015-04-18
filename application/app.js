var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var collections = {'12345': 
  {
    title: 'Search Engines', links: [
      {title:'Google', link:'http://google.com', description: 'This is the Googles, they track you.'},
      {title:'DuckDuckGo', link:'http://duckduckgo.com', description: 'd.d.g. does not track you.'}
    ]
  },
  '54321':
  {
    title: 'Swift', links: [
      {title:'About', link:'https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/index.html', description: 'Intro page.'},
      {title:'Collection Types', link:'https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/CollectionTypes.html#//apple_ref/doc/uid/TP40014097-CH8-ID105', description: 'Collection types are confusing as all get out, sometimes.'}
    ]  
  }
};

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
  .put(function(req, res){
    collections[req.body.newId] = {title: req.body.title, links: []};
  })
  .get(function(req, res){
    res.send(collections[req.query.id]);
  })
  .post(function(req, res){
    console.log('there was a post, update me');
  })
  .delete(function(req, res){
    delete collections[req.body.id];
  });

app.route('/api/link')
  .put(function(req, res){
    collections[req.body.id].links.push(req.body.item);
  })
  .get(function(req, res){
    console.log("nothing here");
  })
  .post(function(req, res){
    console.log('there was a post, update me');
  })
  .delete(function(req, res){
    var index = req.body.index;
    var id = req.body.colId;
    var col = collections[id];
    col.links.splice(index, 1);
    collections[id] = col;
  });

module.exports = app;