import { Meteor } from 'meteor/meteor';
// TODO: remove this file
if (Meteor.isClient) {
	module.exports = require('./client');
}
if (Meteor.isServer) {
	module.exports = require('./server');
}
