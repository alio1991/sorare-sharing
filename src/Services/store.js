import { BehaviorSubject } from "rxjs"
import { getCardsByUser, getCardsOnSaleByPlayerSlug, getNextGameWeek } from "./cards";


export const users = new BehaviorSubject(["alioli1991", "alioaa", "aagudolopez", "pititos", "kso1991", "javicaso"]);
export const allPlayers = new BehaviorSubject([]);
export const nextGameWeek = new BehaviorSubject(null);
export const playersByUser = new BehaviorSubject({});
export const teams = new BehaviorSubject([]);
export const playerCardsWithMinPrices = new BehaviorSubject([]);
export const whatchListPlayers = new BehaviorSubject([]);

getNextGameWeek().then(res => { 
  nextGameWeek.next(res.content.gameWeek)
})

allPlayers.subscribe(players => {
  const teamsArray = players.map(player => player.player.lastClub.name)
  const uniqueteams = Array.from(new Set(teamsArray));
  teams.next(uniqueteams)
})

playerCardsWithMinPrices.next(JSON.parse(localStorage.getItem('AllCardsWithPrices')) || []);

playerCardsWithMinPrices.subscribe(cards => {
  localStorage.setItem('AllCardsWithPrices', JSON.stringify(cards))
})

whatchListPlayers.next(JSON.parse(localStorage.getItem('WhatchListPlayers')) || []);

whatchListPlayers.subscribe(cards => {
  localStorage.setItem('WhatchListPlayers', JSON.stringify(cards))
})

export function getPlayersWithMinPrices(){
  allPlayers.value.forEach((card, index)=> {
    const mod = index%4;
    const delay = mod===0 ? 0 : 150000*mod;
    setTimeout(()=>{
      getCardsOnSaleByPlayerSlug(card.player.slug).then(res => { 
        const prevPrice = playerCardsWithMinPrices.value.find(playerCard => playerCard.id === card.id)?.minPrice;
        const cardCopy = Object.assign({}, card);
        cardCopy.prevPrice = prevPrice;
        cardCopy.minPrice = res.content;
        console.log('Nueva: ',index, cardCopy);
        const prevcards = playerCardsWithMinPrices.value;
        const filteredcards = prevcards.filter(card => card.id!==cardCopy.id)
        playerCardsWithMinPrices.next([...filteredcards, cardCopy])
      })
    }, delay)
  })

  setTimeout(() => {
    console.log('CARGA TERMINADA!!!');
  }, 500000);
}

export function getWatchListPlayersWithMinPrices(){
  console.log('Actualizando')
  whatchListPlayers.value.forEach(card=> {
      getCardsOnSaleByPlayerSlug(card.player.slug).then(res => { 
        const cardCopy = Object.assign({}, card);
        cardCopy.prevPrice = cardCopy.minPrice;
        cardCopy.minPrice = res.content;
        const prevcards = whatchListPlayers.value;
        const filteredcards = prevcards.filter(card => card.id!==cardCopy.id)
        whatchListPlayers.next([...filteredcards, cardCopy])
      })
  })
}

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