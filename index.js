'use strict';

var redis = require('redis');
var bluebird = require('bluebird');
var lured = require('lured');

if (typeof Promise === 'undefined') {
  Promise = bluebird;
}

var NextPlayer = function(config) {
  if (!config) {
    config = {};
  }

  this.pointerKey = config.pointerKey || 'current-';
  this.listKey = config.listKey || 'list-';
};

NextPlayer.prototype._getPointerKey = function(namespace) {
  return this.pointerKey + namespace;
};

NextPlayer.prototype._getListKey = function(namespace) {
 return this.listKey + namespace;
};

NextPlayer.prototype.add = function(namespace, players, callback) {
  callback(null);
};

NextPlayer.prototype.remove = function(namespace, players, callback) {
  var list = [];
  var current = '';
  var currentChanged = false;

  callback(null, {
    list: list,
    current: current,
    currentChanged: currentChanged
  });
};

NextPlayer.prototype.step = function(namespace, callback) {
  var current = '';

  callback(null, current);
};

NextPlayer.prototype.destroy = function(namespace, callback) {
  callback(null);
};

NextPlayer.prototype.list = function(namespace, callback) {
  var list = [];

  callback(null, list);
};

nextPlayer.prototype.current = function(namespace, callback) {
  var current = '';

  callback(null, current);
};
