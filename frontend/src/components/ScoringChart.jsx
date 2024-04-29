export default function ScoringChart(props) {

  const rowElements = props.rows.map(row => (
    <tr key={row.name}>
      <td className="border border-black px-4 py-2">{row.name}</td>
      <td className="border border-black px-4 py-2">
        <button 
          disabled={row.isDisabled}
          onClick={() => props.updateScore(row.name)}
        >
          {row.score}
        </button>
      </td>
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