import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';

const SessionSetup = () => {
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

export default SessionSetup;