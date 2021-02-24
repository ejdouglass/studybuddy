import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { load } from '../functions/globalfxns';
import { AppHeader, NavContainer, NavButton } from '../components/styles';

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
      <AppHeader className='app-header' style={{display: 'flex', flexDirection: 'column'}}>
        <NavContainer>
          <NavButton onClick={() => history.push('/')}>Home</NavButton>
          <NavButton onClick={() => history.push('/notes')}>My Notes</NavButton>
          <NavButton onClick={() => history.push('/syllabus')}>Syllabus</NavButton>
          <NavButton onClick={() => history.push('/session_setup')}>Study!</NavButton>
          <NavButton onClick={() => history.push('/modify_card')}>Create Cards</NavButton>
          <NavButton onClick={() => history.push('/view_cards')}>My Cards</NavButton>
          <NavButton onClick={() => history.push('/modify_deck')}>Create Decks</NavButton>
          <NavButton onClick={() => history.push('/view_decks')}>My Decks</NavButton>        
          <NavButton onClick={() => history.push('/user_preferences')}>Settings</NavButton>
        </NavContainer>
      </AppHeader>
    )
}

export default Header;