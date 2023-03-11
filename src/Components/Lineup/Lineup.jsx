import { useEffect, useState } from 'react';
import { PlayerCard } from '../PlayerCard/PlayerCard';
import './Lineup.scss';
import {addPlayerToLineup, lineups, deleteCardFromLineup, getPlayer, addLineupOwner} from "../../Services/customLineups"
import { allPlayers, users } from '../../../src/Services/store'
import { skipWhile } from 'rxjs';

export function Lineup({id, onLineupOwnersChange}){

    const [lineupId, setlineupId] = useState(null)
    const [totalScore, settotalScore] = useState(0)
    const [lineupOwner, setlineupOwner] = useState(null)
    const [playerOwners, setplayerOwners] = useState([])

    const [extraId, setextraId] = useState(null)
    const [forwardId, setforwardId] = useState(null)
    const [midfielderId, setmidfielderId] = useState(null)
    const [defenderId, setdefenderId] = useState(null)
    const [goalkeeperId, setgoalkeeperId] = useState(null)

    
    useEffect(()=> {
        if(lineupId && lineupOwner && playerOwners)
        onLineupOwnersChange(lineupId, lineupOwner, playerOwners)
    },[lineupId, lineupOwner, playerOwners])

    useEffect(()=> {
            addLineupOwner(lineupId, lineupOwner)
            generateOwners(lineupOwner)
    },[lineupOwner, lineupId])

    useEffect(()=> {
            generateOwners(lineupOwner)
    },[extraId,forwardId,midfielderId,defenderId,goalkeeperId])

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




    return(
        <div className="lineup">
            <div className="lineup-total-score">
                <h1>{totalScore}</h1><h3 className={240-totalScore>0 ? 'score-diff green' : 'score-diff red'}>{240-totalScore}</h3>
            </div>
            <div className="slot extra extra-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setextraId, "extra")}>
                {extraId ? <div onClick={()=> deleteCard('extra', extraId)} className="delete">X</div> : ''}
                {extraId ? <PlayerCard cardId={extraId}></PlayerCard> : "Extra"}
            </div>
            <div className="slot forward forward-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setforwardId, "forward")}>
                {forwardId ? <div onClick={()=> deleteCard('forward', forwardId)} className="delete">X</div> : ''}
                {forwardId ? <PlayerCard cardId={forwardId}></PlayerCard> : "Delantero"}
            </div>
            <div className="slot midfielder midfielder-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setmidfielderId, "midfielder")}>
                {midfielderId ? <div onClick={()=> deleteCard('midfielder', midfielderId)} className="delete">X</div> : ''}
                {midfielderId ? <PlayerCard cardId={midfielderId}></PlayerCard> : "Medio"}
            </div>
            <div className="slot defender defender-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setdefenderId, "defender")}>
                {defenderId ? <div onClick={()=> deleteCard('defender', defenderId)} className="delete">X</div> : ''}
                {defenderId ? <PlayerCard cardId={defenderId}></PlayerCard> : "Defensa"}
            </div>
            <div className="slot goalkeeper goalkeeper-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setgoalkeeperId, "goalkeeper")}>
                {goalkeeperId ? <div onClick={()=> deleteCard('goalkeeper', goalkeeperId)} className="delete">X</div> : ''}
                {goalkeeperId ? <PlayerCard cardId={goalkeeperId}></PlayerCard> : "Portero"}
            </div>
            <div className="transactions">
                <select onChange={onLineupOwnerChange} value={lineupOwner || 'Selecciona un Propietario'}>
                    {users.value.map((option, index) => {
                        return <option key={index} >
                            {option}
                        </option>
                    })}
                </select>

                <div className="transactions-list">
                    {transactionsRender().length ? transactionsRender() : <h1>CORRECTO!!</h1>
                    }
                </div>
            </div>
        </div>
    );

    function transactionsRender(){
        return [...new Set(playerOwners.filter(
            duo => duo[0]!==lineupOwner
        ).map(
            elem => elem[0]
        ))].map(owner => {
            return <div key={owner}>
                <div className="user-transaction">
                    <h3 className="from">{owner}</h3>
                    <h3>{'  ==> '}</h3>
                    <h3 className="to">{lineupOwner}</h3>
                </div>
                
                <b>{playerOwners.filter(tuple => tuple[0]===owner).map((player, i)=> <li key={i}>{player[1]}</li>)}</b>
            </div>
        })
    }

    function generateOwners(owner){
        if(owner){
            allPlayers.pipe(skipWhile(list => list === [])).subscribe(playersList => {
                const playerIds = [extraId, forwardId, midfielderId, defenderId, goalkeeperId];
                const owners = playerIds.map(playerId => {
                    const player = getPlayer(playerId);
    
                    if(player){
                        const playerName = player.player.firstName+' '+player.player.lastName;
                        const playerOwner = player.owner;
                        return [playerOwner, playerName]
                    }else{
                        return null;
                    }
                }).filter(elem=> elem!==null)
                setplayerOwners(owners)
            })
        }
    }

    function onLineupOwnerChange(event){
        const owner = event.target.value;
        setlineupOwner(owner);
      }

    function handleDragOver(event) {
        event.preventDefault();
    }
    
    function handleDrop(event, setSlot, position) {
        const cardId = event.dataTransfer.getData("text/html");
        const playerPosition = allPlayers.value.find(player => player.id===cardId).positionTyped;
        if((position==='extra' && playerPosition!=='Goalkeeper')|| playerPosition.toLowerCase() === position){
            addPlayerToLineup(cardId, lineupId, position, setSlot)
        }
        generateOwners(lineupOwner)
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

        //SetOwner
        setlineupOwner(lineup?.owner);
        
        //Set Score
        const totalScore = lineupsValue.find(lineup => lineup.id === id)?.totalScore;
        settotalScore(totalScore)
    }

    function deleteCard(position, cardId){
        if(cardId){
            deleteCardFromLineup(position, id)
        }
    }  
}
