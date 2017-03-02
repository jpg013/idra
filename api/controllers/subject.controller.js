const express = require('express')
const subjectRouter = express.Router();
const subjectModel = require('../../models/subject.model');
const neo4j = require('neo4j');

const db = new neo4j.GraphDatabase({
  url: 'http://neo4j:neo4j@localhost:7474',
  auth: 'neo4j:innosol',
  headers: {},    // optional defaults, e.g. User-Agent
  proxy: null,    // optional URL
  agent: null,    // optional http.Agent instance, for custom socket pooling
});

const testSubjects = [
  {
    id: 1,
    name: 'Justin Graber',
    graduatedDate: '2010',
    isFlagged: false,
    score: 100
  },
  {
    id: 2,
    name: 'Chris Waner',
    graduatedDate: '2006',
    isFlagged: true,
    score: 94
  },
  {
    id: 3,
    name: 'Jim Morgan',
    graduatedDate: '1995',
    isFlagged: false,
    score: 85
  },
  {
    id: 4,
    name: 'Zhanna Morgan',
    graduatedDate: '2000',
    isFlagged: true,
    score: 62
  },
  {
    id: 5,
    name: 'Todd Decker',
    graduatedDate: '1990',
    isFlagged: false,
    score: 53
  },
  {
    id: 6,
    name: 'Jon Jones',
    graduatedDate: '1966',
    isFlagged: false,
    score: 55
  },
];

// define the about route
subjectRouter.get('/', function (req, res) {
    /*
    const query = 'CREATE (n)';
    const stream = db.cypher({query: query}, function(err, results) {
      if (err) {
        console.log(err);
      } else {
         console.log('results!!!')
         console.log(results);
      }
    })
    */
    console.log('subject controller getting called');
    res.json({subjects: testSubjects});
});

module.exports = subjectRouter;
