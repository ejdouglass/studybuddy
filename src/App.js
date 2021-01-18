import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import './App.css';

function rando(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const actions = {
  ADD_NEW_CARD: 'add_new_card',
  ADD_NEW_DECK: 'add_new_deck'
};

const Reducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_NEW_CARD:
      let newCardPile = [...state.cards, action.payload];
      return {...state, cards: newCardPile};
    case actions.ADD_NEW_DECK:
      let newDeckPile = [...state.decks, action.payload];
      return {...state, decks: newDeckPile};
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
          <Route exact path='/modify_deck' component={ModifyDeckComponent} />
          <Route exact path='/view_cards' component={ViewCardsComponent} />
          <Route exact path='/view_decks' component={ViewDecksComponent} />
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
      <div style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <h1>Craft Ye The Finest Studying Materials, {state.username}.</h1>
        <p>You currently have {state.cards.length} cards in your box arranged into {state.decks.length} decks.</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'row'}}>
        <button className='btn' onClick={() => history.push('/')}>Home</button>
        <button className='btn' onClick={() => history.push('/view_cards')}>My Cards</button>
        <button className='btn' onClick={() => history.push('/view_decks')}>My Decks</button>        
        <button className='btn' onClick={() => history.push('/modify_card')}>Card+</button>
        <button className='btn' onClick={() => history.push('/modify_deck')}>Deck+</button>
      </div>
    </div>
  )
}

const LandingComponent = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <h1>Hiya! This is the Landing Page. Nothing much going on here yet. Under Construction, I suppose!</h1>
      <h2>You currently have {state.cards.length} cards in your box.</h2>
      <h2>You've made {state.decks.length} decks out of these.</h2>
      <button className='btn' onClick={() => history.push('/modify_card')} >Make a New Card</button>
    </div>
  )
}

const ModifyCardComponent = () => {
  const [state, dispatch] = useContext(Context);
  // ADD: 'difficulty' marker
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


const ModifyDeckComponent = () => {
  const [state, dispatch] = useContext(Context);
  const [deck, setDeck] = useState({
    name: '',
    description: '',
    autoCategories: [],
    cards: [],
    id: undefined,
    creationTime: undefined
  });
  const [searchbar, setSearchbar] = useState('');
  const [foundCards, setFoundCards] = useState([]);
  const [feedback, setFeedback] = useState({type: 'info', message: `Make or modify a deck of cards here!`});

  function performSearch(force) {
    if (!searchbar) return;
    let searchResults = state.cards.filter(card => card.categories.indexOf(searchbar) > -1);

    if (!force) {
      setFoundCards(searchResults);
    } else if (force) {
      let newCards = [...deck.cards];
      searchResults.forEach(card => {
        let duplicate = false;
        deck.cards.forEach(currentCard => {
          if (currentCard.id === card.id) duplicate = true;
        });
        if (!duplicate) newCards.push(card);
      });
      setDeck({...deck, cards: newCards});
    }
  }

  function createDeck() {
    let errorMessage = '';
    if (!deck.name) errorMessage += `Please name the deck. `;
    if (!deck.cards.length) errorMessage += `A deck should have at least one card in it. `;
    if (errorMessage) {
      setFeedback({type: 'error', message: errorMessage});
    } else {
      setFeedback({type: 'info', message: `Looks good. Creating new deck now...`});

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
      let newDeck = JSON.parse(JSON.stringify(deck));
      newDeck.creationTime = creationTime;
      newDeck.id = creationID;

      dispatch({type: actions.ADD_NEW_DECK, payload: newDeck});

      setDeck({
        name: '',
        description: '',
        autoCategories: [],
        cards: [],
        id: undefined,
        creationTime: undefined
      });
      
      setFeedback({type: 'info', message: `Deck has been saved!`});
    }
  }

  // HERE: useEffect [] to update user's WHAT DO

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <h1>{feedback.message}</h1>
      <button className='btn small-btn' onClick={createDeck}>Create Deck</button>
      <h2>Currently, this deck has {deck.cards.length} cards in it.</h2>
      <label>Deck Name</label>
      <input type='text' className='text-input' placeholder={'Name of Deck'} value={deck.name} onChange={e => setDeck({...deck, name: e.target.value})}></input>

      <label>Search Card Categories</label>
      <div style={{display: 'flex', flexDirection: 'row', height: '60px', justifyContent: 'space-around', alignItems: 'center'}}>
        <input type='text' className='text-input' placeholder={'Search card categories'} value={searchbar} onChange={e => setSearchbar(e.target.value)}></input>
        <button className='btn small-btn' onClick={() => performSearch(false)}>Search</button>
        <button className='btn small-btn' onClick={() => performSearch(true)}>Search and Force Add</button>
      </div>

      <div className='cards-list-holder'>
        {foundCards.map((card, index) => (
          <CardPreview card={card} key={index} />
        ))}
      </div>

    </div>
  )
}


const ViewCardsComponent = () => {
  const [state, dispatch] = useContext(Context);
  // HERE: local state object for filters
  // HERE: local state for search string

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <h1>Behold! Your CARDS!</h1>
      <div className='cards-list-holder'>
        {state.cards.map((card, index) => (
        <CardPreview card={card} key={index} />
        ))}
      </div>
    </div>
  )
}

const CardPreview = (props) => {
  const {card} = props;

  return (
    <div className='card-preview'>
      <p style={{fontSize: '24px', fontWeight: '700'}}>{card.front}</p>
    </div>
  )
}


const ViewDecksComponent = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div>
      <h1>View your decks here!</h1>
    </div>
  )
}

export default App;
