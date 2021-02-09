import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';

const Landing = () => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
  
    useEffect(() => {
      dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/', currentAction: {}}});
    }, []);
  
    useEffect(() => {
      save(state);
    }, [state]);
  
    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h1>Hiya! This is the Landing Page. Nothing much going on here yet. Under Construction, I suppose!</h1>
        <h2>You currently have {state.cards.length} cards in your box.</h2>
        <h2>You've made {state.decks.length} decks out of these.</h2>
        <button className='btn' onClick={() => history.push('/modify_card')} >Make a New Card</button>
      </div>
    )
}

export default Landing;