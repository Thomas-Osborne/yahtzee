import { useState } from 'react';
import { nanoid } from 'nanoid';

import Dice from './components/Dice';
import ScoringChart from './components/ScoringChart';

export default function App() {
  
  const TOTAL_DICE = 5;
  const TOTAL_DICE_FACES = 6;
  const MAXIMUM_ROLLS = 3;
  const upper = {threshold: 63, bonus: 35};

  const [gameState, setGameState] = useState({
    dice: initialDiceState(),
    rollsLeft: MAXIMUM_ROLLS - 1, // first roll occurs immediately
    isEnded: false,
  });

  const [rows, setRows] = useState(initialRowState());

  function scoreSum(scoringDice) {
    return (
      scoringDice.map(die => die.value)
        .reduce((a, b) => a + b, 0)
    );
  }

  function scoreDigits(dice, value) {
    const filteredByValue = dice.filter(die => die.value === value);
    return scoreSum(filteredByValue);
  }

  function scoreOfAKind(dice, quantity, points) {
    // Iterates through to find the largest number of duplicates in the array
    let maximumOccurrences = 0;

    for (let i = 1; i <= TOTAL_DICE_FACES; i++) {
      const ithOccurrences = dice.filter(die => die.value === i).length;
      if (ithOccurrences > maximumOccurrences) {
        maximumOccurrences = ithOccurrences;
      }
    }
    
    return maximumOccurrences >= quantity ? points : 0;
  }

  function scoreFullHouse(dice, maximumQuantity, secondMaximumQuantity, points) {
    // Finds the biggest and second biggest amounts of any (distinct) numbers to check that a full house is viable
    let maximumOccurrences = 0;
    let secondMaximumOccurrences = 0;

    for (let i = 1; i <= TOTAL_DICE_FACES; i++) {
      const ithOccurrences = dice.filter(die => die.value === i).length;
      if (ithOccurrences >= maximumOccurrences) {
        secondMaximumOccurrences = maximumOccurrences;
        maximumOccurrences = ithOccurrences;
      } else if (ithOccurrences > secondMaximumOccurrences) {
        secondMaximumOccurrences = ithOccurrences;
      }
    }
  
    return (
      maximumOccurrences >= maximumQuantity && secondMaximumOccurrences >= secondMaximumQuantity 
        ? points
        : 0
    );

  }

  function scoreStraight(dice, quantity, points) {
    const sortedUniqueDice = [... new Set(dice.map(die => die.value))]
      .sort((a, b) => a - b); // Set in spread operator gives only unique values before sorting

    // Base case where there are too many duplicate dice values
    if (sortedUniqueDice.length < quantity) {
      return 0;
    }

    // Check consecutive dice values
    for (let i = 0; i <= sortedUniqueDice.length - quantity; i++) {
      let straightFound = true;
      for (let j = 1; j < quantity; j++) {
        if (sortedUniqueDice[i + j] !== sortedUniqueDice[i] + j) {
          straightFound = false;
          break;
        }
      }
      if (straightFound) {
        return points;
      }
    }
    return 0;
  }

  function chooseCategory(chosenRow) {
    let newRows = rows.map(row => {
      if (row.name === chosenRow.name) {
        const newScore = row.scoringFunction(gameState.dice);
        return { ...row, isDisabled: true, score: newScore };
      } else {
        return row;
      }
    });
  
    const bonus = calculateBonus(newRows);
    const total = calculateTotal(newRows);
  
    newRows = newRows.map(row => {
      if (row.name === 'Bonus') {
        return { ...row, score: bonus };
      } else if (row.name === 'Total') {
        return { ...row, score: total };
      } else {
        return row;
      }
    });
  
    setRows(newRows);
  
    setGameState(prevGameState => ({
      ...prevGameState,
      dice: initialDiceState(),
      rollsLeft: MAXIMUM_ROLLS - 1,
      isEnded: isGameOver(newRows)
    }));
  }

  function calculateBonus(newRows) {
    const upperRows = ['Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
    const sumUpperValues = newRows
      .filter(row => upperRows.includes(row.name))
      .map(row => row.score)
      .reduce((a, b) => a + b, 0);


    if (sumUpperValues >= upper.threshold) {
      return upper.bonus;
    } else {
      return 0;
    }

  }

  function calculateTotal(newRows) {
    const sumRowValues = newRows
      .filter(row => row.isCategory)
      .map(row => row.score)
      .reduce((a, b) => a + b, 0);

    return sumRowValues;
  }

  function isGameOver(newRows) {
    if (newRows.filter(row => !row.isDisabled).length > 0) {
      return false;
    } else {
      return true;
    }
  }


  function initialDiceState() {
    const array = Array.from({ length: TOTAL_DICE });
    return array.map(element => rollSingleDice()); // eslint-disable-line no-unused-vars
  }

  function initialRowState() {
    return (
      [
        {
          name: 'Aces',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreDigits(dice, 1),
          score: 0,
        },
        {
          name: 'Twos',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreDigits(dice, 2),
          score: 0,
        },
        {
          name: 'Threes',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreDigits(dice, 3),
          score: 0,
        },
        {
          name: 'Fours',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreDigits(dice, 4),
          score: 0,
        },
        {
          name: 'Fives',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreDigits(dice, 5),
          score: 0,
        },
        {
          name: 'Sixes',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreDigits(dice, 6),
          score: 0,
        },
        {
          name: 'Bonus',
          isCategory: false,
          isDisabled: true,
          scoringFunction: null,
          score: 0,
        },
        {
          name: 'Three of a Kind',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreOfAKind(dice, 3, scoreSum(dice)),
          score: 0,
        },
        {
          name: 'Four of a Kind',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreOfAKind(dice, 4, scoreSum(dice)),
          score: 0,
        },
        {
          name: 'Full House',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreFullHouse(dice, 3, 2, 25),
          score: 0,
        },
        {
          name: 'Small Straight',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreStraight(dice, 4, 30),
          score: 0,
        },
        {
          name: 'Large Straight',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreStraight(dice, 5, 40),
          score: 0,
        },
        {
          name: 'Yahtzee',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreOfAKind(dice, 4, 50), // Yahtzee scores 50 points
          score: 0,
        },
        {
          name: 'Chance',
          isCategory: true,
          isDisabled: false,
          scoringFunction: (dice) => scoreSum(dice),
          score: 0,
        },
        {
          name: 'Total',
          isCategory: false,
          isDisabled: true,
          scoringFunction: null,
          score: 0,
        }
      ]
    );
  }

  function rollDice() {
    setGameState(prevGameState => ({
      ...prevGameState,
      dice: prevGameState.dice.map(die => {
        return die.isHeld ? die : rollSingleDice();
      }),
      rollsLeft: prevGameState.rollsLeft - 1
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
    setGameState(prevGameState => ({
      ...prevGameState,
      dice: prevGameState.dice.map(die => (
        die.id === id ? {...die, isHeld: !die.isHeld} : die
      ))
    }));
  }

  function resetGame() {
    setGameState({
      dice: initialDiceState(),
      rollsLeft: MAXIMUM_ROLLS - 1, // first roll occurs immediately
      isEnded: false,
    });

    setRows(initialRowState());
  }

  const diceElements = gameState.dice.map(die => <Dice key={die.id} value={die.value} isHeld={die.isHeld} toggleHold={() => holdDice(die.id)}/>);

  return (
    <>
      <h1 className="font-semibold text-blue-500 text-5xl text-center p-3">Yahtzee</h1>
      <div className="flex flex-row justify-center">
        <ScoringChart rows={rows} chooseCategory={chooseCategory}/>
        <div>
          <div className="flex flex-wrap">
            {diceElements}
          </div>
          <div className="text-center">
            {gameState.isEnded && <h6 className="py-1">Game over!</h6>}
            <button 
              className="rounded-lg border border-black bg-green-300 disabled:bg-gray-300 disabled:text-slate-500 px-3 py-2"
              onClick={
                gameState.isEnded 
                  ? resetGame
                  : rollDice
              }
              disabled={gameState.rollsLeft <= 0}
            >
              {gameState.isEnded 
                ?
                <div>
                  <h5>Play Again</h5>
                </div>
                :
                <div>
                  <h5>Roll Dice</h5>
                  <p className="text-xs">{gameState.rollsLeft} of {MAXIMUM_ROLLS} left</p>
                </div>
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
