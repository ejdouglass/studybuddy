import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import './App.css';

function save(state) {
  window.localStorage.setItem('studyBuddyData', JSON.stringify(state));
}

function load() {
  return window.localStorage.getItem('studyBuddyData');
}

function rando(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const actions = {
  ADD_NEW_CARD: 'add_new_card',
  ADD_NEW_DECK: 'add_new_deck',
  UPDATE_WHATDO: 'update_whatdo',
  LOAD_SAVED_DATA: 'load_saved_data'
};

const Reducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_NEW_CARD:
      let newCardPile = [...state.cards, action.payload];
      return {...state, cards: newCardPile};
    case actions.ADD_NEW_DECK:
      let newDeckPile = [...state.decks, action.payload];
      return {...state, decks: newDeckPile};
    case actions.UPDATE_WHATDO:
      // We'll test it out, but we're expecting a payload object with page URL and currentAction object, if applicable
      // Specifically, page and currentAction
      return {...state, whatdo: action.payload};
    case actions.LOAD_SAVED_DATA:
      return action.payload;
    default:
      return state;
  }
}

const initialState = {
  username: 'Card-Seeker',
  whatdo: {
    page: '/',
    currentAction: {}
  },
  cards: [],
  decks: [],
  sessions: [],
  history: {},
  settings: {
    font: 'default'
  }
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
          <Route exact path='/session_setup' component={SessionSetupComponent} />
          <Route exact path='/session_study' component={SessionStudyComponent} />
          <Route exact path='/user_preferences' component={UserPreferencesComponent} />
        </div>
      </Router>
    </Store>
  )
}

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

