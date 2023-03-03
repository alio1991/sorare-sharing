import { useEffect, useState } from 'react';
import { PlayerCard } from '../PlayerCard/PlayerCard';
import './Lineup.scss';
import {addNewLineup, addPlayerToLineup, lineups} from "../../Services/customLineups"
import { v4 as uuidv4 } from 'uuid';
import { allPlayers } from '../../../src/Services/store'

export function Lineup(){

    const [lineupId, setlineupId] = useState(null)
    const [totalScore, settotalScore] = useState(0)

    useEffect(() => {
        const uniqueId = uuidv4();
        setlineupId(uniqueId)
        addNewLineup(uniqueId)
        lineups.subscribe(lineupsValue => {
            setNewLineupData(lineupsValue, uniqueId);
        })
    }, [])

    const [extraId, setextraId] = useState(null)
    const [forwardId, setforwardId] = useState(null)
    const [midfielderId, setmidfielderId] = useState(null)
    const [defenderId, setvdefenderId] = useState(null)
    const [goalkeeperId, setgoalkeeperId] = useState(null)

    return(
        <div className="lineup">
            <div className="lineup-total-score">
                <h1>{totalScore}</h1>
            </div>
            <div className="slot extra" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setextraId, "extra")}>
                {extraId ? <PlayerCard cardId={extraId}></PlayerCard> : "Extra"}
            </div>
            <div className="slot forward forward-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setforwardId, "forward")}>
                {forwardId ? <PlayerCard cardId={forwardId}></PlayerCard> : "Delantero"}
            </div>
            <div className="slot midfielder midfielder-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setmidfielderId, "midfielder")}>
                {midfielderId ? <PlayerCard cardId={midfielderId}></PlayerCard> : "Medio"}
            </div>
            <div className="slot defender defender-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setvdefenderId, "defender")}>
                {defenderId ? <PlayerCard cardId={defenderId}></PlayerCard> : "Defensa"}
            </div>
            <div className="slot goalkeeper goalkeeper-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setgoalkeeperId, "goalkeeper")}>
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
        if(position==='extra' || playerPosition.toLowerCase() === position){
            setSlot(cardId);
            addPlayerToLineup(cardId, lineupId, position, setSlot)
        }
    }

    function setNewLineupData(lineupsValue, uniqueId){
        const totalScore = lineupsValue.find(lineup => lineup.id === uniqueId).totalScore;
        settotalScore(totalScore)
    }
}
