import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../context/context';

const UserAlert = () => {
    const [state, dispatch] = useContext(Context);
    const [alert, setAlert] = useState({duration: 0});

    useEffect(() => {
        if (state.alert.duration > 0) {
            // create new local alert
            setAlert({...state.alert});
        }
    }, [state.alert]);

    return (
        <div>
            {alert.duration > 0 &&
                <h1>WEE OOO WEE OOO</h1>
            }
        </div>
    )
}

export default UserAlert;