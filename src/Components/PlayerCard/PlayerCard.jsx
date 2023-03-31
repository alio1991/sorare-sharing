import './PlayerCard.scss';
import { allPlayers, nextGameWeek } from '../../../src/Services/store'
import { useEffect, useState } from 'react';

export function PlayerCard({cardId, wholeCard}){
    const [card, setCard] = useState(null)
    const [gameWeek, setgameWeek] = useState(0)
    const [upcomingGames, setupcomingGames] = useState([])

    useEffect(()=>{
        nextGameWeek.subscribe(gameWeek=> setgameWeek(gameWeek))
    },[])

    useEffect(()=>{
        setupcomingGames(card?.player?.activeClub?.upcomingGames)
    },[card])

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
                <img className="player-img" src={card?.player.pictureUrl} alt="" />
                <div className={`score ${getScoreColor(card.player.averageScore)}`}>{card.player.averageScore}</div>
                <div className="owner">{card.owner}</div>
                {
                    ['next-game', 'second-next-game', 'third-next-game'].map((slot, i) => {
                        return <div key={i} className={`game ${slot}`}> 
                                    {someTeamInThisSlot(i) ? 
                                        <img src={getOppositeTeamImage(card.player.activeClub.name, i)} alt="club" />
                                        :
                                        <div className="no-game"><p>{gameWeek+i}</p></div>
                                    }
                                </div>
                    })
                }

                {card.player?.activeNationalTeam?.pictureUrl && <div className="country"> <img src={card.player?.activeNationalTeam?.pictureUrl} alt={card.player?.activeNationalTeam?.name} /></div>}
            </div>
        );
    }else if(wholeCard){
        //For price view
        return(
            <div 
                className={`player-card ${wholeCard.positionTyped.toLowerCase()}-border`}
                draggable="true"
                onDragStart={handleDragStart}
            >
                <h3>{`${wholeCard?.player.firstName} ${wholeCard?.player.lastName}`}</h3>
                <img src={wholeCard?.player.pictureUrl} alt="" />
                <div className={`score ${getScoreColor(wholeCard.player.averageScore)}`}>{wholeCard.player.averageScore}</div>
            </div>
        );
    }else{
        return "x"
    }

    function someTeamInThisSlot(slot){
        return upcomingGames?.map(event => event.so5Fixture.gameWeek).includes(gameWeek+slot) ? upcomingGames.find(event => event.so5Fixture.gameWeek===gameWeek+slot) : null;
    }

    function getOppositeTeamImage(clubName, i){
        const referencedGameWeek = gameWeek+i;
        const match = upcomingGames.find(game => game.so5Fixture.gameWeek === referencedGameWeek);
        return match.awayTeam.name === clubName ? match.homeTeam.pictureUrl : match.awayTeam.pictureUrl;
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


