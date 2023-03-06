import './Header.scss';
import { useEffect, useState } from 'react';
import {
    useLocation,
    useNavigate
  } from 'react-router-dom';

  import {loadInitialPlayers} from '../../Services/customLineups'
  
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
                <button onClick={()=> loadInitialPlayers()}>GetPlayers</button>
                {currentView==="/rejected" && <div className="menu-item" onClick={() => navigate('/')}>ALINEACIONES</div>}
                {currentView==="/" && <div className="menu-item" onClick={() => navigate('/rejected')}>APARTADOS</div>}
            </div>
        </div>
    )
}

export default Header;
