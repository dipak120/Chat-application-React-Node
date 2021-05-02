const express = require('express');
const userService = require('./user.service');
const formidable = require("formidable");
const uuidv4 = require('uuid/v4');
const socketio = require('socket.io');
const http = require('http');
require('constant.env');
const router = express.Router();
const server = http.createServer(router);
const io = socketio(server);
const fs = require('fs');
let fileScope = '';
const PORT = ENV_PORT;

io.on("connection", function (PORT) {
    console.log('connection established')
    client.on("message", function (data) {
    });
    client.on("disconnect", function () { });
});

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/updateprofile', updateProfile);
router.post('/imgupload', imgupload);
router.post('/addPassword', addPassword);
router.post('/sendRequest', sendRequest);
router.get('/getAllFriend', getAllFriend);
router.post('/messageseen', MessageSeen);
router.get('/getUserProfile/:id', getUserProfile);
router.get('/request/:id', getRequest);
router.get('/current', getCurrent);
router.post('/deleterequest', deleteRequest);
router.post('/acceptrequest', acceptRequest);
router.get('/:id', getAll);
router.get('/getfriends/:id', getFriends);
router.put('/:id', update);
router.delete('/:id', _delete);

function authenticate(req, res, next) {
    console.log(req.body);
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function addPassword(req, res, next) {
    userService.addPassword(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Your confirmation link is expire' }))
        // .then(users => res.json(users))
        .catch(err => next(err));
}

function register(req, res, next) {
        const path = uuidv4() + req.body.image;
        fileScope = path;
        userService.create(req.body, fileScope)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function updateProfile(req, res, next) {
    if (req.body.lastImages == false) {
        fileScope = '';
    } else {
        const path = uuidv4() + req.body.image;
        fileScope = path;
    }
    userService.updateProfile(req.body, fileScope)
        .then((user) => res.json(user))
        .catch(err => next(err));
}


function imgupload(req, res, next) {
    if (fileScope != '') {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            file.path = __dirname + '/uploads/' + fileScope;
            fileScope = '';
        });
        form.on('file', function (name, file) {
        })

        res.json('image uploaded');
    }
}

function getAll(req, res, next) {
    userService.getAll(req.params.id)
        .then(users => res.json(users),
        )
        .catch(err => next(err));
}

function getUserProfile(req, res, next) {
    userService.getUserProfile(req.params.id)
        .then(users => res.json(users),
        )
        .catch(err => next(err));
}

function getRequest(req, res, next) {
    userService.getRequest(req.params.id)
        .then(users => res.json(users),
        )
        .catch(err => next(err));
}

function getFriends(req, res, next) {
    userService.getFriends(req.params.id)
        .then(users => res.json(users),
        )
        .catch(err => next(err));
}

function getAllFriend(req, res, next) {
    userService.getAllFriend()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

// function getById(req, res, next) {
//     userService.getById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function acceptRequest(req, res, next) {
    userService.acceptRequest(req.body.id)
        .then((users) => res.json(users))
        .catch(err => next(err));
}

function MessageSeen(req, res, next) {
    userService.MessageSeen(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function sendRequest(req, res, next) {
    userService.sendRequest(req.body)
        .then((users) => res.json(users))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteRequest(req, res, next) {
    console.log(req.body)
    userService.deleteRequest(req.body.id,req.body.loginId,req.body.action)
        .then((users) => res.json(users))
        .catch(err => next(err));
}

module.exports = router;