const LandingComponent = () => {
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
      // ADD: Logic for when the ID already exists so we don't give an old card a new ID. I mean, that'd be fine, but unnecessary.
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

      setFeedback({type: 'info', message: `You have created a new card! Clearing this page if you want to make a new one.`});
      
      dispatch({type: actions.ADD_NEW_CARD, payload: finalizedCard});

      setCard({...card, id: undefined, type: '', topic: '', front: '', back: '', creationTime: undefined});
    }

    
  }


  // HERE: useEffect [] on load to update initial user's WHAT IS DO
  
  // HERE: Another useEffect to update WHAT IS DO as user goes along and enters stuff

  // HERE: Yet another useEffect that checks any incoming params, if so, load up for EDIT MODE instead of CREATE MODE

  useEffect(() => {
    dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/modify_card', currentAction: {}}});
  }, []);

  useEffect(() => {
    save(state);
  }, [state]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
      <h1 style={{color: feedback.type === 'error' ? 'red' : 'black', textAlign: 'center', padding: '10px'}}>{feedback.message}</h1>

      <label>Card Categories (as many as you'd like, separated by commas)</label>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <input type='text' style={{width: '50vw', padding: '10px'}} value={card.categories} onChange={e => setCard({...card, categories: e.target.value})}></input>
        <button className='btn small-btn' style={{marginLeft: '10px'}} onClick={() => setCard({...card, categories: ''})}>Clear</button>
      </div>
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

  useEffect(() => {
    dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/modify_deck', currentAction: {}}});
  }, []);

  useEffect(() => {
    save(state);
  }, [state]);

  // ADD: Deck description
  // ADD: Filters for difficulty of cards (currently don't exist), maybe dual sliders for min difficulty, max difficulty
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

  useEffect(() => {
    dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/view_cards', currentAction: {}}});
  }, []);

  useEffect(() => {
    save(state);
  }, [state]);

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

  useEffect(() => {
    dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/view_decks', currentAction: {}}});
  }, []);

  useEffect(() => {
    save(state);
  }, [state]);

  return (
    <div>
      <h1>View your decks here!</h1>
      <div className='decks-list-holder'>
        {state.decks.map((deck, index) => (
          <DeckPreview key={index} deck={deck} />
        ))}
      </div>
    </div>
  )
}

const DeckPreview = (props) => {
  const {deck} = props;

  return (
    <div className='deck-preview'>
      <h2>{deck.name}</h2>
    </div>
  )
}



const SessionSetupComponent = () => {
  const [state, dispatch] = useContext(Context);
  const [sessionPrep, setSessionPrep] = useState({
    decksToChoose: state.decks,
    decksToUse: [],
    sessionEndCondition: undefined,
    sessionEndNumber: 5
  })
  const history = useHistory();

  function addDeckToSession(deck) {
    // THIS FXN: Take deck from Choose to Use, adjusting both
    let toChoose = sessionPrep.decksToChoose.filter(oldDeck => oldDeck.id !== deck.id);
    let toUse = [...sessionPrep.decksToUse];
    toUse.push(deck);
    setSessionPrep({... sessionPrep, decksToChoose: toChoose, decksToUse: toUse});
  }

  function removeDeckFromSession(deck) {
    let toUse = sessionPrep.decksToUse.filter(oldDeck => oldDeck.id !== deck.id);
    let toChoose = [...sessionPrep.decksToChoose];
    toChoose.push(deck);
    setSessionPrep({... sessionPrep, decksToChoose: toChoose, decksToUse: toUse});
  }

  function goStudy() {
    const sessionData = {
      decks: [...sessionPrep.decksToUse],
      endWhen: sessionPrep.sessionEndCondition,
      endAt: sessionPrep.sessionEndNumber
    }
    if (sessionData.decks.length < 1) alert(`You gotta choose at least one deck there, chief.`)
    else history.push('/session_study', {sessionData: sessionData})
  }

  /*
    For this component...
    -- select session details/plan, like "once through" or "unlimited iterations"
    -- pass this all to SessionStudy to begin the session
    -- add barrier to user going to next page if
  */

  useEffect(() => {
    dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/session_setup', currentAction: {}}});
  }, []);

  useEffect(() => {
    save(state);
    // The below is a pretty good "catch" for users reloading onto this page, but only assuming they haven't set up their session yet.
    // Whatdo will have a bit of challenge with this one!
    setSessionPrep({...sessionPrep, decksToChoose: state.decks});
  }, [state]);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <h1>Session Setup</h1>
      
      {/* HERE: Menu for session deets  */}
      <div id='session-details-menu'>
        
        
        <h2>For this session, we'll keep going through the deck(s) until...</h2>
        <div style={{display: 'flex', flexDirection: 'row', width: '80vw'}}>

          <div style={{display: 'flex', flex: '2', flexDirection: 'row', justifyContent: 'space-around'}}>
            <button className='btn small-btn' onClick={() => setSessionPrep({...sessionPrep, sessionEndCondition: 'time'})}>we reach a time limit</button>
            <button className='btn small-btn' onClick={() => setSessionPrep({...sessionPrep, sessionEndCondition: 'iterations'})}>we go through all cards X times</button>
            <button className='btn small-btn' onClick={() => setSessionPrep({...sessionPrep, sessionEndCondition: 'user'})}>we choose to end the session</button>
          </div>

          <div style={{flex: '1'}}>
            {sessionPrep.sessionEndCondition === 'time' &&
            <div>
              <h3>Set Time Limit</h3>
              <select value={sessionPrep.sessionEndNumber} onChange={e => setSessionPrep({...sessionPrep, sessionEndNumber: e.target.value})}>
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={20}>20 min</option>
                <option value={25}>25 min</option>
                <option value={30}>30 min</option>
                <option value={35}>35 min</option>
                <option value={40}>40 min</option>
                <option value={45}>45 min</option>
              </select>
            </div>
            }
            {sessionPrep.sessionEndCondition === 'iterations' &&
            <div>
              <h3>Set Iterations Limit</h3>
              <input type='number' value={sessionPrep.sessionEndNumber} min={1} max={100} onChange={e => setSessionPrep({...sessionPrep, sessionEndNumber: e.target.value})}></input>
            </div>
            }
            {sessionPrep.sessionEndCondition === 'user' &&
            <div>
              <h3>You Good</h3>
            </div>
            }
          </div>

        </div>

      </div>

      <h2>Select Decks to Study With</h2>
      <div id='session-cards-choose-menu'>
        <div id='decks-to-choose' className='session-setup-decks'>
          {sessionPrep.decksToChoose.map((deck, index) => (<button key={index} className='btn' onClick={() => addDeckToSession(deck)}>{deck.name}</button>))}
        </div>

        <div id='decks-to-use' className='session-setup-decks'>
          {sessionPrep.decksToUse.map((deck, index) => (<button key={index} className='btn' onClick={() => removeDeckFromSession(deck)}>{deck.name}</button>))}
        </div>
      </div>

      <button className='btn small-btn'>(({'<=='}ADD ALL VISIBLE DECKS BTN))</button>

      <button className='btn' onClick={goStudy}>{sessionPrep.decksToUse.length > 0 ? 'READY TO STUDY!' : 'Choose 1+ Deck(s)'}</button>

    </div>
  )
}



