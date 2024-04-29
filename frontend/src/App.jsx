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
    rollsLeft: MAXIMUM_ROLLS - 1
  });

  const [rollsLeft, setRollsLeft] = useState(MAXIMUM_ROLLS - 1); // first roll occurs automatically

  const [rows, setRows] = useState([
    {
      name: 'Aces',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreDigits(1),
      score: 0,
    },
    {
      name: 'Twos',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreDigits(2),
      score: 0,
    },
    {
      name: 'Threes',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreDigits(3),
      score: 0,
    },
    {
      name: 'Fours',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreDigits(4),
      score: 0,
    },
    {
      name: 'Fives',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreDigits(5),
      score: 0,
    },
    {
      name: 'Sixes',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreDigits(6),
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
      scoringFunction: () => scoreOfAKind(3, scoreSum(gameState.dice)),
      score: 0,
    },
    {
      name: 'Four of a Kind',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreOfAKind(4, scoreSum(gameState.dice)),
      score: 0,
    },
    {
      name: 'Full House',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreFullHouse(3, 2, 25),
      score: 0,
    },
    {
      name: 'Small Straight',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreStraight(4, 30),
      score: 0,
    },
    {
      name: 'Large Straight',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreStraight(5, 40),
      score: 0,
    },
    {
      name: 'Yahtzee',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreOfAKind(4, 50), // Yahtzee scores 50 points
      score: 0,
    },
    {
      name: 'Chance',
      isCategory: true,
      isDisabled: false,
      scoringFunction: () => scoreSum(gameState.dice),
      score: 0,
    },
    {
      name: 'Total',
      isCategory: false,
      isDisabled: true,
      scoringFunction: null,
      score: 0,
    }
  ]);

  function scoreSum(scoringDice) {
    return (
      scoringDice.map(die => die.value)
        .reduce((a, b) => a + b, 0)
    );
  }

  function scoreDigits(value) {
    const filteredByValue = gameState.dice.filter(die => die.value === value);
    return scoreSum(filteredByValue);
  }

  function scoreOfAKind(quantity, points) {
    let maximumOccurrences = 0;

    for (let i = 1; i <= TOTAL_DICE_FACES; i++) {
      const ithOccurrences = gameState.dice.filter(die => die.value === i).length;
      if (ithOccurrences > maximumOccurrences) {
        maximumOccurrences = ithOccurrences;
      }
    }
    
    return maximumOccurrences >= quantity ? points : 0;
  }

  function scoreFullHouse(maximumQuantity, secondMaximumQuantity, points) {
    let maximumOccurrences = 0;
    let secondMaximumOccurrences = 0;

    for (let i = 1; i <= TOTAL_DICE_FACES; i++) {
      const ithOccurrences = gameState.dice.filter(die => die.value === i).length;
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

  function scoreStraight(quantity, points) {
    const sortedUniqueDice = [... new Set(gameState.dice.map(dice => dice.value))]
      .sort((a, b) => a - b); // Set in spread operator gives only unique values before sorting

    // Base case where there are too many duplicate dice values
    if (sortedUniqueDice.length < quantity) {
      return 0;
    }

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
        const newScore = row.scoringFunction();
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
  
    setGameState({
      dice: initialDiceState(),
      rollsLeft: MAXIMUM_ROLLS - 1
    });
    setRollsLeft(2);
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


  function initialDiceState() {
    const array = Array.from({ length: TOTAL_DICE });
    return array.map(element => rollSingleDice()); // eslint-disable-line no-unused-vars
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
          <div className="flex justify-center">
            <button 
              className="rounded-lg border border-black bg-green-300 disabled:bg-gray-300 disabled:text-slate-500 px-3 py-2"
              onClick={rollDice}
              disabled={rollsLeft <= 0}
            >
              <h5>Roll Dice</h5>
              <p className="text-xs">{rollsLeft} of {MAXIMUM_ROLLS} left</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
