import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import { Store, Context, actions } from './context/context';
import Header from './components/Header';
import Landing from './pages/Landing';
import ModifyCard from './pages/ModifyCard';
import ModifyDeck from './pages/ModifyDeck';
import ViewCards from './pages/ViewCards';
import ViewDecks from './pages/ViewDecks';
import SessionSetup from './pages/SessionSetup';
import SessionStudy from './pages/SessionStudy';
import UserPreferences from './pages/UserPreferences';
import './App.css';


const App = () => {
  return (
    <Store>
      <Router>
        <Header />
        <div className='app-body'>
          <Route exact path='/' component={Landing} />
          <Route exact path='/modify_card' component={ModifyCard} />
          <Route exact path='/modify_deck' component={ModifyDeck} />
          <Route exact path='/view_cards' component={ViewCards} />
          <Route exact path='/view_decks' component={ViewDecks} />
          <Route exact path='/session_setup' component={SessionSetup} />
          <Route exact path='/session_study' component={SessionStudy} />
          <Route exact path='/user_preferences' component={UserPreferences} />
        </div>
      </Router>
    </Store>
  )
}

export default App;

/*
  Folio Study Buddy Errata

  
*/