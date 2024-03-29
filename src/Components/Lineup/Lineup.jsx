import { useEffect, useState } from 'react';
import { PlayerCard } from '../PlayerCard/PlayerCard';
import './Lineup.scss';
import { addPlayerToLineup, lineups, deleteCardFromLineup, getPlayer, addLineupOwner, deleteLineup } from "../../Services/customLineups"
import { allPlayers, nextGameWeek, users } from '../../../src/Services/store'
import { skipWhile } from 'rxjs';
import { Select } from 'antd';

export function Lineup({id, onLineupOwnersChange}){

    const [currentGameweek, setcurrentGameweek] = useState(null)
    const [selectedGameweek, setselectedGameweek] = useState(null)
    const [gameweekOptions, setgameweekOptions] = useState([])

    const [lineupId, setlineupId] = useState(null)
    const [totalScore, settotalScore] = useState(0)
    const [lineupOwner, setlineupOwner] = useState(null)
    const [playerOwners, setplayerOwners] = useState([])

    const [extraId, setextraId] = useState(null)
    const [forwardId, setforwardId] = useState(null)
    const [midfielderId, setmidfielderId] = useState(null)
    const [defenderId, setdefenderId] = useState(null)
    const [goalkeeperId, setgoalkeeperId] = useState(null)

    const [cardScores, setcardScores] = useState([])


    useEffect(()=> {
        nextGameWeek.subscribe(gameWeek => {
            setcurrentGameweek(gameWeek-1); 
            setselectedGameweek(gameWeek-1); 
            setgameweekOptions([
                { value: (gameWeek-1) || 0, label: 'Gameweek '+(gameWeek-1) },
                { value: (gameWeek-2) || 0, label: 'Gameweek '+(gameWeek-2) },
                { value: (gameWeek-3) || 0, label: 'Gameweek '+(gameWeek-3) },
              ])})
        getEstimatedPoints()
    },[])
    useEffect(()=> {
            addLineupOwner(lineupId, lineupOwner)
            generateOwners(lineupOwner)
    },[lineupOwner, lineupId])

    useEffect(()=> {
            generateOwners(lineupOwner)
            getEstimatedPoints()
    },[extraId,forwardId,midfielderId,defenderId,goalkeeperId])

    useEffect(()=> {
            getEstimatedPoints()
    },[selectedGameweek])

    useEffect(() => {
        if(id){
            setlineupId(id)
            if (lineupId===null) {
                lineups.subscribe(lineupsValue => {
                    setNewLineupData(lineupsValue, id);
                })
            }   
        }
    }, [id])


    return(
        <div className="lineup">
            <div onClick={()=> preDeleteLineup(id)} className="delete-lineup">X</div>
            <div onClick={()=> getEstimatedPoints()} className="update-points">Act Pts</div>

            <div className="lineup-total-score">
                <h1>{totalScore}</h1><h3 className={240-totalScore>0 ? 'score-diff-green' : 'score-diff-red'}>{240-totalScore}</h3>
            </div>
            <div className="slot extra extra-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setextraId, "extra")}>
                {extraId ? <div onClick={()=> deleteCard('extra', extraId)} className="delete">X</div> : ''}
                {extraId ? <PlayerCard cardId={extraId}></PlayerCard> : "Extra"}
                <div className='current-slot-score'>{cardScores.find(card=> card.id===extraId)?.score ?? 'X'}</div>
            </div>
            <div className="slot forward forward-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setforwardId, "forward")}>
                {forwardId ? <div onClick={()=> deleteCard('forward', forwardId)} className="delete">X</div> : ''}
                {forwardId ? <PlayerCard cardId={forwardId}></PlayerCard> : "Delantero"}
                <div className='current-slot-score'>{cardScores.find(card=> card.id===forwardId)?.score ?? 'X'}</div>
            </div>
            <div className="slot midfielder midfielder-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setmidfielderId, "midfielder")}>
                {midfielderId ? <div onClick={()=> deleteCard('midfielder', midfielderId)} className="delete">X</div> : ''}
                {midfielderId ? <PlayerCard cardId={midfielderId}></PlayerCard> : "Medio"}
                <div className='current-slot-score'>{cardScores.find(card=> card.id===midfielderId)?.score ?? 'X'}</div>
            </div>
            <div className="slot defender defender-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setdefenderId, "defender")}>
                {defenderId ? <div onClick={()=> deleteCard('defender', defenderId)} className="delete">X</div> : ''}
                {defenderId ? <PlayerCard cardId={defenderId}></PlayerCard> : "Defensa"}
                <div className='current-slot-score'>{cardScores.find(card=> card.id===defenderId)?.score ?? 'X'}</div>
            </div>
            <div className="slot goalkeeper goalkeeper-border" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev, setgoalkeeperId, "goalkeeper")}>
                {goalkeeperId ? <div onClick={()=> deleteCard('goalkeeper', goalkeeperId)} className="delete">X</div> : ''}
                {goalkeeperId ? <PlayerCard cardId={goalkeeperId}></PlayerCard> : "Portero"}
                <div className='current-slot-score'>{cardScores.find(card=> card.id===goalkeeperId)?.score}</div>
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
                    {transactionsRender().length ? transactionsRender() : <h1> OK!</h1>}
                </div>
            </div>
            <div className='last-estimated-score'>
                <Select
                    value={selectedGameweek}
                    onChange={handleGameweekChange}
                    options={gameweekOptions}
                />
                
                {cardScores.reduce((acc, curr) => curr.score ? acc+curr.score : acc, 0)?.toFixed(1) + " pts"}
            </div>
        </div>
    );

    function handleGameweekChange(gameweek){
        setselectedGameweek(gameweek)
    }

    function getEstimatedPoints(){
        const positionIds = [extraId, forwardId, midfielderId, defenderId, goalkeeperId];
        const playerScores = positionIds.map(positionId => {
            const card = allPlayers.value.find(card => card.id === positionId);
            const selectedGameweekScore = card?.so5Scores.find(score => score.game?.so5Fixture?.gameWeek === selectedGameweek);
            const totalScore  = selectedGameweekScore ? positionId===null ? null : selectedGameweekScore.score : null;

            return {score: totalScore, id: positionId}
        });

        setcardScores(playerScores)
    }

    function transactionsRender(){
        return [...new Set(playerOwners.filter(
            duo => { return duo[0]!== lineupOwner ?? 'alioli1991'}
        ).map(
            elem => elem[0]
        ))].map(owner => {
            return <div key={owner}>
                <div className="user-transaction">
                    <h5 className="from">{owner}</h5>
                    <h5>{'==>'}</h5>
                    <h5 className="to">{lineupOwner}</h5>
                </div>
                
                <b>{playerOwners.filter(tuple => tuple[0]===owner).map((player, i)=> <li key={i}>{player[1]}</li>)}</b>
            </div>
        })
    }

    function generateOwners(owner){
        if(owner){
            allPlayers.pipe(skipWhile(list => list === [])).subscribe(soloEsParaAsegurarseQueYaEstanCargadosLosDatosDeLosJugadores => {
                const playerIds = [extraId, forwardId, midfielderId, defenderId, goalkeeperId];
                const owners = playerIds.map(playerId => {
                    const player = getPlayer(playerId);
    
                    if(player && player.owner !== lineupOwner){
                        const playerName = player.player.firstName+' '+player.player.lastName;
                        const playerOwner = player.owner;
                        return [playerOwner, playerName]
                    }else{
                        return null;
                    }
                }).filter(elem=> elem!==null)
                setplayerOwners(owners)
                onLineupOwnersChange(lineupId, lineupOwner, owners)
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
            addPlayerToLineup(cardId, id, position, setSlot)
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
            generateOwners(lineupOwner)
            deleteCardFromLineup(position, id)
        }
    }  
    function preDeleteLineup(lineupId){
        restorePlayers()
        deleteLineup(lineupId)
    }  
    function restorePlayers(){
        const positionPlayers = [
            [extraId, "extra"],
            [forwardId, "forward"],
            [midfielderId, "midfielder"],
            [defenderId, "defender"],
            [goalkeeperId, "goalkeeper"]
        ]
        positionPlayers.map(position => {
            const cardId = position[0]
            const positionName = position[1]
            if(cardId){
                generateOwners(lineupOwner)
                deleteCardFromLineup(positionName, id)
            }
        })
    }  
}
