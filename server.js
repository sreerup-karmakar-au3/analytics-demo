var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
require('dotenv').config();

var app = express();
var db;

app.use(express.static(__dirname + "/assets"));
app.use(bodyParser.json());

mongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true }, function(error, client) {
    if(error)
        throw error;
    db = client.db('test');
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/create-cookie", (req, res) => {
    db.collection('devices').insertOne({cid: req.body.cid}, function(error, result) {
        if(error) {
            throw error;
        }
        res.json({ success: "Cookie Created" });
    });
    
});

app.post("/set-location/:cid", (req, res) => {
    db.collection('devices').updateOne({cid: req.params.cid}, {$set: req.body}, function(error, result) {
        if(error) {
            throw error;
        }
        res.json({ success: "Location captured" });
    });
});

app.post("/set-device-details/:cid", (req, res) => {
    db.collection('devices').updateOne({cid: req.params.cid}, {$set: req.body}, function(error, result) {
        if(error) {
            throw error;
        }
        res.json({ success: "Device details recorded" });
    });
});

app.post("/add-info/:cid", (req, res) => {
    db.collection('devices').updateOne({cid: req.params.cid}, {$set: {details: req.body}}, function(error, result) {
        if(error) {
            throw error;
        }
        res.json({ success: "User information collected" });
    });
});

app.listen(process.env.PORT || 4000);
