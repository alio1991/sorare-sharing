import './lineups.scss';
import { playersByUser, users } from '../../../src/Services/store'
import { filteredAvailablePlayers, rejectFromAvailables, lineups, addNewLineup } from '../../../src/Services/customLineups'
import { UserTag } from '../../Components/UserTag/UserTag';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { Lineup } from '../../Components/Lineup/Lineup';
import { useEffect, useState } from 'react';

function Lineups() {

    const [cardsByUser, setcardsByUser] = useState({})
    const [cardsFiltered, setcardsFiltered] = useState([])
    const [localLineups, setlocalLineups] = useState([{id: 1}])
  
    useEffect(() => {
      filteredAvailablePlayers.subscribe((cards) => { setcardsFiltered(cards)})
      playersByUser.subscribe(cards => setcardsByUser(cards))
      lineups.subscribe(lineups => {setlocalLineups(lineups)})
    }, [])
  
    const onUsetTagSelected = (user, active) => {
      if(active){
        users.next([...users.value, user])
      }else{
        users.next(users.value.filter((userName) => user!==userName))
      }
    }
  
    return (
      <div className="lineups-view">
        <div className="app-header">
          <div className="app-subheader">
            <div className="user-tags">
              {Object.keys(cardsByUser).map((user, i)=> <UserTag onUsetTagSelected={onUsetTagSelected} name={user} cards={cardsByUser[user]} key={i}></UserTag>)}
            </div>
            <div className="rubbish" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev)}>Apartar</div>
          </div>
        </div>
  
        <div className="select-team-section">
          <button onClick={()=> addNewLineup(localLineups.length+1)}>AddLineup</button>
          <div className="player-cards">
            {cardsFiltered.sort((a,b)=> b.player.averageScore-a.player.averageScore).map((card, i)=> <PlayerCard cardId={card.id} key={i}></PlayerCard>)}
          </div>
          <div className="lineups">
            {localLineups.map((elem) => <Lineup id={elem.id} key={elem.id}></Lineup>)}
          </div>
        </div>
      </div>
    );
  
    function handleDragOver(event) {
      event.preventDefault();
    }
  
    function handleDrop(event) {
        const cardId = event.dataTransfer.getData("text/html");
        rejectFromAvailables(cardId)
    }

  }
  
  export default Lineups;
  