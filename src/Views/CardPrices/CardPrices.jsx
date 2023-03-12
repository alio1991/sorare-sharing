import './CardPrices.scss';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { playerCardsWithMinPrices, users } from '../../Services/store'
import { useEffect, useState } from 'react';

function CardPrices() {

    const [cardsFiltered, setcardsFiltered] = useState([])

    useEffect(() => {
        playerCardsWithMinPrices.subscribe((cards) => { setcardsFiltered(cards)})
    }, [])

    return (
        <div className="card-prices">
            <div className="player-cards">
                {cardsFiltered
                .sort((a,b)=> b.minPrice.eur-a.minPrice.eur)
                .map((card, i)=> 
                    <div key={i} className="card-with-price">
                        <PlayerCard cardId={card.id} ></PlayerCard>
                        <div className="price-section">
                            <div className={`price ${getColor(card.minPrice.eur)}`}>
                                <h3>{formatPrice(card.minPrice.eur)}€</h3>
                            </div>
                            <div className={`on-sale ${card.onSale ? 'green' : ''}`}></div>
                            {/* <h3>{card.onSale ? 'EN VENTA' : ''}</h3> */}
                            <div className={`buy-price`}>
                                <h3>{formatPrice(card.token.ownershipHistory.filter(elem => users.value.includes(elem.user.nickname))[0]?.priceFiat.eur)}€</h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

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

export default CardPrices;