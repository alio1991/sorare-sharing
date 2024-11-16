import './WatchList.scss';
import { PlayerCard } from '../../Components/PlayerCard/PlayerCard';
import { whatchListPlayers, getWatchListPlayersWithMinPrices, whatchListPlayersLoadingFlag, updateWhatchlistPlayer } from '../../Services/store'
import { getRandomCardFromPlayerSlug } from '../../Services/cards'
import { useEffect, useState } from 'react';
import { PriceBlock } from '../../Components/PriceBlock/PriceBlock';
import { Button } from 'antd';

function WatchList() {

    const [cardsFiltered, setcardsFiltered] = useState([])
    const [inputValue, setinputValue] = useState([])
    const [isUpdatePriceButtonLoading, setisUpdatePriceButtonLoading] = useState(false)

    useEffect(() => {
        whatchListPlayers.subscribe((cards) => { setcardsFiltered(cards)})
        whatchListPlayersLoadingFlag.subscribe((bool) => setisUpdatePriceButtonLoading(bool))
    }, [])

    return (
        <div className="whatch-list-prices">
            <Button type="primary" loading={isUpdatePriceButtonLoading} onClick={() => getWatchListPlayersWithMinPrices()}> Actualizar Precios </Button>
            <div className="add-new-player">
                <input onKeyUp={ev => setinputValue(ev.target.value)} type="text" />
                <button onClick={() => addNewPayerToWatchList(inputValue)}>Añadir</button>
            </div>
            <div className="player-cards">
                {cardsFiltered
                .sort((a,b)=> b?.minPrice?.eur-a?.minPrice?.eur)
                .map((card, i)=> 
                    <div key={i} className="card-with-price">
                        <div onClick={()=> deleteCard(card.slug)} className="delete">X</div>
                        <div onClick={()=> updateWhatchlistPlayer(card)} className="update-price">$</div>
                        <PlayerCard wholeCard={card} ></PlayerCard>
                        {card?.minPrice && <div className="price-section">
                            <PriceBlock card={card}></PriceBlock>
                        </div>}
                    </div>
                )}
            </div>
        </div>
    )


    function addNewPayerToWatchList(playerSlug){
        if(whatchListPlayers.value.some(card => card.slug === playerSlug)){
            console.log('El jugador '+playerSlug+' ya está en la lista');
        }else{
            getRandomCardFromPlayerSlug(playerSlug).then(newCard => {
                whatchListPlayers.value?.filter(player => player.slug !== newCard.slug)
                whatchListPlayers.next([...whatchListPlayers.value, newCard.content.anyPlayer])
            })
        }
    }

    function deleteCard(playerSlug){
        const newList = whatchListPlayers.value.filter(card => card.slug !== playerSlug)
        whatchListPlayers.next(newList)

    }  


}

export default WatchList;