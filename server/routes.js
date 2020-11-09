const express = require("express");
const connectdb = require("./dbconnect");
const Chats = require("./schemas/ChatModel");

const router = express.Router();

router.route("/").get((req, res, next) =>  {
        res.setHeader("Content-Type", "application/json");
        res.statusCode  =  200;
        connectdb.then(db  =>  {
            Chats.find({}).then(chat  =>  {
                console.log(chat)
            res.json(chat);
        });
    });
});

module.exports = router;