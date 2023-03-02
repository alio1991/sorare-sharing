import { useState } from 'react';
import './UserTag.scss';

export function UserTag({name, onUsetTagSelected}){

    const [selected, setselected] = useState(true)

    return(
        <div className={`user-tag ${selected&&'selected'}`} onClick={()=> {onUsetTagSelected(name.toLowerCase(), !selected); setselected(prev => !prev)}}>
            <h3>{name}</h3>
        </div>
    );
}

