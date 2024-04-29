import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import Dice from './components/Dice';

export default function App() {
  
  const TOTAL_DICE = 5;
  const TOTAL_DICE_FACES = 6;

  const [dice, setDice] = useState(initialDiceState());

  useEffect(() => {
    rollDice(dice);
  }, []);

  function initialDiceState() {
    const array = Array.from({ length: TOTAL_DICE });
    return array.map(element => rollSingleDice());
  }

  function rollDice() {
    setDice(prevDice => prevDice.map(die => {
      return die.isHeld ? die : rollSingleDice();
    }));
  }

  function rollSingleDice() {
    const newDie = {id: nanoid(), value: getRandomNumber(), isHeld: false};
    return newDie;
  }

  function getRandomNumber() {
    return Math.floor(Math.random() * TOTAL_DICE_FACES) + 1;
  }
  
  function holdDice(id) {
    setDice(prevDice => prevDice.map(die => (
      die.id === id ? {...die, isHeld: !die.isHeld} : die
    )));

  }

  const diceElements = dice.map(die => <Dice key={die.id} value={die.value} isHeld={die.isHeld} toggleHold={() => holdDice(die.id)}/>);

  return (
    <>
      <h1 className="font-semibold text-blue-500 text-5xl text-center p-3">Yahtzee</h1>
      <div className="flex flex-wrap justify-center">
        {diceElements}
      </div>
      <div className="flex flex-wrap justify-center">
        <button 
          className="rounded-lg border border-black bg-green-300 px-3 py-2"
          onClick={rollDice}
        >
          Roll Dice
        </button>
      </div>
    </>
  );
}
