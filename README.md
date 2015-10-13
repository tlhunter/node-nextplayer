# NextPlayer

NextPlayer is a tool for keeping track of whose turn it is, Round Robin style. Players can be added or removed at will. NextPlayer relies on Redis for tracking data. This is a very generic module, it can be used for anything which needs to track Round Robin data where entries can be dynamically added and removed. All operations will be atomic, relying on Redis EVAL scripts.

If there's an existing module which does the same thing please let me know!

## Example Scenario

### If you add four players:

```
Action:     add(Bob, Joe, Sue, Sam);
Internal:   Bob, Joe, Sue, Sam
Pointer:    Bob
Returns:    Bob, Joe, Sue, Sam
```

### Then you step the game:

```
Action:     step()
Internal:   Bob, Joe, Sue, Sam
Pointer:    Joe
Returns:    Joe, Sue, Sam, Bob
```

### Then you remove the current player:

```
Action:     remove(Joe)
Internal:   Bob, Sue, Sam
Pointer:    Sue
Returns:    Sue, Sam, Bob
```

### And if you add another player:

```
Action:     add(Jan)
Internal:   Bob, Jan, Sue, Sam
Pointer:    Sue
Returns:    Sue, Sam, Bob, Jan
```

## Sample Usage

```javascript
var NextPlayer = require('nextplayer');
var nextplayer = new NextPlayer();
var ns = "game-12345";

nextplayer.add(ns, ["bob", "joe", "sue", "tom"], function(err) {
  nextplayer.remove(ns, "joe", function(err, current, list) {
    console.log(current); // "bob"
    console.log(list); // ["bob", "sue", "tom"];
    nextplayer.step(ns, function(err, current) {
      console.log(current); // "sue"
      nextplayer.list(ns, function(err, list) {
        console.log(list); // ["sue", "tom", "bob"]
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

* **pointerKey**: A String key representing the ID of the current player
* **listKey**: A List key representing the list of all players

#### Example

```javascript
var nextplayer = new NextPlayer({
  pointerKey: 'current-',
  listKey: 'players-'
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
