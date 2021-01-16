import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import './App.css';

const Reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

const initialState = {
  username: 'Card-Seeker'
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
          <Route exact path='/create_card' component={CreateCardComponent} />
        </div>
      </Router>
    </Store>
  )
}

const Header = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  return (
    <div className='app-header'>
      <h1>Craft Ye The Finest Studying Materials, {state.username}.</h1>
    </div>
  )
}

const LandingComponent = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  return (
    <div style={{display: 'flex'}}>
      <button className='btn' onClick={() => history.push('/create_card')} >Make a New Card</button>
    </div>
  )
}

const CreateCardComponent = () => {
  const [state, dispatch] = useContext(Context);
  // Change to SINGLE useState object so that you can have a useEffect looking at a single variable to update user's WHAT IS DO
  const [cardCategories, setCardCategories] = useState('');
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');

  function createNewCard() {

    // Check to make sure everything is legit, then create the new card, SAVE IT

    // Just a quick test of handling Card Categories. Easy-peasy!
    console.log(cardCategories.split(',').map(category => {
      if (category[0] === ' ') {
        return category.slice(1);
      } else {
        return category;
      }
    }));
  }

  // Possible USEEFFECT here on initial load to change user's WHAT IS DO

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
      <h1>Time to MAKE A NEW CARD!</h1>

      <label>Card Categories (type them out, separated by commas)</label>
      <input type='text' style={{width: '50vw', padding: '10px'}} value={cardCategories} onChange={e => setCardCategories(e.target.value)}></input>
      
      <label>Front</label>
      <textarea className='create-card' value={cardFront} rows='5' cols='50' onChange={e => setCardFront(e.target.value)}></textarea>

      <label>Back</label>
      <textarea className='create-card' value={cardBack} rows='5' cols='50' onChange={e => setCardBack(e.target.value)}></textarea>

      <button className='btn' onClick={createNewCard}>Create</button>

    </div>
  )
}

export default App;
