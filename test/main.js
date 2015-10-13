'use strict';

var assert = require('assert');
var NextPlayer = require('../index.js');

describe("Next Player", function() {
  var namespace = "32D3354E-716E-11E5-A56E-8A57BE0520A2";

  beforeAll(function() {
    var nextplayer = new NextPlayer({
      pointerKey: 'current-',
      listKey: 'players-'
    });
  });

  describe("Typical Interaction", function() {
    it("Adds a single player", function(done) {
      nextplayer.add('bob', function(err) {
        assert.equal(err, null);
        done();
      });
    });

    it("Should have one player", function(done) {
      nextplayer.list(function(err, list) {
        assert.equal(err, null);
        assert.deepEqual(list, ['bob']);
        done();
      });
    });

    it("Should have the correct pointer", function(done) {
      nextplayer.current(function(err, current) {
        assert.equal(err, null);
        assert.deepEqual(current, ['bob']);
        done();
      });
    });

    it("Adds multiple players as an array", function(done) {
      nextplayer.add(["sue", "joe", "ron"], function() {
        done();
      });
    });

    it("Should have several players", function(done) {
      nextplayer.list(function(err, list) {
        assert.equal(err, null);
        assert.deepEqual(list, ['bob', 'sue', 'joe', 'ron']);
        done();
      });
    });

    it("Should have the correct pointer", function(done) {
      nextplayer.current(function(err, current) {
        assert.equal(err, null);
        assert.deepEqual(current, ['bob']);
        done();
      });
    });
  });
});
