import { BehaviorSubject } from "rxjs"
import { allPlayers, users } from "./store";

export const availablePlayers = new BehaviorSubject([]);
export const filteredAvailablePlayers = new BehaviorSubject([]);
export const lineups = new BehaviorSubject([]);
const positionList = ['extra', 'midifier', 'forward', 'defender', 'goalkeeper']

let subscribedFlag = true;

const lineupBase = {
    id: null,
    extra: null,
    forward: null,
    defender: null,
    goalkeeper: null,
    midifier: null,
    totalScore: 0
};

loadInitialPlayers();

function loadInitialPlayers(){
    if(subscribedFlag) {
        allPlayers.subscribe(players => availablePlayers.next(players));
        availablePlayers.subscribe(players => filteredAvailablePlayers.next(players.filter(player => users.value.includes(player.owner))))
        subscribedFlag = false;
        users.subscribe(users => filteredAvailablePlayers.next(availablePlayers.value.filter(player => users.includes(player.owner))))
    }
}

export function addPlayerToLineup(playerId, lineupId, lineupPosition){
    deletePlayerFromAvailables(playerId);
    const playerIdInSelectedPosition = getLineup(lineupId)[lineupPosition];
    console.log(getPlayer(playerIdInSelectedPosition));
    if(playerIdInSelectedPosition){
        availablePlayers.next([...availablePlayers.value, getPlayer(playerIdInSelectedPosition)])
    }
    getLineup(lineupId)[lineupPosition] = playerId;
    calculateTotalScore(lineupId);
}

function getPlayer(playerId){
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

function deletePlayerFromAvailables(playerId){
    availablePlayers.next(availablePlayers.value.filter(player => player.id !== playerId))
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