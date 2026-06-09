import { testDiagnose } from "./utils/api.ts";

function App() {
  const handleClick = async () => {
    try {
      const result = await testDiagnose();
      console.log(result);
      alert("Success! Check browser console.");
    } catch (error) {
      console.error(error);
      alert("API Error");
    }
  };

  return (
    <div>
      <h1>LiftMind</h1>

      <button onClick={handleClick}>
        Test Backend
      </button>
    </div>
  );
}

export default App;