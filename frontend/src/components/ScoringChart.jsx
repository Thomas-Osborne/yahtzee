export default function ScoringChart() {

  const rowNames = [
    {
      name: 'Aces',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Twos',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Threes',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Fours',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Fives',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Sixes',
      isDisabled: false,
      scoringFunction: null,
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
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Four of a Kind',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Full House',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Small Straight',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Large Straight',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Yahtzee',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Chance',
      isDisabled: false,
      scoringFunction: null,
      score: 0,
    },
    {
      name: 'Total',
      isDisabled: true,
      scoringFunction: null,
      score: 0,
    }
  ];

  const rowElements = rowNames.map(row => (
    <tr key={row.name}>
      <td className="border border-black px-4 py-2">{row.name}</td>
      <td className="border border-black px-4 py-2"><button disabled={row.isDisabled}>0</button></td>
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>
          <th className="border border-black px-4 py-2">Type</th>
          <th className="border border-black px-4 py-2">Score</th>
        </tr>
      </thead>
      <tbody>
        {rowElements}
      </tbody>
    </table>
  );
}