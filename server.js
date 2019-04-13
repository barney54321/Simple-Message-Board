var express = require("express");

var mysql = require("mysql");
var bodyParser = require("body-parser");

var app = express();

var http = require("http").Server(app);

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(__dirname));

app.get('/messages', (req, res) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "messages_database"
    })

    const queryString = 'SELECT * FROM messages'
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log(err.errno);
            res.sendStatus(500);
            return
        } 
        var messages = new Array();
        var s = 0;
        for (var i = 0; i < rows.length; i++) {
            messages[i] = {
                name: rows[i].name,
                message: rows[i].message
            };
        }
        var m = {
            mes: messages
        }
        res.send(m);
    })
})

app.post('/messages', (req, res) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "messages_database"
    })

    var name = req.body.name;
    var message = req.body.message;

    const queryString = "INSERT INTO messages (name, message) VALUES ('"+name+"', '"+message+"')"
    connection.query(queryString, (err, results, fields) => {
        if (err) {
            console.log("Failed to insert new user");
            console.log(err);
            res.sendStatus(500);
            return
        } 
        io.emit("message", req.body);
        res.sendStatus(200);
    })
  })

var server = app.listen(3000, () => {
    console.log("server is running on port", server.address().port);
});

var io = require('socket.io').listen(server);
io.on("connection", () =>{
    console.log("a user is connected")
})