const SessionStudyComponent = (props) => {
  const [state, dispatch] = useContext(Context);
  const [sessionData, setSessionData] = useState({
    startTime: undefined,
    timeElapsed: 0,
    decks: [],
    cards: [],
    currentCardIndex: 0,
    currentCardFace: 'front',
    endWhen: undefined,
    endAt: undefined
  });
  const [studyTime, setStudyTime] = useState('0:00');
  

  /*
    For this component...
    -- be able to set a timer/show a timer for the session
    -- be able to know when the session is 'complete' either by hitting time, hitting end of deck, or by user declaration (already defined, just gotta use it)
    -- add keyboard shortcuts 
    -- keep track of how the session went and store that info on an ongoing basis in session data (history) and personal history
      \_ little unsure of this "double storage" concept, feels redundant, but we'll try it and see how it goes
    -- Post-session "results" data, including breakdown of mastery levels (visually pleasing way ideally-eventually), ability to make sub-deck of troublemakers
    -- Add ability to "save" these sessions, including the settings and history
    -- Add the option to "hide timer" OR "conditionally hide timer" i.e. let me know every once in awhile or when I have X time left
      \_ Fairly 'advanced' and not super necessary option, but would be nice to have at some point
  */

  function startSession() {
    // HERE: Maybe throw in a quick shuffle here; otherwise the card order will be incredibly predictable :P
    // Alternatively, can randomize where the Next card takes you, but that would involve more convoluted logic, I think.
    setSessionData({...sessionData, startTime: new Date()});
  }

  function flipCurrentCard() {
    let newCardFace = sessionData.currentCardFace === 'front' ? 'back' : 'front';
    setSessionData({...sessionData, currentCardFace: newCardFace});
  }

  function changeCurrentCard(amount) {
    switch (amount) {
      case 1:
        if (sessionData.currentCardIndex + 1 <= sessionData.cards.length - 1) setSessionData({...sessionData, currentCardIndex: sessionData.currentCardIndex + 1})
        else setSessionData({...sessionData, currentCardIndex: 0}); // Change this ultimately to a HANDLE_END_OF_CARDS fxn, which changes based on 'mode'
        break;
      case -1:
        if (sessionData.currentCardIndex - 1 >= 0) setSessionData({...sessionData, currentCardIndex: sessionData.currentCardIndex - 1});
        break;
      default:
        break;
    }
  }

  
  function updateCardMastery(level) {
    // Feels clumsy, but let's see how it works...
    let sessionCopy = JSON.parse(JSON.stringify(sessionData));
    sessionCopy.cards[sessionData.currentCardIndex].mastery = level;
    setSessionData(sessionCopy);
  }

  useEffect(() => {
    const session = JSON.parse(JSON.stringify(props.location.state.sessionData));
    let sessionCards = [];
    // COULD potentially throw the 'mastery' var for the card on each here, initialized to 0... ok, let's try that.
    // session.decks.forEach(deck => deck.cards.forEach(card => sessionCards.push(card))); // 'old' way
    session.decks.forEach(deck => deck.cards.forEach(card => {
      card.mastery = 0;
      sessionCards.push(card);
    }));
    setSessionData({...sessionData, 
      decks: session.decks.map(deck => deck.id), 
      cards: sessionCards, 
      endWhen: session.endWhen, 
      endAt: session.endAt,
      startTime: new Date()
    });
  }, [props.location.state.sessionData]);

  // Ok, dependency array to the rescue! Adding studyTime made it work a LOT better, doesn't 'hang' when doing other stuff.
  useEffect(() =>{
    const timer = setTimeout(() => {
      // JSON parsing-stringing for the updateCardMastery broke this, but making a new Date() out of the startTime covers our bases
      let timeInMS = +new Date() - +new Date(sessionData.startTime);
      let timeInMin = Math.floor(timeInMS / 1000 / 60);
      let timeInSec = Math.floor((timeInMS - (timeInMin * 1000 * 60)) / 1000);
      if (timeInSec < 10) timeInSec = '0' + timeInSec;
      let comparableTime = timeInMin.toString() + ':' + timeInSec.toString();
      console.log(comparableTime);
      if (comparableTime === 'NaN:NaN') comparableTime = '0:01'; //Fixing a problem I don't understand, but effectively! :P
      setStudyTime(comparableTime);
    }, 1000);

    // In the meantime, it flashes "NaN" for the first 'tick' and then rights itself? Weird. :P It's at 0:01 it's a bit... 'special.'
    // let intervalTimer = setInterval(() => {
    //   let timeInMS = +new Date() - +new Date(sessionData.startTime);
    //   let timeInMin = Math.floor(timeInMS / 1000 / 60);
    //   let timeInSec = Math.floor((timeInMS - (timeInMin * 6000 * 60)) / 1000);
    //   if (timeInSec < 10) timeInSec = '0' + timeInSec;
    //   setStudyTime(timeInMin.toString() + ':' + timeInSec.toString());
    // }, 1000)
    

    return () => clearTimeout(timer);

    // return () => clearInterval(intervalTimer);
  }, [studyTime]);

  // Add in conditional rendering for the param data; if not found, offer to redirect user back to set them up
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

      {!sessionData.startTime &&
      <div className='flex-centered flex-col'>
        <h1>Time to study, buddy!</h1>
        {/* HERE: Quick overview of what you're about to study with READY/BEGIN button */}
        <button className='btn' onClick={startSession}>Begin!</button>
      </div>
      }

      {sessionData.startTime &&
      <div className='flex-centered flex-col'>
        <h1>You ARE studying, buddy! You're on card {sessionData.currentCardIndex + 1} of {sessionData.cards.length}.</h1>

        <div>
          <h3>Study Time: {studyTime}</h3>
        </div>

        <div className='flex-centered' style={{width: '500px', height: '300px', border: '1px solid black'}}>
          <textarea style={{border: '0', width: '490px', height: '200px', textAlign: 'center', resize: 'none', fontSize: '24px', fontFamily: 'sans-serif'}} value={sessionData.currentCardFace === 'front' ? sessionData.cards[sessionData.currentCardIndex].front : sessionData.cards[sessionData.currentCardIndex].back} readOnly={true}></textarea>
        </div>
        <button className='btn' onClick={flipCurrentCard}>FLIP!</button>

        <h3>Mastery Level (currently {sessionData.cards[sessionData.currentCardIndex].mastery})</h3>
        <div className='flex-centered flex-row'>
          <button className='btn btn-small' onClick={() => updateCardMastery(1)}>NO idea at all...</button>
          <button className='btn btn-small' onClick={() => updateCardMastery(2)}>Still super difficult/unfamiliar.</button>
          <button className='btn btn-small' onClick={() => updateCardMastery(3)}>It makes sense, but gotta think about it.</button>
          <button className='btn btn-small' onClick={() => updateCardMastery(4)}>It's pretty easy.</button>
          <button className='btn btn-small' onClick={() => updateCardMastery(5)}>Easy as pie-cake, effortless.</button>
        </div>

        <button className='btn small-btn' onClick={() => changeCurrentCard(1)}>Next Card</button>

      </div>
      }

    </div>
  )
}




const UserPreferencesComponent = () => {
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/user_preferences', currentAction: {}}});
  }, []);

  useEffect(() => {
    save(state);
  }, [state]);

  return (
    <div className='flex-centered flex-col'>
      <h1>User Preferences</h1>
      <div className='flex-centered flex-row'>
        <h3>Choose a Font</h3>
        <button className='btn small-btn'>Font 1</button>
        <button className='btn small-btn'>Font 2</button>
      </div>
      <div>
        <button className='btn'>CLEAR APP DATA</button>
      </div>
      <div>
        <button className='btn small-btn'>Export Data</button>
      </div>
    </div>
  )
}



export default App;
