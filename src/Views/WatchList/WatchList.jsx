import './WatchList.scss';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { whatchListPlayers, getWhatchListPlayersWithMinPrices } from '../../Services/store'
import { getRandomCardFromPlayerSlug } from '../../Services/cards'
import { useEffect, useState } from 'react';

function WatchList() {

    const [cardsFiltered, setcardsFiltered] = useState([])
    const [inputValue, setinputValue] = useState([])

    useEffect(() => {
        whatchListPlayers.subscribe((cards) => { setcardsFiltered(cards)})
    }, [])

    return (
        <div className="whatch-list-prices">
            <button onClick={()=> getWhatchListPlayersWithMinPrices()}>Actualizar</button>
            <div className="add-new-player">
                <input onKeyUp={ev => setinputValue(ev.target.value)} type="text" />
                <button onClick={() => addNewPayerToWatchList(inputValue)}>Añadir</button>
            </div>
            <div className="player-cards">
                {cardsFiltered
                .sort((a,b)=> b?.minPrice?.eur-a?.minPrice?.eur)
                .map((card, i)=> 
                    <div key={i} className="card-with-price">
                        <PlayerCard wholeCard={card} ></PlayerCard>
                        {card?.minPrice && <div className="price-section">
                            <div className={`price ${getColor(card.minPrice.eur)}`}>
                                <h3>{formatPrice(card.minPrice.eur)}€</h3>
                            </div>
                            {/* <div className={`on-sale ${card.onSale ? 'green' : ''}`}></div> */}
                            {/* <div className={`buy-price`}>
                                <h3>{formatPrice(card.token.ownershipHistory.filter(elem => users.value.includes(elem.user.nickname))[0]?.priceFiat.eur)}€</h3>
                            </div> */}
                        </div>}
                    </div>
                )}
            </div>
        </div>
    )

    function addNewPayerToWatchList(playerSlug){
        getRandomCardFromPlayerSlug(playerSlug).then(res => {
            const newCard = res.content.player.cards.nodes[0];
            whatchListPlayers.value?.filter(player => player.player.id !== newCard.player.id)
            whatchListPlayers.next([...whatchListPlayers.value, res.content.player.cards.nodes[0]])
        })
    }

    function formatPrice(price){
        if(price<25){
            return price.toFixed(1);
        }else{
            return Math.round(price)
        }
    }
    function getColor(price){
        if(price > 100){
            return 'green'
        }else if(price > 50){
            return 'light-green'
        }else if(price > 30){
            return 'yellow'
        }else if(price > 10){
            return 'orange'
        }else{
            return 'red'
        }
    }
}

export default WatchList;