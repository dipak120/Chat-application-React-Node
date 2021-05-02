const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const nodemailer = require('nodemailer');
const User = db.User;
const Friend = db.Friend;
const Message = db.Message;
ObjectID = require('mongodb').ObjectID,

    module.exports = {
        authenticate,
        getAll: getAll,
        getById,
        create,
        update,
        delete: _delete,
        addPassword,
        sendRequest,
        getAllFriend,
        getRequest,
        deleteRequest,
        acceptRequest,
        getFriends,
        updateProfile,
        checkImg,
        getAllUser,
        InsertMessage,
        getMessage,
        MessageSeen,
        removeDuplicates,
        getUserProfile

    };

/**
* main send start
**/
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "dipaktest132@gmail.com",
        pass: "Dipak123456"
    }
});
var rand, mailOptions, host, link;
/**
* main send end
**/

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        // const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll(loginId) {
    const data = await User.aggregate([{
        $lookup: {
            from: "friends",
            localField: "senderid",
            foreignField: "id",
            as: "friend"
        }
    }
    ])
    // return data;
    var frined = [];
    var Obj = [];

    for (i = 0; i < data.length; i++) {
        Obj.push({
            _id: data[i]._id,
            id: data[i].id,
            firstName: data[i].firstName,
            lastName: data[i].lastName,
            username: data[i].username,
            phone: data[i].phone,
            about: data[i].about,
            image: data[i].image,
            email: data[i].email,
            friend: [],
            receiverId:[]
        })
        for (j = 0; j < data[i].friend.length; j++) {
            if (loginId == data[i].friend[j].senderid && data[i]._id == data[i].friend[j].receiverid) {
                Obj[i].friend.push({
                    senderid: data[i].friend[j].senderid,
                    receiverid: data[i].friend[j].receiverid,
                    status: data[i].friend[j].status
                })
            }
            if (loginId == data[i].friend[j].receiverid && data[i]._id == data[i].friend[j].senderid) {
                Obj[i].friend.push({
                    senderid: data[i].friend[j].senderid,
                    receiverid: data[i].friend[j].receiverid,
                    status: data[i].friend[j].status
                })
                Obj[i].receiverId.push(data[i]._id)
            }
        }
    }
    console.log(Obj)
    return Obj;
}





async function getUserProfile(id) {
    const Obj = await User.find({ _id: id })
    return Obj;
}

async function getAllUser(loginId) {
    const msg = await Message.find({}).sort({ "date": -1 })
    const data = await User.aggregate([{
        $lookup: {
            from: "messages",
            localField: "from",
            foreignField: "id",
            as: "message"
        }
    }
    ])
    // return data;
    var frined = [];
    var Obj = [];

    for (i = 0; i < data.length; i++) {


        for (j = 0; j < msg.length; j++) {
            if (msg[j].seen == false && data[i].id == msg[j].from && msg[j].to == loginId) {
                Obj.push({
                    // id: data[i]._id,
                    id: data[i].id,
                    name: data[i].firstName + ' ' + data[i].lastName,
                    lastName: data[i].lastName,
                    username: data[i].username,
                    phone: data[i].phone,
                    about: data[i].about,
                    image: data[i].image,
                    email: data[i].email,
                    date: msg[j].date
                })
            }

        }
    }

    for (i = 0; i < data.length; i++) {


        for (j = 0; j < msg.length; j++) {
            if (msg[j].seen == true && data[i].id == msg[j].from && msg[j].to == loginId) {
                Obj.push({
                    // id: data[i]._id,
                    id: data[i].id,
                    name: data[i].firstName + ' ' + data[i].lastName,
                    lastName: data[i].lastName,
                    username: data[i].username,
                    phone: data[i].phone,
                    about: data[i].about,
                    image: data[i].image,
                    email: data[i].email,
                    date: msg[j].date
                })
            }

        }
    }


    for (i = 0; i < data.length; i++) {

        Obj.push({
            // id: data[i]._id,
            id: data[i].id,
            name: data[i].firstName + ' ' + data[i].lastName,
            lastName: data[i].lastName,
            username: data[i].username,
            phone: data[i].phone,
            about: data[i].about,
            image: data[i].image,
            email: data[i].email,
        })
    }



    var uniqueObj = removeDuplicates(Obj, "phone");
    return uniqueObj;

}

async function getMessage(to) {
    const messObj = await Message.find({ $or: [{ to: to }, { from: to }] })
    if (messObj) {
        return messObj;
    }
}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}


async function getRequest(loginId) {
    const data = await User.aggregate([{
        $lookup: {
            from: "friends",
            localField: "senderid",
            foreignField: "id",
            as: "friend"
        }
    }
    ])
    // return data;
    var Obj = [];

    for (i = 0; i < data.length; i++) {

        for (j = 0; j < data[i].friend.length; j++) {

            if (loginId == data[i].friend[j].receiverid && data[i]._id == data[i].friend[j].senderid && data[i].friend[j].status == false) {
                Obj.push({
                    _id: data[i]._id,
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    username: data[i].username,
                    phone: data[i].phone,
                    about: data[i].about,
                    image: data[i].image,
                    email: data[i].email,
                    senderid: data[i].friend[j].senderid,
                    receiverid: data[i].friend[j].receiverid,
                    status: data[i].friend[j].status,
                    friend_id: data[i].friend[j]._id
                })
            }
        }

    }
    return Obj;
}


