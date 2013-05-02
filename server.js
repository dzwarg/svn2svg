var express = require('express'),
    app = express();

app.get('/', function(req, rsp) {
    rsp.send("Hello World");
});

app.listen(process.env.PORT);

console.log("Listening at " + process.env.IP + ":" + process.env.PORT);