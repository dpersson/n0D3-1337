require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '/deps/express/lib');

var sys   = require('sys');
var fs    = require('fs');
var mongo = require('deps/node-mongodb-native/lib/mongodb');

require('express');
require('express/plugins');


