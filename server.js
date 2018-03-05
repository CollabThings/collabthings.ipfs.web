'use strict';

var express 		= require('express'), serveStatic = require('serve-static'); 
const PORT=8000;

var exp = express();
exp.use(express.static("client"));

exp.listen(PORT);
console.log("Listening to port " + PORT);
