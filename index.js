var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var compiler = require("compilex");

var app = express();
app.use(bodyParser());

var options = { stats: true }; //prints stats on console 
compiler.init(options);
app.get("/", function (re, res) {
    res.sendfile(__dirname + "/index.html");
});

app.post("/compilecode", function (req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    if (lang === "C" || lang === "C++") {
        if (inputRadio === "true") {
            var envData = { os: "windows", cmd: "g++", options: { timeout: 100000 } };
            compiler.compileCPPWithInput(envData, code, input, function (data) {
                if (data.error) {
                    res.send(data.error);
                } else {
                    res.send(data.output);
                }
            });
        } else {
            var envData = { os: "windows", cmd: "g++", options: { timeout: 100000 } };
            compiler.compileCPP(envData, code, function (data) {
                res.send(data);
                //data.error = error message
                //data.output = output value
            });
        }
    }
    if (lang === "python") {
        if (inputRadio === "true") {
            var envData = { os: "windows" };
            compiler.compilePythonWithInput(envData, code, input, function (data) {
                res.send(data);
            });
        } else {
            var envData = { os: "windows" };
            compiler.compilePython(envData, code, function (data) {
                res.send(data);
            });
        }
    }
});

app.get("/fullstat", function (req, res) {
    compiler.fullStat(function (data) {
        res.send(data);
    });
});

app.listen(8080);

compiler.flush(function () {
    console.log("All temperory files flushed !");
});