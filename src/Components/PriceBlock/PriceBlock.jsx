import './PriceBlock.scss';

export function PriceBlock({card}){

    return( 
        <div className="price-block">
            <div className={`price ${getColor(card?.minPrice?.eur)} ${isDateRecent(card?.priceChangeDate)&&'is-recent'}`}>
                <h3>{formatPrice(card?.minPrice?.eur)}€</h3>
            </div>
            <div className={`on-sale ${card.onSale ? 'green' : ''}`}></div>
            <div className={formatPrice(card?.minPrice?.eur-card?.prevPrice?.eur)>=0 ? 'prev-price green' : 'prev-price red'}>
                <h3>{formatPrice(card?.minPrice?.eur-card?.prevPrice?.eur)}€</h3>
            </div>
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
        if(price<25){
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

