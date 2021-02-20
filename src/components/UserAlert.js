import React, { useContext, useState, useEffect } from 'react';
import { Context, actions } from '../context/context';
import { Title, Button, AlertContainer } from '../components/styles';

const UserAlert = () => {
    const [state, dispatch] = useContext(Context);
    const [alert, setAlert] = useState({duration: 0, type: 'info', message: ''});
    const [alertStartTime, setAlertStartTime] = useState();

    /*
        WUT DO!
        So, this should pop up a moderately attractive little informational box for the user when they need to know something.
        -- short feedback only
        -- dismissable by either time elapsed or user "X"
        -- default length of time... let's say 15sec? We'll see how that feels, adjust as necessary
        -- Basically, dispatch gets the thing, creates the alert, and then this component will process that (properly, hopefully)
        
        -- Just added backupAlerts to state... think about how to handle that later, whether a new alert just pushes the old one away, 
            or it just gets added to a stack? This app isn't that 'deep,' so may not need to get too complicated about it
    */

    useEffect(() => {
        if (state.alert.duration > 0) {
            // create new local alert
            setAlert({...state.alert});
            setAlertStartTime(new Date());
        }
        if (state.alert.duration === 0) {
            // a little clumsy, but works for now: when dismissed, global state's duration is set to 0, so we reset local state's as well
            setAlert({duration: 0, type: 'info', message: ''});
        }
    }, [state.alert]);

    useEffect(() =>{
        if (alert.duration > 0) {
            const timer = setTimeout(() => {
                setAlert({...alert, duration: alert.duration - 1});
            }, 1000);
                
            
            return () => clearTimeout(timer);
        } else {
            // Handle duration running out
            dispatch({type: actions.DISMISS_ALERT});
        }
      }, [alert.duration]);

    return (
        <>
            {alert.duration > 0 &&
            <AlertContainer>
                <Title>{alert.message} (for {alert.duration})</Title>
                <Button onClick={() => dispatch({type: actions.DISMISS_ALERT})}>Dismiss Alert</Button>
            </AlertContainer>
            }
        </>
    )
}

export default UserAlert;