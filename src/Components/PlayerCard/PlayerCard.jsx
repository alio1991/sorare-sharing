import './PlayerCard.scss';
import { allPlayers } from '../../../src/Services/store'
import { useEffect, useState } from 'react';

export function PlayerCard({cardId, wholeCard}){
    const [card, setCard] = useState(null)

    useEffect(()=>{
        allPlayers.subscribe(players=> setCard(players.find(player => player.id===cardId)))
    },[cardId])

    if(card){
        return(
            <div 
                className={`player-card ${card.positionTyped.toLowerCase()}-border`}
                draggable="true"
                onDragStart={handleDragStart}
            >
                <h3>{`${card?.player.firstName} ${card?.player.lastName}`}</h3>
                <img src={card?.player.pictureUrl} alt="" />
                <div className={`score ${getScoreColor(card.player.averageScore)}`}>{card.player.averageScore}</div>
                <div className="owner">{card.owner}</div>
                {card.player?.activeNationalTeam?.pictureUrl && <div className="country"> <img src={card.player?.activeNationalTeam?.pictureUrl} alt={card.player?.activeNationalTeam?.name} /></div>}
            </div>
        );
    }else if(wholeCard){
        return(
            <div 
                className={`player-card ${wholeCard.positionTyped.toLowerCase()}-border`}
                draggable="true"
                onDragStart={handleDragStart}
            >
                <h3>{`${wholeCard?.player.firstName} ${wholeCard?.player.lastName}`}</h3>
                <img src={wholeCard?.player.pictureUrl} alt="" />
                <div className={`score ${getScoreColor(wholeCard.player.averageScore)}`}>{wholeCard.player.averageScore}</div>
                <div className="owner">{wholeCard.owner}</div>
            </div>
        );
    }else{
        return "naaadaaa"
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


