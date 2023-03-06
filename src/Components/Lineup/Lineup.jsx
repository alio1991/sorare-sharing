import { useEffect, useState } from 'react';
import { PlayerCard } from '../PlayerCard/PlayerCard';
import './Lineup.scss';
import {addPlayerToLineup, lineups, deleteCardFromLineup} from "../../Services/customLineups"
import { allPlayers } from '../../../src/Services/store'

export function Lineup({id}){

    const [lineupId, setlineupId] = useState(null)
    const [totalScore, settotalScore] = useState(0)

    useEffect(() => {
        if(id){
            if (lineupId===null) {
                setlineupId(id)
                lineups.subscribe(lineupsValue => {
                    setNewLineupData(lineupsValue, id);
                })
            }   
        }
    }, [id])

    const [extraId, setextraId] = useState(null)
    const [forwardId, setforwardId] = useState(null)
    const [midfielderId, setmidfielderId] = useState(null)
    const [defenderId, setdefenderId] = useState(null)
    const [goalkeeperId, setgoalkeeperId] = useState(null)


    return(
        <div className="lineup">
            <h1>ID:{id}</h1>
            <div className="lineup-total-score">
                <h1>{totalScore}</h1><h3 className={240-totalScore>0 ? 'score-diff green' : 'score-diff red'}>{240-totalScore}</h3>
            </div>
            <div className="slot extra" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setextraId, "extra")}>
                <div onClick={()=> deleteCard('extra')} className="delete">X</div>
                {extraId ? <PlayerCard cardId={extraId}></PlayerCard> : "Extra"}
            </div>
            <div className="slot forward forward-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setforwardId, "forward")}>
                <div onClick={()=> deleteCard('forward')} className="delete">X</div>
                {forwardId ? <PlayerCard cardId={forwardId}></PlayerCard> : "Delantero"}
            </div>
            <div className="slot midfielder midfielder-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setmidfielderId, "midfielder")}>
                <div onClick={()=> deleteCard('midfielder')} className="delete">X</div>
                {midfielderId ? <PlayerCard cardId={midfielderId}></PlayerCard> : "Medio"}
            </div>
            <div className="slot defender defender-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setdefenderId, "defender")}>
                <div onClick={()=> deleteCard('defender')} className="delete">X</div>
                {defenderId ? <PlayerCard cardId={defenderId}></PlayerCard> : "Defensa"}
            </div>
            <div className="slot goalkeeper goalkeeper-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setgoalkeeperId, "goalkeeper")}>
                <div onClick={()=> deleteCard('goalkeeper')} className="delete">X</div>
                {goalkeeperId ? <PlayerCard cardId={goalkeeperId}></PlayerCard> : "Portero"}
            </div>
        </div>
    );

    function handleDragOver(event) {
        event.preventDefault();
    }
    
    function handleDrop(event, setSlot, position) {
        const cardId = event.dataTransfer.getData("text/html");
        const playerPosition = allPlayers.value.find(player => player.id===cardId).positionTyped;
        if((position==='extra' && playerPosition!=='Goalkeeper')|| playerPosition.toLowerCase() === position){
            addPlayerToLineup(cardId, lineupId, position, setSlot)
        }
    }

    function setNewLineupData(lineupsValue, id){
        const lineup = lineupsValue.find(lineup => lineup.id === id);
        //Set Players
        if(lineup){
            setgoalkeeperId(lineup.goalkeeper ?? null)
            setdefenderId(lineup.defender ?? null)
            setmidfielderId(lineup.midfielder ?? null)
            setforwardId(lineup.forward ?? null)
            setextraId(lineup.extra ?? null)
        }
        //Set Score
        const totalScore = lineupsValue.find(lineup => lineup.id === id)?.totalScore;
        settotalScore(totalScore)
    }

    function deleteCard(position){
        deleteCardFromLineup(position, id)
    }  
}
