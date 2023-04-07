import logo from './logo.svg';
import './App.css';
import GameHandler from "./Components/GameHandler/GameHandler";
import Tester from "./tester";



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameHandler/>
        {/*<Tester/>*/}
      </header>
    </div>
  );
}

export default App;
