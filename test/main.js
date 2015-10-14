'use strict';

var assert = require('assert');
var NextPlayer = require('../index.js');

describe("Next Player", function() {
  var namespace = "32D3354E-716E-11E5-A56E-8A57BE0520A2";
  var nextplayer;

  before(function(done) {
     nextplayer = new NextPlayer({
      keyPrefix: 'test-list-'
    });

    nextplayer.destroy(namespace, done);
  });

  describe("typical interaction", function() {
    it("adds a single player", function(done) {
      nextplayer.add(namespace, 'bob', function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, ['bob']);
        done();
      });
    });

    it("should have one player", function(done) {
      nextplayer.list(namespace, function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, ['bob']);
        done();
      });
    });

    it("should have the correct current player", function(done) {
      nextplayer.current(namespace, function(err, current) {
        assert.ifError(err);
        assert.deepEqual(current, 'bob');
        done();
      });
    });

    it("adds multiple players as an array", function(done) {
      nextplayer.add(namespace, ["sue", "joe", "ron"], function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, ['bob', 'sue', 'joe', 'ron']);
        done();
      });
    });

    it("should have several players", function(done) {
      nextplayer.list(namespace, function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, ['bob', 'sue', 'joe', 'ron']);
        done();
      });
    });

    it("should properly cycle through players", function(done) {
      nextplayer.step(namespace, function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, ['sue', 'joe', 'ron', 'bob']);
        done();
      });
    });

    it("should properly cycle through players AGAIN", function(done) {
      nextplayer.step(namespace, function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, ['joe', 'ron', 'bob', 'sue']);
        done();
      });
    });

    it("should have the correct current player", function(done) {
      nextplayer.current(namespace, function(err, current) {
        assert.ifError(err);
        assert.deepEqual(current, 'joe');
        done();
      });
    });

    it("should handle removing the current player", function(done) {
      nextplayer.remove(namespace, 'joe', function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, ['ron', 'bob', 'sue']);
        done();
      });
    });

    it("should destroy the collection", function(done) {
      nextplayer.destroy(namespace, function(err) {
        assert.ifError(err);
        done();
      });
    });

    it("returns an empty array if no key", function(done) {
      nextplayer.list(namespace, function(err, list) {
        assert.ifError(err);
        assert.deepEqual(list, []);
        done();
      });
    });

    it("returns a null if record doesn't exist", function(done) {
      nextplayer.current(namespace, function(err, current) {
        assert.ifError(err);
        assert.deepEqual(current, null);
        done();
      });
    });
  });
});
