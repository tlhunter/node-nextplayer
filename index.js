'use strict';

var Redis = require('redis');

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
    .lpush(key, players)
    .lrange(key, 0, -1)
    .exec(function(err, results) {
      if (err) {
        return callback(err);
      }

      results[1].reverse();

      callback(null, results[1]);
  });
};

NextPlayer.prototype.set = function(namespace, players, callback) {
  var key = this._key(namespace);

  this.redis
    .multi()
    .del(key)
    .lpush(key, players)
    .lrange(key, 0, -1)
    .exec(function(err, results) {
      if (err) {
        return callback(err);
      }

      results[2].reverse();

      callback(null, results[2]);
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

      results[1].reverse();

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

      results[1].reverse();

      callback(null, results[1]);
  });
};

NextPlayer.prototype.destroy = function(namespace, callback) {
  var key = this._key(namespace);

  this.redis.del(key, function(err, count) {
    if (err) {
      return callback(err);
    }

    callback(null);
  });
};

NextPlayer.prototype.list = function(namespace, callback) {
  var key = this._key(namespace);

  this.redis.lrange(key, 0, -1, function(err, list) {
    if (err) {
      return callback(err);
    }

    list.reverse();

    callback(null, list);
  });
};

NextPlayer.prototype.current = function(namespace, callback) {
  var key = this._key(namespace);

  this.redis.lrange(key, -1, -1, function(err, list) {
    if (err) {
      return callback(err);
    }

    list.reverse();

    callback(null, list[0]);
  });
};

module.exports = NextPlayer;
