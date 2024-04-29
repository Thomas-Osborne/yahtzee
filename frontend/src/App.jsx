import { useState } from 'react';
import { nanoid } from 'nanoid';

import Dice from './components/Dice';
import ScoringChart from './components/ScoringChart';

export default function App() {
  
  const TOTAL_DICE = 5;
  const TOTAL_DICE_FACES = 6;
  const MAXIMUM_ROLLS = 3;

  const [dice, setDice] = useState(initialDiceState());
  const [rollsLeft, setRollsLeft] = useState(MAXIMUM_ROLLS - 1); // first roll occurs automatically

  const rows = [
    {
      name: 'Aces',
      isDisabled: false,
      scoringFunction: () => scoreDigits(1),
      score: 0,
    },
    {
      name: 'Twos',
      isDisabled: false,
      scoringFunction: () => scoreDigits(2),
      score: 0,
    },
    {
      name: 'Threes',
      isDisabled: false,
      scoringFunction: () => scoreDigits(3),
      score: 0,
    },
    {
      name: 'Fours',
      isDisabled: false,
      scoringFunction: () => scoreDigits(4),
      score: 0,
    },
    {
      name: 'Fives',
      isDisabled: false,
      scoringFunction: () => scoreDigits(5),
      score: 0,
    },
    {
      name: 'Sixes',
      isDisabled: false,
      scoringFunction: () => scoreDigits(6),
      score: 0,
    },
    {
      name: 'Bonus',
      isDisabled: true,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Three of a Kind',
      isDisabled: false,
      scoringFunction: () => scoreOfAKind(3, scoreSum(dice)),
      score: 0,
    },
    {
      name: 'Four of a Kind',
      isDisabled: false,
      scoringFunction: () => scoreOfAKind(4, scoreSum(dice)),
      score: 0,
    },
    {
      name: 'Full House',
      isDisabled: false,
      scoringFunction: () => scoreFullHouse(3, 2, 20),
      score: 0,
    },
    {
      name: 'Small Straight',
      isDisabled: false,
      scoringFunction: () => scoreStraight(4, 30),
      score: 0,
    },
    {
      name: 'Large Straight',
      isDisabled: false,
      scoringFunction: () => scoreStraight(5, 40),
      score: 0,
    },
    {
      name: 'Yahtzee',
      isDisabled: false,
      scoringFunction: () => scoreOfAKind(4, 50), // Yahtzee scores 50 points
      score: 0,
    },
    {
      name: 'Chance',
      isDisabled: false,
      scoringFunction: () => scoreSum(dice),
      score: 0,
    },
    {
      name: 'Total',
      isDisabled: true,
      scoringFunction: null,
      score: 0,
    }
  ];

  function scoreSum(subDice) {
    return (
      subDice.map(die => die.value)
        .reduce((a, b) => a + b, 0)
    );
  }

  function scoreDigits(value) {
    const filteredByValue = dice.filter(die => die.value === value);
    return scoreSum(filteredByValue);
  }

  function scoreOfAKind(quantity, points) {
    let maximumOccurrences = 0;

    for (let i = 1; i <= TOTAL_DICE_FACES; i++) {
      const ithOccurrences = dice.filter(die => die.value === i).length;
      if (ithOccurrences > maximumOccurrences) {
        maximumOccurrences = ithOccurrences;
      }
    }

    return maximumOccurrences >= quantity ? points : 0;
  }

  function scoreFullHouse(maximumQuantity, secondMaximumQuantity, points) {
    let maximumOccurences = 0;
    let secondMaximumOccurences = 0;

    for (let i = 1; i <= TOTAL_DICE_FACES; i++) {
      const ithOccurences = dice.filter(die => die.value === i).length;
      if (ithOccurences >= maximumOccurences) {
        secondMaximumOccurences = maximumOccurences;
        maximumOccurences = ithOccurences;
      } else if (ithOccurences > secondMaximumOccurences) {
        secondMaximumOccurences = ithOccurences;
      }
    }
  
    return (
      maximumOccurences >= maximumQuantity && secondMaximumOccurences >= secondMaximumQuantity 
        ? points
        : 0
    );

  }

  function scoreStraight(quantity, points) {
    const sortedUniqueDice = [... new Set(dice.map(dice => dice.value))]
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




  function initialDiceState() {
    const array = Array.from({ length: TOTAL_DICE });
    return array.map(_ => rollSingleDice()); // eslint-disable-line no-unused-vars
  }

  function rollDice() {
    setDice(prevDice => prevDice.map(die => {
      return die.isHeld ? die : rollSingleDice();
    }));
    setRollsLeft(prevRolesLeft => prevRolesLeft - 1);
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
      <div className="flex flex-row justify-center">
        <ScoringChart rows={rows}/>
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
