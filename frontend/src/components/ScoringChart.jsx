export default function ScoringChart(props) {

  const rowElements = props.rows.map(row => (
    <tr key={row.name}>
      <td className={
        `px-4 py-2 border-black
        ${row.isCategory && row.isDisabled ? 'bg-gray-300 text-slate-500' : row.isDisabled ? 'bg-blue-300 text-2xl font-semibold' : 'bg-green-200'}
        ${row.isCategory ? 'border border-solid' : ' border-y-2 border-l-2'}
        `}
      >
        {row.name}
      </td>
      <td className={
        `px-4 py-2 border-black
        ${row.isCategory && row.isDisabled ? 'bg-gray-300 text-slate-500' : row.isDisabled ? 'bg-blue-300 text-2xl font-semibold' : 'bg-green-200'}
        ${row.isCategory ? 'border border-solid' : ' border-y-2 border-r-2'}
        `}
      >
        <button 
          disabled={row.isDisabled}
          onClick={() => props.chooseCategory(row)}
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