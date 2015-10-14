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
