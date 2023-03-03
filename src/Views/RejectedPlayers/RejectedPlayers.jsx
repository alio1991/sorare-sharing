import './RejectedPlayers.scss';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { restoreRejectedPlayer, rejectedPlayers } from '../../../src/Services/customLineups'
import { useEffect, useState } from 'react';

function RejectedPlayers() {

    const [cardsFiltered, setcardsFiltered] = useState([])

    useEffect(() => {
        rejectedPlayers.subscribe((cards) => { setcardsFiltered(cards)})
    }, [])

    return (
        <div className="rejected-players">
            <div className="restore" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev)}>Restaurar</div>

            <div className="player-cards">
            {cardsFiltered.sort((a,b)=> b.player.averageScore-a.player.averageScore).map((card, i)=> <PlayerCard cardId={card.id} key={i}></PlayerCard>)}
            </div>
        </div>
    )

    function handleDragOver(event) {
        event.preventDefault();
      }
    
      function handleDrop(event) {
          const cardId = event.dataTransfer.getData("text/html");
          restoreRejectedPlayer(cardId)
      }

}

export default RejectedPlayers;