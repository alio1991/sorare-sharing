import { BehaviorSubject } from "rxjs"
import { getCardsByUser } from "./cards";


export const users = new BehaviorSubject(["alioli1991", "alioaa", "aagudolopez", "pititos", "kso1991", "javicaso"]);
export const allPlayers = new BehaviorSubject([]);
export const playersByUser = new BehaviorSubject({});
export const teams = new BehaviorSubject([]);

allPlayers.subscribe(players => {
  const teamsArray = players.map(player => player.player.lastClub.name)
  const uniqueteams = Array.from(new Set(teamsArray));
  teams.next(uniqueteams)
})

const getUsersInfo = () => {
  clearOldData()
  users.value.forEach(user => {   
    getCardsByUser(user).then(res => { 
      const {nickname, paginatedCards }= res.content.user;
      const players = paginatedCards.nodes.map(node=> {node.owner = user; return node});
      allPlayers.next([...allPlayers.value, ...players])
      playersByUser.next({...playersByUser.value, [nickname]: players})
    })
  })
}

export function inicializeStore(){
    getUsersInfo();
}

function clearOldData(){
  allPlayers.next([])
}