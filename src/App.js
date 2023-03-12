import './App.scss';
import Lineups from './Views/lineups/lineups'
import RejectedPlayers from './Views/RejectedPlayers/RejectedPlayers'
import CardPrices from './Views/CardPrices/CardPrices'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Header  from './Components/Header/Header'
import { inicializeStore } from './Services/store'


function App() {

  inicializeStore();
  return (
    <div className="App">
      <h1>SORARE SHARING</h1>
      <Router>
        <Header></Header>
        <Routes>
            <Route exact path="/" element={<Lineups></Lineups>} />
            <Route path="/rejected" element={<RejectedPlayers></RejectedPlayers>} />
            <Route path="/card-prices" element={<CardPrices></CardPrices>} />
        </Routes>
      </Router>

    </div>
  );

}

export default App;
