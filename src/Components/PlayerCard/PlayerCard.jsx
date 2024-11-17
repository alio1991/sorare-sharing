import './PlayerCard.scss';
import { allPlayers, nextGameWeek } from '../../../src/Services/store'
import { useEffect, useState } from 'react';

export function PlayerCard({cardId, wholeCard}){
    const [card, setCard] = useState(null)
    const [gameWeek, setgameWeek] = useState(null)
    const [upcomingGames, setupcomingGames] = useState([])

    useEffect(()=>{
        nextGameWeek.subscribe(gameWeek=> setgameWeek(gameWeek))
    },[])

    useEffect(()=>{
        const nationalTeamEvents = card?.player?.activeNationalTeam?.upcomingGames || [];
        const clubTeamEvents = card?.player?.activeClub?.upcomingGames || [];
        setupcomingGames([...clubTeamEvents, ...nationalTeamEvents])
    },[card])

    useEffect(()=>{
        allPlayers.subscribe(players=> setCard(players.find(player => player.id===cardId)))
    },[cardId])

    if(card){
        return(
            <div 
                className={`player-card ${card.positionTyped.toLowerCase()}-border`}
                style={{backgroundColor: card.inSeasonEligible ? 'rgb(242 153 48)' : '#f3e415'}}
                draggable="true"
                onDragStart={handleDragStart}
                onClick={()=> redirectsToSorareCard(card)}
            >
                <h3>{`${card?.player.firstName} ${card?.player.lastName}`}</h3>
                <img className="player-img" src={card?.player.pictureUrl} alt="" />
                <div className={`score ${getScoreColor(card.player.averageScore)}`}>
                    {card.player.averageScore}
                    <div className='last-scores'>
                        {card?.so5Scores.map((scoreInfo, i) => <div className={i === 0 ? "last-puntuation last-score" : "last-score"} key={i}>{scoreInfo.score}</div>)}
                    </div>
                </div>
                <div className="owner">{card.owner}</div>
                {
                    ['next-game', 'second-next-game', 'third-next-game'].map((slot, i) => {
                        return <div key={i} className={`game ${slot}`}> 
                                    {someTeamInThisSlot(i) ? 
                                        <img src={getOppositeTeamImage(card?.player, i)} alt="club" />
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
        const position = wholeCard.positionTyped || wholeCard?.cardPositions && wholeCard?.cardPositions[0];
        return(
            <div 
                className={`player-card ${position.toLowerCase()}-border`}
                draggable="true"
                onDragStart={handleDragStart}
                onClick={()=> redirectsToSorareCard(wholeCard, false)}
            >
                <h3>{`${wholeCard?.displayName}`}</h3>
                <img src={wholeCard?.fullPictureUrl} alt="" />
                <div className={`score ${getScoreColor(wholeCard.averageScore)}`}>
                    {wholeCard.averageScore}
                    <div className='last-scores'>
                        {wholeCard?.playerGameScores.map((scoreInfo, i) => <div className={i === 0 ? "last-puntuation last-score" : "last-score"} key={i}>{scoreInfo.score}</div>)}
                    </div>
                </div>
            </div>
        );
    }else{
        return ""
    }

    function redirectsToSorareCard(card, isOwnCard=true){
        if(isOwnCard){
            // const url = 'https://sorare.com/football/cards/'+card?.slug;
            const url = `https://sorare.com/es/football/cards/${card?.slug}`;
            window.open(url, "_blank");
        }else{
            const url = `https://sorare.com/football/players/${card?.slug}/cards?s=Lowest+Price&sale=true`;
            window.open(url, "_blank");
        }
    }

    
    function someTeamInThisSlot(slot){
        return gameWeek&&upcomingGames?.map(event => event?.so5Fixture?.gameWeek).includes(gameWeek+slot) ? upcomingGames.find(event => event?.so5Fixture?.gameWeek===gameWeek+slot) : null;
    }

    function getOppositeTeamImage(player, i){
        const teamNames = [player.activeClub?.name, player.activeNationalTeam?.name]
        const referencedGameWeek = gameWeek+i;
        const match = upcomingGames.find(game => game?.so5Fixture?.gameWeek === referencedGameWeek);
        return teamNames.includes(match.awayTeam?.name) ? match?.homeTeam?.pictureUrl : match?.awayTeam?.pictureUrl;
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


