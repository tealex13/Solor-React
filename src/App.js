import logo from './logo.svg';
import './App.css';
import Game from "./Components/Game/Game.js";
import Tester from "./tester";



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game/>
        {/*<Tester/>*/}
      </header>
    </div>
  );
}

export default App;
