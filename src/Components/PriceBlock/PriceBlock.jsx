import { useEffect, useState } from 'react';
import './PriceBlock.scss';
import { users } from '../../Services/store';

export function PriceBlock({card}){

    const [buyPrice, setbuyPrice] = useState(0);

    useEffect(()=> {
        const ownUsers = users.value;
        const ownTransactions = card?.token?.ownershipHistory.filter(transaction => ownUsers.includes(transaction.user.nickname))
        if(ownTransactions){
            const lastTransaction = ownTransactions.sort((a,b)=> a.from>b.from)[0];
            const BuyPrice = lastTransaction?.priceFiat.eur;
            setbuyPrice(BuyPrice)
        }
    }, [card])

    return( 
        <div className="price-block">
            <div className={`price ${getColor(card?.minPrice?.eur)} ${isDateRecent(card?.priceChangeDate)&&'is-recent'}`}>
                <h3>{formatPrice(card?.minPrice?.eur)}€</h3>
            </div>
            {formatPrice(buyPrice)&&<div className={`on-sale ${card.onSale ? 'green' : 'normal'}`}><h3>{formatPrice(buyPrice) ? formatPrice(buyPrice)+'€': ""}</h3></div>}
            {formatPrice(card?.minPrice?.eur-card?.prevPrice?.eur) ? <div className={formatPrice(card?.minPrice?.eur-card?.prevPrice?.eur)>=0 ? 'prev-price price-border green' : 'prev-price price-border red'}>
                <h3>{formatPrice(card?.minPrice?.eur-card?.prevPrice?.eur)}€</h3>
            </div> : <div className="prev-price"></div>}
            
        </div>
    );


    function isDateRecent(date){
        const minutesMargin = 10;
        if(date){
            const milisecondsLimit = 60_000*minutesMargin;
            const currentMiliseconds = new Date().getTime();
            const cardPriceMiliseconds = new Date(date)
            const isRecent = currentMiliseconds-cardPriceMiliseconds<milisecondsLimit;
            return isRecent;
        }
        return false;
    }

    function formatPrice(price){
        if(!price || price === 0){
            return ""
        }else if(price<10){
            return price.toFixed(1);
        }else{
            return Math.round(price)
        }
    }

    function getColor(price){
        if(price > 100){
            return 'green'
        }else if(price > 29){
            return 'light-green'
        }else if(price > 5){
            return 'yellow'
        }else if(price > 1){
            return 'orange'
        }else{
            return 'red'
        }
    }
}

