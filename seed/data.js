const data = [
  {
    team: {
      name: 'Innosol Pro Admin',
      neo4jAuth: 'neo4j:Innosolpro2017',
      neo4jConnection: 'http://neo4j:neo4j@localhost:7474',
      imageURL: ''
    },
    reports: [
      {
        groupName: 'Sports and Greeklife',
        name: 'BASEBALL PLAYERS GIVING',
        description: 'Alumni Athelete Giving by Baseball - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:'BASEBALL'})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'FOOTBALL PLAYERS GIVING',
        description: 'Alumni Athelete Giving by Football - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:'FOOTBALL'})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'BASKETBALL MENS PLAYERS GIVING',
        description: 'Alumni Athelete Giving by BASKETBALL MENS - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:"BASKETBALL MEN'S"})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'BASKETBALL MENS PLAYERS GIVING',
        description: 'Alumni Athelete Giving by BASKETBALL MENS - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:"BASKETBALL MEN'S"})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'ALUMNI BY GREEK ORG',
        description: 'Number of Alumni by Greek organization ranked by size',
        query: `MATCH (n:Greeklife)-[r]-(a) RETURN n.name as name, count(n) ORDER BY count(n) DESC`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'ALUMNI GIVING WITH GREEK ORG & COMPANY',
        description: 'Alumni by giving when they belong to a Greek organization and work',
        query: `MATCH (c:Company)-[]-(a1:Alumni)-[]-(s:Greeklife)
          RETURN a1.name as name, a1.BBid as id, a1.rtg1category as Rating1Cat, a1.rtg1description as
          Rating1Desc, a1.rtg2category as Rating2Cat, a1.rtg2description as Rating2Desc,
          a1.rtg3category as Rating3Cat, a1.rtg3description as Rating3Desc, a1.rtg4category as Rating4Cat,
          a1.rtg4description as Rating4Desc, a1.rtg5category as Rating5Cat, a1.rtg5description as Rating5Desc,
          a1.totalgiving as totalgifts, c.name as Company, s.name as Greek ORDER BY totalgifts DESC`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Composite Scoring',
        description: 'A list of the Top 100 Alumni with Scores broken out & and in compsite',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Engagement_pagerank) AND EXISTS(n.Influence_pagerank) AND EXISTS(n.BB_pagerank) AND EXISTS(n.Social_pagerank)
          WITH n.name as name, n.Engagement_pagerank as Engagement, n.BB_pagerank as BBConnections, n.Influence_pagerank as
          Influence, n.Social_pagerank as SocialConnections
          CALL apoc.coll.max([Engagement,BBConnections,Influence,SocialConnections]) YIELD value as score
          RETURN name, Engagement, Influence, BBConnections, SocialConnections, score ORDER BY score DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni Influencer Rank',
        description: 'A list of the Top 100 Alumni with Influence Score used to Rank Alum Influence',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Influence_pagerank)
          WITH n.name as name, n.Influence_pagerank as Influence
          RETURN name, Influence ORDER BY Influence DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni Engagement Rank',
        description: 'A list of the Top 100 Alumni with Engagement score used to Rank Alum Engagement',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Engagement_pagerank)
          WITH n.name as name, n.Engagement_pagerank as Engagement
          RETURN name, Engagement ORDER BY Engagement DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni BBConnection Rank',
        description: 'A list of the Top 100 Alumni with BBConnection score used to Rank Alum BlackBaud Connections',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.BB_pagerank)
          WITH n.name as name, n.BB_pagerank as BBConnections
          RETURN name, BBConnections ORDER BY BBConnections DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni Socialonnection Rank',
        description: 'A list of the Top 100 Alumni with SocialConnection score used to Rank Alum Social Connections',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Social_pagerank)
          WITH n.name as name, n.Social_pagerank as SocialConnections
          RETURN name, SocialConnections ORDER BY SocialConnections DESC LIMIT 100`
      }
    ],
    users: [
      {
        firstName: 'Jim',
        lastName: 'Morgan',
        password: 'Innosolpro2016**',
        email: 'jim.morgan@innosolpro.com',
        role: 'admin',
      },
      {
        firstName: 'Justin ',
        lastName: 'Graber',
        password: 'password',
        email: 'jpg013@gmail.com',
        role: 'admin',
      }
    ]
  },
  {
    team: {
      name: 'University of Central Missouri',
      neo4jAuth: 'neo4j:Innosolpro2017',
      neo4jConnection: 'http://neo4j:neo4j@localhost:7474',
      imageURL: ''
    },
    reports: [
      {
        groupName: 'Sports and Greeklife',
        name: 'BASEBALL PLAYERS GIVING',
        description: 'Alumni Athelete Giving by Baseball - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:'BASEBALL'})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'FOOTBALL PLAYERS GIVING',
        description: 'Alumni Athelete Giving by Football - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:'FOOTBALL'})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'BASKETBALL MENS PLAYERS GIVING',
        description: 'Alumni Athelete Giving by BASKETBALL MENS - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:"BASKETBALL MEN'S"})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'BASKETBALL MENS PLAYERS GIVING',
        description: 'Alumni Athelete Giving by BASKETBALL MENS - Fund, Amount, Date of last gift',
        query: `MATCH (a:Sports {name:"BASKETBALL MEN'S"})-[]-(n:Alumni)-[]-(b:Fund)
          WITH a, n, b
          ORDER BY b.date DESC
          WITH a, n, HEAD(COLLECT(b)) as b
          RETURN n.name as name, n.BBid as id, n.rtg1category as Rating1Cat, n.rtg1description as
          Rating1Desc, n.rtg2category as Rating2Cat, n.rtg2description as Rating2Desc,
          n.rtg3category as Rating3Cat, n.rtg3description as Rating3Desc, n.rtg4category as Rating4Cat,
          n.rtg4description as Rating4Desc, n.rtg5category as Rating5Cat, n.rtg5description as Rating5Desc,
          n.totalgiving as totalgifts, a.name as Sport, b.name as Fund, b.date as date, b.amount as amount`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'ALUMNI BY GREEK ORG',
        description: 'Number of Alumni by Greek organization ranked by size',
        query: `MATCH (n:Greeklife)-[r]-(a) RETURN n.name as name, count(n) ORDER BY count(n) DESC`
      },
      {
        groupName: 'Sports and Greeklife',
        name: 'ALUMNI GIVING WITH GREEK ORG & COMPANY',
        description: 'Alumni by giving when they belong to a Greek organization and work',
        query: `MATCH (c:Company)-[]-(a1:Alumni)-[]-(s:Greeklife)
          RETURN a1.name as name, a1.BBid as id, a1.rtg1category as Rating1Cat, a1.rtg1description as
          Rating1Desc, a1.rtg2category as Rating2Cat, a1.rtg2description as Rating2Desc,
          a1.rtg3category as Rating3Cat, a1.rtg3description as Rating3Desc, a1.rtg4category as Rating4Cat,
          a1.rtg4description as Rating4Desc, a1.rtg5category as Rating5Cat, a1.rtg5description as Rating5Desc,
          a1.totalgiving as totalgifts, c.name as Company, s.name as Greek ORDER BY totalgifts DESC`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Composite Scoring',
        description: 'A list of the Top 100 Alumni with Scores broken out & and in compsite',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Engagement_pagerank) AND EXISTS(n.Influence_pagerank) AND EXISTS(n.BB_pagerank) AND EXISTS(n.Social_pagerank)
          WITH n.name as name, n.Engagement_pagerank as Engagement, n.BB_pagerank as BBConnections, n.Influence_pagerank as
          Influence, n.Social_pagerank as SocialConnections
          CALL apoc.coll.max([Engagement,BBConnections,Influence,SocialConnections]) YIELD value as score
          RETURN name, Engagement, Influence, BBConnections, SocialConnections, score ORDER BY score DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni Influencer Rank',
        description: 'A list of the Top 100 Alumni with Influence Score used to Rank Alum Influence',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Influence_pagerank)
          WITH n.name as name, n.Influence_pagerank as Influence
          RETURN name, Influence ORDER BY Influence DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni Engagement Rank',
        description: 'A list of the Top 100 Alumni with Engagement score used to Rank Alum Engagement',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Engagement_pagerank)
          WITH n.name as name, n.Engagement_pagerank as Engagement
          RETURN name, Engagement ORDER BY Engagement DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni BBConnection Rank',
        description: 'A list of the Top 100 Alumni with BBConnection score used to Rank Alum BlackBaud Connections',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.BB_pagerank)
          WITH n.name as name, n.BB_pagerank as BBConnections
          RETURN name, BBConnections ORDER BY BBConnections DESC LIMIT 100`
      },
      {
        groupName: 'Alumni Scoring and Analysis',
        name: 'Top 100 Alumni Socialonnection Rank',
        description: 'A list of the Top 100 Alumni with SocialConnection score used to Rank Alum Social Connections',
        query: `MATCH (n:Alumni) WHERE EXISTS(n.Social_pagerank)
          WITH n.name as name, n.Social_pagerank as SocialConnections
          RETURN name, SocialConnections ORDER BY SocialConnections DESC LIMIT 100`
      }
    ],
    users: [
      {
        firstName: 'Jenne',
        lastName: 'Vanderbout',
        password: '?acUw5ebre4u',
        email: 'vanderbout@ucmo.edu',
        role: 'user',
      },
      {
        firstName: 'Vanessa',
        lastName: 'Figg',
        password: 'sP&qAfr2TheJ',
        email: 'figg@ucmo.edu',
        role: 'user',
      },
      {
        firstName: 'Marrisa',
        lastName: 'Todd',
        password: 'Juc3uthuF*at',
        email: 'mtodd@ucmo.edu',
        role: 'user',
      },
      {
        firstName: 'Emma',
        lastName: 'Crowley',
        password: 'spuyU8ej#se5',
        email: 'ecrowley@ucmo.edu',
        role: 'user',
      }
    ]
  }
]

module.exports = data;