import './CardPrices.scss';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { playerCardsWithMinPrices, users, getPlayersWithMinPrices, allPlayers } from '../../Services/store'
import { useEffect, useState } from 'react';
import { PriceBlock } from '../../Components/PriceBlock/PriceBlock';

function CardPrices() {

    const [minPriceCards, setminPriceCards] = useState([])
    const [allCards, setallCards] = useState([])

    const [filteredCards, setfilteredCards] = useState([])

    useEffect(() => {
        allPlayers.subscribe(players => setallCards(players))
        playerCardsWithMinPrices.subscribe((cards) => setminPriceCards(cards))
    }, [])
    useEffect(() => {
        filterOldPlayers(allCards, minPriceCards)
    }, [minPriceCards, allCards])

    return (
        <div className="card-prices">
            <h2>Precio Total Actual: {formatPrice(filteredCards.reduce((acc, card)=> card.minPrice.eur+acc, 0))}€</h2>
            <button onClick={()=> getPlayersWithMinPrices()}>Get Players</button>

            <div className="player-cards">
                {filteredCards
                .sort((a,b)=> b.minPrice.eur-a.minPrice.eur)
                .map((card, i)=> 
                    <div key={i} className="card-with-price">
                        <PlayerCard cardId={card.id} ></PlayerCard>
                        <div className="price-section">
                            <PriceBlock card={card}></PriceBlock>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    function filterOldPlayers(allCards, minPriceCards){
        if(allCards?.length && minPriceCards?.length){
            return setfilteredCards(minPriceCards.filter(card => allCards.some(player => card.id===player.id)))
        }else{
            return minPriceCards || [];
        }
    }

    function formatPrice(price){
        if(price<25){
            return price.toFixed(1);
        }else{
            return Math.round(price)
        }
    }
}

export default CardPrices;