import './Header.scss';
import { useEffect, useState } from 'react';
import {
    useLocation,
    useNavigate
  } from 'react-router-dom';

  import {getPlayersWithMinPrices} from '../../Services/store'
  
function Header() {
    const navigate = useNavigate();
    const location = useLocation();
  
    const [currentView, setcurrentView] = useState("/");
    useEffect(() => {
      setcurrentView(location.pathname)
      
    },[setcurrentView, location])

    return (
        <div className="header">
            <div className="menu">
                <button onClick={()=> getPlayersWithMinPrices()}>GetPlayers</button>
                <button onClick={()=> console.log(JSON.parse(localStorage.getItem('AllCardsWithPrices')))}>log local storage</button>
                {currentView!=="/" && <div className="menu-item" onClick={() => navigate('/')}>ALINEACIONES</div>}
                {currentView!=="/rejected" && <div className="menu-item" onClick={() => navigate('/rejected')}>APARTADOS</div>}
                {currentView!=="/card-prices" && <div className="menu-item" onClick={() => navigate('/card-prices')}>PRECIOS</div>}
            </div>
        </div>
    )
}

export default Header;
