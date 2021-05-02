require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
var path = require('path');
const servers = require('http').Server(app);
const users = require("./configs/users");
const userService = require('./users/user.service');
var fs = require('fs');
require('constant.env');


var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var clients = {};

// use JWT auth to secure the api
// app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/static', express.static(path.join(__dirname, './users/uploads')))

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : ENV_PORT
const server = app.listen(port, function () {
  console.log('Server listening on port ' + port);
});

const io = require('socket.io')(server);
app.use(express.static('static'));

io.on("connection", function (client) {
  client.on("sign-in", e => {
    let user_id = e.id;
    if (!user_id) return;
    client.user_id = user_id;
    if (clients[user_id]) {
      clients[user_id].push(client);
    } else {
      clients[user_id] = [client];
    }
    userService.getMessage(e.id).then(message => { if (message != '') { client.emit("message", message) } })
  });

  client.on("message", e => {
    userService.InsertMessage(e)
      .then();
    let targetId = e.to;
    let sourceId = client.user_id;
    if (targetId && clients[targetId]) {
      clients[targetId].forEach(cli => {

        cli.emit("message", e);
      });
    }

    if (sourceId && clients[sourceId]) {
      clients[sourceId].forEach(cli => {
        cli.emit("message", e);
      });
    }
  });

  client.on("disconnect", function () {
    if (!client.user_id || !clients[client.user_id]) {
      return;
    }
    let targetClients = clients[client.user_id];
    for (let i = 0; i < targetClients.length; ++i) {
      if (targetClients[i] == client) {
        targetClients.splice(i, 1);
      }
    }
  });
});

app.post("/users", (req, res) => {
  // res.send({ data: users });
  userService.getAllUser(req.body.id)
    .then(users => res.send({ data: users }))
});


