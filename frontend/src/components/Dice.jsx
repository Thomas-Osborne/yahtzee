export default function Dice(props) {
  return (
    <button 
      className={`px-5 py-3 m-5 border border-black rounded-lg border-solid ${props.isHeld ? 'bg-red-300' : 'bg-green-300'}`}
      onClick={props.toggleHold}
    >
      <h4 className="font-semibold text-3xl">{props.value}</h4>
    </button>
  );
}