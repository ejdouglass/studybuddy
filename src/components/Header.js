import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { load } from '../functions/globalfxns';

const Header = () => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
  
    useEffect(() => {
      // Fires when app 'loads' freshly, so using this space for all loading logic
      let loadedData = load();
      if (loadedData) {
        loadedData = JSON.parse(loadedData);
        dispatch({type: actions.LOAD_SAVED_DATA, payload: loadedData});
        console.log(loadedData);
        history.push(loadedData.whatdo.page);
      } else {
        history.push('/');
      }
      
    }, [dispatch]);
  
    return (
      <div className='app-header' style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <h1>Craft Ye The Finest Studying Materials, {state.username}.</h1>
          <p>You currently have {state.cards.length} cards in your box arranged into {state.decks.length} decks.</p>
        </div>
  
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <button className='btn' onClick={() => history.push('/')}>Home</button>
          <button className='btn' onClick={() => history.push('/user_preferences')}>User Stuff</button>
          <button className='btn' onClick={() => history.push('/view_cards')}>My Cards</button>
          <button className='btn' onClick={() => history.push('/view_decks')}>My Decks</button>        
          <button className='btn' onClick={() => history.push('/modify_card')}>Card+</button>
          <button className='btn' onClick={() => history.push('/modify_deck')}>Deck+</button>
          <button className='btn' onClick={() => history.push('/session_setup')}>Study!</button>
        </div>
      </div>
    )
}

export default Header;