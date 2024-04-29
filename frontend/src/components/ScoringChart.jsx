export default function ScoringChart() {

  const rowNames = [
    'Aces', 
    'Twos',
    'Threes', 
    'Fours',
    'Fives',
    'Sixes',
    'Bonus',
    '3 of a Kind',
    '4 of a Kind',
    'Small Straight',
    'Large Straight',
    'Yahtzee',
    'Chance',
    'Total'
  ];

  const rowElements = rowNames.map(row => (
    <tr key={row}>
      <td className="border border-black px-4 py-2">{row}</td>
      <td className="border border-black px-4 py-2">0</td>
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