import './lineups.scss';
import { nextGameWeek, playersByUser, users } from '../../../src/Services/store'
import { filteredAvailablePlayers, rejectFromAvailables, lineups, addNewLineup } from '../../../src/Services/customLineups'
import { UserTag } from '../../Components/UserTag/UserTag';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { Lineup } from '../../Components/Lineup/Lineup';
import { useEffect, useState } from 'react';

function Lineups() {

    const [cardsByUser, setcardsByUser] = useState({})
    const [cardsFiltered, setcardsFiltered] = useState([])
    const [localLineups, setlocalLineups] = useState([{id: 1}])
    const [lineupsOwners, setlineupsOwners] = useState({})
    const [globalTransactions, setglobalTransactions] = useState([])

  
    useEffect(() => {
      filteredAvailablePlayers.subscribe((cards) => { setcardsFiltered(cards)})
      playersByUser.subscribe(cards => setcardsByUser(cards))
      lineups.subscribe(lineups => {setlocalLineups(lineups)})
    }, [])

    useEffect(() => {
        setglobalTransactions(calculateGlobalTransactions(lineupsOwners))
    }, [lineupsOwners])
  
    const onUsetTagSelected = (user, active) => {
      if(active){
        users.next([...users.value, user])
      }else{
        users.next(users.value.filter((userName) => user!==userName))
      }
    }
  
    return (
      <div className="lineups-view">
        <div className="lineups-header">
          <div className="user-tags">
            {Object.keys(cardsByUser).map((user, i)=> <UserTag onUsetTagSelected={onUsetTagSelected} name={user} cards={cardsByUser[user]} key={i}></UserTag>)}
          </div>
          <div className="available-players-only-button">
            <div className="user-tag" onClick={()=> setOnlyAvailables()}>
              <p>Solo disponibles</p>
            </div>
          </div>
          <div className="rubbish" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev)}>Apartar</div>
        </div>
  
        <div className="select-team-section">
          <div className="player-cards">
            {cardsFiltered.sort((a,b)=> b.player.averageScore-a.player.averageScore).map((card, i)=> <PlayerCard cardId={card.id} key={i}></PlayerCard>)}
          </div>
          <div className="lineups">
            <button className="new-lineup-button" onClick={()=> addNewLineup(localLineups.length ? Math.max(...localLineups.map(elem => elem.id))+1 : 1)}>AddLineup</button>
            {localLineups.map((elem) => <Lineup onLineupOwnersChange={onLineupOwnersChange} id={elem.id} key={elem.id}></Lineup>)}
            <div className="global-transactions">
              {globalTransactions.map( (transaction, i) => 
                <div className="transaction" key={i}>
                    <div className="owner">
                      <h1>{transaction.from.owner}</h1>
                      <div>{transaction.from.players.map((player, i) => <p className="player" key={player+i}>{player}</p>)}</div>
                    </div>
                    <div className="owner">
                      <h1>{transaction.to.owner}</h1>
                      <div>{transaction.to.players.map((player, i) => <p className="player" key={player+i}>{player}</p>)}</div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  
    function handleDragOver(event) {
      event.preventDefault();
    }

    function setOnlyAvailables(){
      setcardsFiltered(prev => prev.filter(card => {
        return card?.player?.activeClub?.upcomingGames.some(game=> game.so5Fixture?.gameWeek === nextGameWeek.value)
        ||
        card?.player?.activeNationalTeam?.upcomingGames.some(game=> game.so5Fixture?.gameWeek === nextGameWeek.value);
      }))
    }
  
    function handleDrop(event) {
        const cardId = event.dataTransfer.getData("text/html");
        rejectFromAvailables(cardId)
    }

    function onLineupOwnersChange(lineupId, lineupOwner, playerOwners){
      if(playerOwners?.length){
        setlineupsOwners(prevValue=> {
          const aux = Object.assign({}, prevValue)
          aux[lineupId] = {owner: lineupOwner, playerOwners: playerOwners}
          return aux
        })
      }
    }

    function calculateGlobalTransactions(lineupsOwnersTransactions){
      
      const tupletransactions = [];
      if(lineupsOwnersTransactions){

        const transactionsList = Object.keys(lineupsOwnersTransactions).map( lineupId => {
          const lineupTransactions = lineupsOwnersTransactions[lineupId]
          return lineupTransactions?.playerOwners?.map(transaction => [...transaction, lineupTransactions.owner]).filter(elem => elem[0]!==elem[2])
        }).flat()

        const ownersInTransaction = Array.from(new Set(transactionsList.map(transaction => [transaction[0], transaction[2]]).flat()))
        const ownersCopy = Object.assign([], ownersInTransaction)

        for(let owner of ownersInTransaction){
          const ownerTransactions = transactionsList.filter(transaction => transaction.includes(owner));
          ownersCopy.shift()

          for(let secondOwner of ownersCopy){
            if(owner !== secondOwner && ownerTransactions.some(transaction => transaction.includes(secondOwner))){
              const fromPlayers = ownerTransactions.filter( transaction => transaction[0]===owner && transaction[2]===secondOwner).map(trans => trans[1])
              const toPlayers = ownerTransactions.filter( transaction => transaction[0]===secondOwner && transaction[0]===secondOwner).map(trans => trans[1])
              tupletransactions.push({from: {owner: owner, players: fromPlayers}, to: {owner: secondOwner, players: toPlayers}})
            }
          }
        }
      }
      return tupletransactions;
    }
  }
  
  export default Lineups;
  