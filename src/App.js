import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import './App.css';

function rando(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const actions = {
  ADD_NEW_CARD: 'add_new_card'
};

const Reducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_NEW_CARD:
      let newCardPile = [...state.cards, action.payload];
      return {...state, cards: newCardPile};
    default:
      return state;
  }
}

const initialState = {
  username: 'Card-Seeker',
  cards: [],
  decks: []
}

const Context = createContext(initialState);

const Store = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
}

const App = () => {
  return (
    <Store>
      <Router>
        <Header />
        <div className='app-body'>
          <Route exact path='/' component={LandingComponent} />
          <Route exact path='/modify_card' component={ModifyCardComponent} />
        </div>
      </Router>
    </Store>
  )
}

const Header = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  return (
    <div className='app-header' style={{display: 'flex', flexDirection: 'column'}}>
      <h1>Craft Ye The Finest Studying Materials, {state.username}.</h1>
      <p>You currently have {state.cards.length} cards in your box.</p>
    </div>
  )
}

const LandingComponent = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  return (
    <div style={{display: 'flex'}}>
      <button className='btn' onClick={() => history.push('/modify_card')} >Make a New Card</button>
    </div>
  )
}

const ModifyCardComponent = () => {
  const [state, dispatch] = useContext(Context);
  // Change to SINGLE useState object so that you can have a useEffect looking at a single variable to update user's WHAT IS DO
  const [card, setCard] = useState({
    id: undefined,
    type: '', // Thinking maybe can add optional 'type' like question, definition, etc. which could later be filtered for as well
    categories: '',
    topic: '',
    front: '',
    back: '',
    creationTime: undefined
  });
  const [feedback, setFeedback] = useState({type: 'info', message: 'Time to MAKE A NEW CARD!'});


  function createNewCard() {

    let creationFeedback = '';

    // Check if everything is okay, and if so -> create new card in global state (add to reducer, not there yet)
    // Default behavior is to zero out the page and let user know new card exists; separate button for 'Done, navigate away to whatever'

    // ADD: id, creationTime


    if (!card.categories.length) {
      creationFeedback += `Please enter at least one category for this card, so you can search and sort for it later. `;
    }
    if (card.front.length < 1) {
      creationFeedback += `Please ensure there's something written on the front of the card. `;
    }

    if (creationFeedback.length) {
      setFeedback({type: 'error', message: creationFeedback});
      console.log(`I should be sharing the error: ${creationFeedback}`)
      return;
    } else {
      // We're good to go -- create the card, update feedback, update app state with the new card, and reset this page's local card state
      // HERE: Declare a creationTime (to help make an ID), and then declare an ID, then make a new obj that'll be the payload
      let creationTime = new Date();
      let monthID = (creationTime.getMonth() + 1).toString();
      if (parseInt(monthID) < 10) monthID = 0 + monthID;

      let dateID = creationTime.getDate().toString();
      if (parseInt(dateID) < 10) dateID = 0 + dateID;

      let hoursID = creationTime.getHours();
      if (parseInt(hoursID) < 10) hoursID = 0 + hoursID;
      
      let minutesID = creationTime.getMinutes().toString();
      if (parseInt(minutesID) < 10) minutesID = 0 + minutesID;

      let secondsID = creationTime.getSeconds();
      if (parseInt(secondsID) < 10) secondsID = 0 + secondsID;

      let randoID = rando(0,9).toString() + rando(0,9).toString() + rando(0,9).toString() + rando(0,9).toString();

      let creationID = creationTime.getFullYear().toString() + monthID + dateID + hoursID + minutesID + secondsID + randoID;
      const finalizedCard = {...card, id: creationID, creationTime: creationTime};
      console.log(`Finalized card: ${JSON.stringify(finalizedCard)}`)

      // HERE: Update feedback
      setFeedback({type: 'info', message: `You have created a new card! Clearing this page if you want to make a new one.`});
      
      // HERE: Update app state with dispatch
      dispatch({type: actions.ADD_NEW_CARD, payload: finalizedCard});

      // HERE: Reset the CARD state
      setCard({id: undefined, type: '', categories: '', topic: '', front: '', back: '', creationTime: undefined});

    }

    
  }


  // HERE: useEffect [] on load to update initial user's WHAT IS DO
  
  // HERE: Another useEffect to update WHAT IS DO as user goes along and enters stuff

  // HERE: Yet another useEffect that checks any incoming params... if so, 

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
      <h1 style={{color: feedback.type === 'error' ? 'red' : 'black', textAlign: 'center', padding: '10px'}}>{feedback.message}</h1>

      <label>Card Categories (as many as you'd like, separated by commas)</label>
      <input type='text' style={{width: '50vw', padding: '10px'}} value={card.categories} onChange={e => setCard({...card, categories: e.target.value})}></input>
      
      <label>(Optional) Short Description of Card's Topic</label>
      <input type='text' style={{width: '50vw', padding: '10px'}} value={card.topic} onChange={e => setCard({...card, topic: e.target.value})}></input>

      <label>Front</label>
      <textarea className='create-card' value={card.front} rows='3' cols='50' onChange={e => setCard({...card, front: e.target.value})}></textarea>

      <label>Back</label>
      <textarea className='create-card' value={card.back} rows='5' cols='50' onChange={e => setCard({...card, back: e.target.value})}></textarea>

      <button className='btn' onClick={createNewCard}>Create</button>

    </div>
  )
}

export default App;
