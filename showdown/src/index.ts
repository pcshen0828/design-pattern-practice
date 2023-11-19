import { AIPlayer } from './AIPlayer';
import { HumanPlayer } from './HumanPlayer';
import { ShowdownGame } from './ShowdownGame';

(async function runGame() {
  const players = [new HumanPlayer(), new HumanPlayer()];
  const game = new ShowdownGame({ players });

  await game.start();
  game.distributeCards();
  await game.takeTurns();
  game.end();
})();
