import { BehaviorSubject } from "rxjs"
import { allPlayers, users } from "./store";

export const availablePlayers = new BehaviorSubject([]);
export const filteredAvailablePlayers = new BehaviorSubject([]);
export const rejectedPlayers = new BehaviorSubject([]);
export const lineups = new BehaviorSubject([]);
const positionList = ['extra', 'midfielder', 'forward', 'defender', 'goalkeeper']

let copyAllPlayersFlag = true;

const lineupBase = {
    id: null,
    owner: null,
    extra: null,
    forward: null,
    defender: null,
    goalkeeper: null,
    midfielder: null,
    totalScore: 0
};

copyAllPlayersFromLocalStorage();
continiousCopyToLocalStorage();


export function loadInitialPlayers(){

}

function copyAllPlayersFromLocalStorage(){
    if(copyAllPlayersFlag) {
        allPlayers.subscribe(players => {availablePlayers.next(filterPlayersNotAvailable(players)); localStorage.setItem('AllPlayers', JSON.stringify(players))});
        availablePlayers.subscribe(players => {filteredAvailablePlayers.next(players.filter(player => users.value.includes(player.owner))); localStorage.setItem('AvailablePlayers', JSON.stringify(players))})
        users.subscribe(users => filteredAvailablePlayers.next(availablePlayers.value.filter(player => users.includes(player.owner))))
        allPlayers.next(JSON.parse(localStorage.getItem('AllPlayers')) || [])
        availablePlayers.next(JSON.parse(localStorage.getItem('AvailablePlayers')) || [])
        copyAllPlayersFlag = false;
        getLineupsFromLocalStorage()
    }
}

export function addPlayerToLineup(playerId, lineupId, lineupPosition){
    selectPlayerFromAvailables(playerId);
    const playerIdInSelectedPosition = getLineup(lineupId)[lineupPosition];
    if(playerIdInSelectedPosition){
        availablePlayers.next([...availablePlayers.value, getPlayer(playerIdInSelectedPosition)])
    }
    getLineup(lineupId)[lineupPosition] = playerId;
    calculateTotalScore(lineupId);
}

export function addLineupOwner(lineupId, owner){    
    if(lineupId&&owner){
        const lineupsCopy = Object.assign([], lineups.value)
        lineupsCopy.find(lineup => lineup.id === lineupId).owner = owner
        lineups.next(lineupsCopy)
    }
}

export function deleteCardFromLineup(position, cardId){
    const newLineups = Object.assign([], lineups.value)
    const playerId = newLineups.find(player=> player.id===cardId)[position.toLowerCase()]
    newLineups.find(player=> player.id===cardId)[position.toLowerCase()] = null
    lineups.next(newLineups)
    const player = getPlayer(playerId);
    availablePlayers.next([...availablePlayers.value, player])
}

export function getPlayer(playerId){
    return allPlayers.value.find(player => player.id === playerId)
}

function calculateTotalScore(lineupId){
    const lineup = getLineup(lineupId);
    const player15Scores = positionList.map(position => {
        const playerId = lineup[position]
        if(playerId){
            const player15Score = allPlayers.value.find(player=> player.id === playerId).player.averageScore;
            return player15Score ? player15Score : 0;
        }
        return 0;
    })
    const total15Score = player15Scores.reduce((acc, next) => acc+next, 0)
    const lineupsCopy = Object.assign([], lineups.value)
    lineupsCopy.find(lineup => lineup.id === lineupId).totalScore = total15Score
    lineups.next(lineupsCopy)
}

export function selectPlayerFromAvailables(playerId){
    availablePlayers.next(availablePlayers.value.filter(player => player.id !== playerId))
}

export function rejectFromAvailables(playerId){
    availablePlayers.next(availablePlayers.value.filter(player => player.id !== playerId))
    rejectedPlayers.next([...rejectedPlayers.value, allPlayers.value.find(player => player.id === playerId)])
}

export function restoreRejectedPlayer(playerId){
    rejectedPlayers.next(rejectedPlayers.value.filter(player => player.id !== playerId))
    availablePlayers.next([...availablePlayers.value, allPlayers.value.find(player => player.id === playerId)])
}

export function addNewLineup(lineupId){
    const newLineup = Object.assign({}, lineupBase);
    newLineup.id = lineupId;
    lineups.next([...lineups.value, newLineup])
}

// function deleteLineup(lineupId){
//     lineups.next(lineups.value.filter(lineup => lineup.id!==lineupId))
// }

function getLineup(lineupId){
    return lineups.value.find(lineup => lineup.id === lineupId)
}

function continiousCopyToLocalStorage(){
    lineups.subscribe(lineupsValue => {
        if(lineupsValue?.length) {
            localStorage.setItem('Lineups', JSON.stringify(lineupsValue))
        }
    })
    allPlayers.subscribe(players => {localStorage.setItem('AllPlayers', JSON.stringify(players))});
    availablePlayers.subscribe(players => {localStorage.setItem('AvailablePlayers', JSON.stringify(players))})
    rejectedPlayers.subscribe(players => {localStorage.setItem('RejectedPlayers', JSON.stringify(players))})
}

function getLineupsFromLocalStorage(){
    //Guardamos las alineaciones
    const savedLineups = JSON.parse(localStorage.getItem('Lineups')) || [];
    lineups.next(savedLineups);
}

function filterPlayersNotAvailable(players){
    //Obtenemos los id de los jugadores de las alineaciones y de los rechazados, para quitarlos de disponibles
    const rejected = JSON.parse(localStorage.getItem('RejectedPlayers')) || [];
    rejectedPlayers.next(rejected)
    const savedLineups = JSON.parse(localStorage.getItem('Lineups')) || [];
    const usedPlayers = [...savedLineups.map(lineup=> Object.values(lineup)).flat(), ...rejected.map(elem=> elem.id)];
    const filteredPlayers = players?.filter(player => !usedPlayers.includes(player.id))
    // availablePlayers.next(filteredPlayers)
    return filteredPlayers;
}