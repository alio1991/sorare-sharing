import './App.scss';
import { useEffect, useState } from 'react';
import { inicializeStore, playersByUser, users } from '../src/Services/store'
import { filteredAvailablePlayers } from '../src/Services/customLineups'
import { UserTag } from './Components/UserTag/UserTag';
import { PlayerCard } from './Components/PlayerCard/PlayerCard';
import { Lineup } from './Components/Lineup/Lineup';

function App() {

  const [allCards, setallCards] = useState([])
  const [cardsByUser, setcardsByUser] = useState({})


  const [cardsFiltered, setcardsFiltered] = useState([])

  useEffect(() => {
    filteredAvailablePlayers.subscribe((cards) => {setallCards(cards); setcardsFiltered(cards)})
    playersByUser.subscribe(cards => setcardsByUser(cards))
    inicializeStore();
  }, [])

  const onUsetTagSelected = (user, active) => {
    if(active){
      users.next([...users.value, user])
    }else{
      users.next(users.value.filter((userName) => user!==userName))
    }
  }

  return (
    <div className="App">
      <div className="app-header">
        <h1>SORARE SHARING</h1>
        <div className="user-tags">
          {Object.keys(cardsByUser).map((user, i)=> <UserTag onUsetTagSelected={onUsetTagSelected} name={user} cards={cardsByUser[user]} key={i}></UserTag>)}
        </div>
      </div>

      <div className="select-team-section">
        <div className="player-cards">
          {cardsFiltered.sort((a,b)=> b.player.averageScore-a.player.averageScore).map((card, i)=> <PlayerCard cardId={card.id} key={i}></PlayerCard>)}
        </div>
        <div className="lineups">
          <Lineup></Lineup>
          <Lineup></Lineup>
          <Lineup></Lineup>
          <Lineup></Lineup>
          <Lineup></Lineup>
          <Lineup></Lineup>
        </div>
      </div>
    </div>
  );
}

export default App;