async function getFriends(loginId) {
    const data = await User.aggregate([{
        $lookup: {
            from: "friends",
            localField: "senderid",
            foreignField: "id",
            as: "friend"
        }
    }
    ])
    // return data;
    var Obj = [];

    for (i = 0; i < data.length; i++) {

        for (j = 0; j < data[i].friend.length; j++) {

            if (loginId == data[i].friend[j].receiverid && data[i]._id == data[i].friend[j].senderid && data[i].friend[j].status == true) {
                Obj.push({
                    _id: data[i]._id,
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    username: data[i].username,
                    phone: data[i].phone,
                    about: data[i].about,
                    image: data[i].image,
                    email: data[i].email,
                    senderid: data[i].friend[j].senderid,
                    main_id: data[i].friend[j]._id,
                    receiverid: data[i].friend[j].receiverid,
                    status: data[i].friend[j].status,
                    friend_id: data[i].friend[j]._id
                })
            }

            if (loginId == data[i].friend[j].senderid && data[i]._id == data[i].friend[j].receiverid && data[i].friend[j].status == true) {
                Obj.push({
                    _id: data[i]._id,
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    username: data[i].username,
                    phone: data[i].phone,
                    about: data[i].about,
                    image: data[i].image,
                    email: data[i].email,
                    senderid: data[i].friend[j].senderid,
                    main_id: data[i].friend[j]._id,
                    receiverid: data[i].friend[j].receiverid,
                    status: data[i].friend[j].status,
                    friend_id: data[i].friend[j]._id
                })
            }
        }

    }
    return Obj;
}


async function getAllFriend() {
    const data = await Friend.find({});
    return data;
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function getNextSequenceValue(sequenceName) {

    var sequenceDocument = await User.findAndModify({
        query: { _id: sequenceName },
        update: { $inc: { sequence_value: 1 } },
        new: true
    });

    return sequenceDocument.sequence_value;
}

async function create(userParam, fileScope) {
    // validate
    if (!userParam.sendEmail) {
        const user = new User(userParam);
        if (userParam.image) {
            user.image = fileScope;
        }
        const sequenceDocument = await User.find({}).sort({ '_id': -1 })
        if (sequenceDocument) {
            user.id = sequenceDocument[0].id + 1
        }
        user.id = 1

        if (await User.findOne({ username: userParam.username })) {
            throw 'Username "' + userParam.username + '" is already taken';
        }

        // save user
        await user.save();
        const username = await User.findOne({ username: userParam.username })
        /**
         * main send start
         **/
        rand = Math.floor((Math.random() * 100) + 54);
        host = '192.168.0.132:3000';
        link = "http://" + host + "/createpassword/" + username._id;
        mailOptions = {
            to: userParam.email,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                response.end("error");
            } else {
                console.log("Message sent: " + response.message);
                res.json('Mail sended');
                // res.end("sent");
            }
        });
    } else if (userParam.sendEmail) {
        const sequenceDocument = await User.find({}).sort({ '_id': -1 })
        userEmail = sequenceDocument[0].email

        /**
         * main Resend start
         **/
        rand = Math.floor((Math.random() * 100) + 54);
        host = '192.168.0.132:3000';
        link = "http://" + host + "/createpassword/" + sequenceDocument[0]._id;
        mailOptions = {
            to: userEmail,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                response.end("error");
            } else {
                console.log("Message sent: " + response.message);
                res.json('Mail sended');
                // res.end("sent");
            }
        });
    }

    /**
    * main send end
    **/
}



function diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}


async function addPassword(userParam) {
    const user = await User.findById(userParam._id);
    dt1 = new Date();
    dt2 = new Date(user.createdDate);
    if (diff_hours(dt1, dt2) < 1) {
        // hash password if it was entered
        if (userParam.password) {
            userParam.hash = bcrypt.hashSync(userParam.password, 10);
        }
        // copy userParam properties to user
        Object.assign(user, userParam);
        await user.save();
        return 'Password Create successfuly';
    }
}

async function InsertMessage(userParam) {
    messageData = {
        to: userParam.to,
        message: {
            type: userParam.message.type,
            text: userParam.message.text,
            date: userParam.message.date,
            className: userParam.message.className
        },
        from: userParam.from,
        seen: false
    }
    const message = new Message(messageData);
    await message.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);
    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // copy userParam properties to user
    Object.assign(user, userParam);
    await user.save();
}

async function checkImg(id, userImg) {
    const user = await User.find({ _id: id });
    if (user[0].image == userImg) {
        return true
    }
    return false
}

async function MessageSeen(body) {
    await Message.updateMany({
        $and: [{
            to: {
                $in: [
                    body.loginID
                ]
            },
            from: {
                $in: [
                    body.usersID
                ]
            }
        }]
    },
        { $set: { seen: true } })

    await Message.updateMany({
        $and: [{
            to: {
                $in: [
                    body.usersID
                ]
            },
            from: {
                $in: [
                    body.loginID
                ]
            }
        }]
    },
        { $set: { seen: true } })
}

async function acceptRequest(id) {
    await Friend.update({ _id: id }, { status: true });
    const data = await Friend.find({ _id: id });
    return getRequest(data[0].receiverid)
}

async function updateProfile(data, image) {
    if (image == '') {
        await User.update({ _id: data.id },
            {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                phone: data.phone,
                image: data.image,
                about: data.about
            }
        );
    } else {
        await User.update({ _id: data.id },
            {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                phone: data.phone,
                image: image,
                about: data.about
            }
        );
    }

    const user = await User.findOne({ username: data.username });
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
        ...userWithoutHash,
        token
    };
}

async function sendRequest(ids) {
    const friend = new Friend(ids);
    await friend.save();
    return getAll(ids.senderid);
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function deleteRequest(id, loginID, action) {
    await Friend.findByIdAndRemove(id);
    if (action == 'deleterequest') {
        return getRequest(loginID)
    } else {
        return this.getFriends(loginID)
    }
}