import './Header.scss';
import { useEffect, useState } from 'react';
import {
    useLocation,
    useNavigate
  } from 'react-router-dom';

  
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
                <div className={currentView!=="/" ? 'menu-item' : 'menu-item selected'} onClick={() => navigate('/')}>ALINEACIONES</div>
                <div className={currentView!=="/rejected" ? 'menu-item' : 'menu-item selected'} onClick={() => navigate('/rejected')}>APARTADOS</div>
                <div className={currentView!=="/card-prices" ? 'menu-item' : 'menu-item selected'} onClick={() => navigate('/card-prices')}>PRECIOS</div>
                <div className={currentView!=="/watch-list" ? 'menu-item' : 'menu-item selected'} onClick={() => navigate('/watch-list')}>LISTA DE SEGUIMIENTO</div>
            </div>
        </div>
    )
}

export default Header;
