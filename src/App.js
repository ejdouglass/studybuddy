import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Store } from './context/context';
import UserAlert from './components/UserAlert';
import Header from './components/Header';
import Landing from './pages/Landing';
import ModifyCard from './pages/ModifyCard';
import ModifyDeck from './pages/ModifyDeck';
import ViewCards from './pages/ViewCards';
import ViewDecks from './pages/ViewDecks';
import Syllabus from './pages/Syllabus';
import SessionSetup from './pages/SessionSetup';
import SessionStudy from './pages/SessionStudy';
import UserPreferences from './pages/UserPreferences';
import './App.css';


const App = () => {
  return (
    <Store>
      <Router>
        <Header />
        <UserAlert />
        <Route exact path='/' component={Landing} />
        <Route exact path='/modify_card' component={ModifyCard} />
        <Route exact path='/modify_deck' component={ModifyDeck} />
        <Route exact path='/view_cards' component={ViewCards} />
        <Route exact path='/view_decks' component={ViewDecks} />
        <Route exact path='/session_setup' component={SessionSetup} />
        <Route exact path='/session_study' component={SessionStudy} />
        <Route exact path='/user_preferences' component={UserPreferences} />
        <Route exact path='/syllabus' component={Syllabus} />
      </Router>
    </Store>
  )
}

export default App;

/*
  Folio Study Buddy Errata

  FRESH EYES version
  
  DEV
  -- Add way to toggle timer. Can set default "timer visible" or "timer hidden" as a user pref.

  DESIGN
  -- Make it LESS UGLY, holy crap. Page by page, identify the working elements and have at it. Resize fonts, as well.
  

*/