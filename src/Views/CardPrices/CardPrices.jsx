import './CardPrices.scss';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { playerCardsWithMinPrices, users, getPlayersWithMinPrices, allPlayers, playersPricesLoadingFlag, updateMinPriceOfPlayer } from '../../Services/store'
import { useEffect, useState } from 'react';
import { PriceBlock } from '../../Components/PriceBlock/PriceBlock';
import { Button } from 'antd';

function CardPrices() {

    const [minPriceCards, setminPriceCards] = useState([])
    const [allCards, setallCards] = useState([])
    const [cardsToBuy, setcardsToBuy] = useState([])

    const [filteredCards, setfilteredCards] = useState([])

    const [isUpdatePriceButtonLoading, setisUpdatePriceButtonLoading] = useState(false)

    useEffect(() => {
        allPlayers.subscribe(players => setallCards(players))
        playerCardsWithMinPrices.subscribe((cards) => setminPriceCards(cards))
        playersPricesLoadingFlag.subscribe((bool) => setisUpdatePriceButtonLoading(bool))
    }, [])
    
    useEffect(() => {
        filterOldPlayers(allCards, minPriceCards)
    }, [minPriceCards, allCards])

    return (
        <div className="card-prices">
            <h2>Precio Total Actual: {formatPrice(filteredCards.reduce((acc, card)=> card?.minPrice?.eur ? card?.minPrice?.eur+acc : acc, 0))}€</h2>
            <Button type="primary" loading={isUpdatePriceButtonLoading} onClick={() => getPlayersWithMinPrices()}> Actualizar Precios </Button>

            <div className='cards'>
                <div className="player-cards">
                    {filteredCards
                    .sort((a,b)=> b.minPrice?.eur-a.minPrice?.eur)
                    .map((card, i)=> 
                        <div key={i} className="card-with-price">
                            <div onClick={()=> updateMinPriceOfPlayer(card)} className="update-price">$</div>
                            <PlayerCard cardId={card.id} ></PlayerCard>
                            <div className="price-section">
                                <PriceBlock card={card}></PriceBlock>
                            </div>
                        </div>
                    )}
                </div>
                <div className="to-buy" onDragOver={handleDragOver} onDrop={(ev) => handleDrop(ev)}>
                        <h2 className='buy-price'>{cardsToBuy.reduce((acc, curr) => curr?.minPrice?.eur ? acc+curr?.minPrice?.eur : acc, 0).toFixed(1)}€</h2>
                        <div className='buy-cards'>
                            {cardsToBuy.map((card, i) => 
                                <div className="card" key={i}>
                                    <div onClick={()=> restoreCard(card.id)} className="delete">X</div>
                                    <PlayerCard cardId={card.id}></PlayerCard>
                                    <PriceBlock card={card}></PriceBlock>
                                </div> 
                            )}
                        </div>
                </div>
            </div>
        </div>
    )

    function restoreCard(id){
        const card = cardsToBuy.find(card=> card.id === id)
        cardsToBuy.filter(card => card.id !== id)
        setcardsToBuy(prev => prev.filter(card => card.id !== id))
        setfilteredCards(prev => [...prev, card])
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        const cardId = event.dataTransfer.getData("text/html");
        const card = minPriceCards.find(player => player.id===cardId);
        setcardsToBuy(prev => [...prev, card])
        setfilteredCards(prev => prev.filter(card => card.id !== cardId))
    }

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