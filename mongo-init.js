const teamModel             = require('./models/team.model');
const userModel             = require('./models/user.model');
const reportCollectionModel = require('./models/report-collection.model');
const reportModel           = require('./models/report.model');
const cryptoClient          = require('./common/crypto');
const async                 = require('async');
const dotenv                = require('dotenv');

dotenv.config();
require('./config/mongo').config();

const reportQuery = `// DEMO 6 Alumni Athelete Giving by Sport - Fund, Amount, Date
      MATCH (a:Sports {name:'BASEBALL'})-[]-(n:Alumni)-[]-(b:Fund)
      WITH a, n, b
      ORDER BY b.date DESC
      WITH a, n, HEAD(COLLECT(b)) as b
      RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as 
      Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc, 
      n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat, 
      n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
      n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`;

const reportData = [
  new reportModel({ name: 'DEMO 6',  createdDate: new Date(),  description: 'Alumni Athelete Giving by Sport - Fund, Amount, Date',  query: reportQuery })
];

const removeTeams = cb => teamModel.collection.drop(cb);
const removeUsers = cb => userModel.collection.drop(cb);

const defaultReportCollection = new reportCollectionModel({
  name: 'default report collection',
  createdDate: new Date(),
  reports: reportData
});

const team = new teamModel({
  name: 'Innosol Pro Admin',
  neo4jAuth: 'neo4j:Innosolpro2016**',
  neo4jConnection: 'http://neo4j:neo4j@localhost:7474',
  reportCollections  : [defaultReportCollection],
  createdDate : new Date(),
  userCount: 1
});

const user1 = new userModel({
  firstName: 'Jim',
  lastName: 'Morgan',
  password: cryptoClient.encrypt('Innosolpro2016**'),
  email: 'jim.morgan@innosolpro.com',
  role: 'admin',
  createdDate: new Date(),
  team: team._id
});

const user2 = new userModel({
  firstName: 'Justin ',
  lastName: 'Graber',
  password: cryptoClient.encrypt('password'),
  email: 'justin.graber@innosolpro.com',
  role: 'admin',
  createdDate: new Date(),
  team: team._id
});

const usersPipeline = [user1, user2];

const addTeam = cb => team.save(cb);
const addUser1 = cb => user1.save(cb);
const addUser2 = cb => user2.save(cb);

async.series([removeTeams, removeUsers, addTeam, addUser1, addUser2], function(err) {
  if (err) {
    console.log('there was an error running the script!');
  } else {
    console.log('success!')
    process.exit();
  }
});

