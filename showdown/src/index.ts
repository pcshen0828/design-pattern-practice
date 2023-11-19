import { AIPlayer } from './AIPlayer';
import { HumanPlayer } from './HumanPlayer';
import { ShowdownGame } from './ShowdownGame';

(async function runGame() {
  const players = [new HumanPlayer(), new HumanPlayer()];
  const game = new ShowdownGame({ players });

  game.start();
  game.distributeCards();
  game.takeTurns();
  game.end();
})();
