import './PlayerCard.scss';
import { allPlayers } from '../../../src/Services/store'
import { useEffect, useState } from 'react';

export function PlayerCard({cardId}){
    const [card, setCard] = useState(null)

    useEffect(()=>{
        allPlayers.subscribe(players=> setCard(players.find(player => player.id===cardId)))
    },[cardId])

    if(card){
        return(
            <div 
                className="player-card"
                draggable="true"
                onDragStart={handleDragStart}
            >
                <h3>{`${card?.player.firstName} ${card?.player.lastName}`}</h3>
                <img src={card?.player.pictureUrl} alt="" />
                <div className={`score ${getScoreColor(card.player.averageScore)}`}>{card.player.averageScore}</div>
                <div className="owner">{card.owner}</div>
            </div>
        );
    }else{
        return ""
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("text/html", card?.id);
    }

    function getScoreColor(score) {
        if(score > 60){
            return 'green'
        }else if(score > 45){
            return 'light-green'
        }else if(score > 30){
            return 'yellow'
        }else if(score > 15){
            return 'orange'
        }else{
            return 'red'
        }
    }
}
