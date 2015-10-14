# NextPlayer

NextPlayer is a tool for keeping track of whose turn it is, Round Robin style.
Players can be added or removed at will.
NextPlayer relies on Redis for tracking data.
This is a very generic module, it can be used for anything which needs to track Round Robin data where entries can be dynamically added and removed.
Operations are  atomic, relying on Redis MULTI calls.

If there's an existing module which does the same thing please let me know!

## Example Usage

```javascript
var NextPlayer = require('./index.js');
var nextplayer = new NextPlayer();
var ns = "game-12345";

nextplayer.add(ns, ["Larry", "Curly", "Shemp", "Moe"], function(err, list) {
  console.log('ADD', list); // Larry, Curly, Shemp, Moe
  nextplayer.remove(ns, "Shemp", function(err, list) {
    console.log('REMOVE', list); // Larry, Curly, Moe
    nextplayer.step(ns, function(err, list) {
      console.log('STEP1', list); // Curly, Moe, Larry
      nextplayer.step(ns, function(err, list) {
        console.log('STEP2', list); // Moe, Larry, Curly
        nextplayer.list(ns, function(err, list) {
          console.log('LIST', list); // Moe, Larry, Curly
          nextplayer.destroy(ns, function(err) {
            console.log('FIN');
            process.exit();
          });
        });
      });
    });
  });
});
```

## Methods

Note: If you don't provide a callback, each method will return a Promise.

### Constructor

Creates a new instance of NextPlayer. An instance isn't tied to a particular game, think of it as a reusable service. Instead it's tied to a particular Redis key naming convention.

#### Options

* **keyPrefix**: A List key representing the list of all players
* **redis**: (Optional) A fully configured and instantiated redis client
* **redisOptions**: (Optional) A list of redis connection options, defaults to local

#### Example

```javascript
var nextplayer = new NextPlayer({
  keyPrefix: 'list-',
  redis: redis.createClient({host: 'localhost', port: 6370})
});
```

### add()

If an array is provided, inserts a list of players to go last. Otherwise, adds a single player.

#### Example

```javascript
nextplayer.add(namespace, "tod", callback);
nextplayer.add(namespace, ["bev", "jim"], callback);
```

### remove()

If an array is provided, removes each of the listed players. Otherwise, removes a single player.

#### Example

```javascript
nextplayer.remove(namespace, "ted", callback);
nextplayer.remove(namespace, ["dan", "dre"], callback);
```

### step()

Iterates to the next player in the list. Of course, if this is the end of the list, it will wrap back to the beginning.

#### Example

```javascript
nextplayer.step(namespace, callback);
```

### list()

Gets a list of all players, starting with the current player.

```javascript
nextplayer.list(namespace, callback);
```

### destroy()

Destroys all keys associated with the provided namespace. Doesn't destroy the NextPlayer instance.

```javascript
nextplayer.destroy(namespace, callback);
```

## Installation

```bash
npm install nextplayer
```
