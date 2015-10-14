'use strict';

var Redis = require('redis');
var bluebird = require('bluebird');

if (typeof Promise === 'undefined') {
  Promise = bluebird;
}

var NextPlayer = function(config) {
  if (!config) {
    config = {};
  }

  this.keyPrefix = config.keyPrefix || 'list-';

  this.redis = config.redis ? config.redis : Redis.createClient(config.redisOptions);
};

NextPlayer.prototype._key = function(namespace) {
 return this.keyPrefix + namespace;
};

NextPlayer.prototype.add = function(namespace, players, callback) {
  var key = this._key(namespace);

  this.redis
    .multi()
    .rpush(key, players)
    .lrange(key, 0, -1)
    .exec(function(err, results) {
      if (err) {
        return callback(err);
      }

      callback(null, results[1]);
  });
};

NextPlayer.prototype.remove = function(namespace, player, callback) {
  var key = this._key(namespace);

  this.redis
    .multi()
    .lrem(key, 0, player)
    .lrange(key, 0, -1)
    .exec(function(err, results) {
      if (err) {
        return callback(err);
      }

      callback(null, results[1]);
  });
};

NextPlayer.prototype.step = function(namespace, callback) {
  var key = this._key(namespace);

  this.redis
    .multi()
    .rpoplpush(key, key)
    .lrange(key, 0, -1)
    .exec(function(err, results) {
      if (err) {
        return callback(err);
      }

      callback(err, results[1]);
  });
};

NextPlayer.prototype.destroy = function(namespace, callback) {
  var key = this._key(namespace);

  this.redis.del(key, function(err, count) {
    if (err || count !== 1) {
      return callback(err || true);
    }

    callback(err);
  });
};

NextPlayer.prototype.list = function(namespace, callback) {
  var key = this._key(namespace);

  this.redis.lrange(key, 0, -1, function(err, list) {
    callback(err, list);
  });
};

NextPlayer.prototype.current = function(namespace, callback) {
  var key = this._key(namespace);

  this.redis.lrange(key, 0, 1, function(err, list) {
    callback(err, list[0]);
  });
};

module.exports = NextPlayer;
