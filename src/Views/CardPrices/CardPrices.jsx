import './CardPrices.scss';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { playerCardsWithMinPrices } from '../../Services/store'
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
                        <div className={`price ${getColor(card.minPrice.eur)}`}><h3>{card.minPrice.eur.toFixed(2)}€</h3></div>
                    </div>
                )}
            </div>
        </div>
    )

    function getColor(price){
        if(price > 100){
            console.log(price);
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