import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Context } from '../context/context';

const SessionStudy = (props) => {
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
  
    const [state, dispatch] = useContext(Context);
    const [sessionData, setSessionData] = useState({
      startTime: undefined,
      timeElapsed: 0,
      decks: [],
      cards: [],
      currentCardIndex: 0,
      currentCardFace: 'front',
      iterations: 0,
      endWhen: undefined,
      endAt: undefined,
      finished: false
    });
    const [studyTime, setStudyTime] = useState('0:00');
    const keysDown = useRef({
      Alt: false,
      ArrowLeft: false,
      ArrowRight: false,
      ArrowDown: false,
      ArrowUp: false,
      Control: false,
      s: false,
      f: false
    });
    const answerRef = useRef(null);
    const keyDownCB = useCallback(keyEvent => {
      handleKeyDown(keyEvent);
    }, [handleKeyDown]);
    const keyUpCB = useCallback(keyEvent => {
      handleKeyUp(keyEvent);
    }, [handleKeyUp]);
  
    function handleKeyDown(e) {
      // e.preventDefault(); // This is fighting with other stuff I want the user to be able to do, so cutting it for noooow...
      // UPDATE: Yeah, we need a separate MODE CHECK here that's activated when the user is giving an answer :P
  
      if (!keysDown.current[e.key] && document.activeElement !== answerRef.current) {
        e.preventDefault();
        keysDown.current[e.key] = true;
        if (keysDown.current.f) flipCurrentCard();
        if (keysDown.current.ArrowRight) changeCurrentCard(1);
        if (keysDown.current[1]) updateCardMastery(1);
        if (keysDown.current[2]) updateCardMastery(2);
        if (keysDown.current[3]) updateCardMastery(3);
        if (keysDown.current[4]) updateCardMastery(4);
        if (keysDown.current[5]) updateCardMastery(5);
        if (keysDown.current.a) answerRef.current.focus();
      }
    }
  
    function handleKeyUp(e) {
      keysDown.current[e.key] = false;
    }
  
    function startSession() {
      // setSessionData({...sessionData, startTime: new Date()});
    }
  
    function flipCurrentCard() {
      let newCardFace = sessionData.currentCardFace === 'front' ? 'back' : 'front';
      setSessionData({...sessionData, currentCardFace: newCardFace});
    }
  
    function changeCurrentCard(amount) {
      switch (amount) {
        case 1:
          if (sessionData.currentCardIndex + 1 <= sessionData.cards.length - 1) setSessionData({...sessionData, currentCardIndex: sessionData.currentCardIndex + 1, currentCardFace: 'front'})
          else setSessionData({...sessionData, iterations: sessionData.iterations + 1});
          break;
        case -1:
          if (sessionData.currentCardIndex - 1 >= 0) setSessionData({...sessionData, currentCardIndex: sessionData.currentCardIndex - 1, currentCardFace: 'front'});
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
  
    function finishSession() {
      // THIS FXN: End the session. If the user ended it and it hadn't naturally met its "done" conditions, note that.
      setSessionData({...sessionData, finished: true});
      // HERE: Push results of session to personal history
    }
  
    function updateAnswer(value) {
      let sessionCards = JSON.parse(JSON.stringify(sessionData.cards));
      sessionCards[sessionData.currentCardIndex].answer = value;
      setSessionData({...sessionData, cards: sessionCards});
    }
  
    useEffect(() => {
      if (sessionData.endWhen === 'iterations' && sessionData.iterations >= sessionData.endAt) finishSession()
      else setSessionData({...sessionData, currentCardIndex: 0});
    }, [sessionData.iterations]);
  
    useEffect(() => {
      const session = JSON.parse(JSON.stringify(props.location.state.sessionData));
      let sessionCards = [];
      // COULD potentially throw the 'mastery' var for the card on each here, initialized to 0... ok, let's try that.
      // session.decks.forEach(deck => deck.cards.forEach(card => sessionCards.push(card))); // 'old' way
      session.decks.forEach(deck => deck.cards.forEach(card => {
        card.mastery = 0;
        sessionCards.push(card);
      }));
      sessionCards.sort(() => Math.random() - 0.5);
      setSessionData({...sessionData, 
        decks: session.decks.map(deck => deck.id), 
        cards: sessionCards, 
        endWhen: session.endWhen, 
        endAt: session.endAt,
        startTime: new Date()
      });
    }, [props.location.state.sessionData]);
  
    // ADD: If we're doing time-bound, check for hitting the time limit in here, and if limit's hit, fire off the finishSession() fxn
    useEffect(() =>{
      const timer = setTimeout(() => {
        // JSON parsing-stringing for the updateCardMastery broke this, but making a new Date() out of the startTime covers our bases
        let timeInMS = +new Date() - +new Date(sessionData.startTime);
        let timeInMin = Math.floor(timeInMS / 1000 / 60);
  
        if (sessionData.endWhen === 'time' && timeInMin >= sessionData.endAt) {
          finishSession();
          return;
        }
  
        let timeInSec = Math.floor((timeInMS - (timeInMin * 1000 * 60)) / 1000);
        if (timeInSec < 10) timeInSec = '0' + timeInSec;
        let comparableTime = timeInMin.toString() + ':' + timeInSec.toString();
        if (comparableTime === 'NaN:NaN') comparableTime = '0:01'; // Fixing a problem I don't understand, but effectively! :P
        setStudyTime(comparableTime);
      }, 1000);
      
  
      return () => clearTimeout(timer);
    }, [studyTime]);
  
    useEffect(() => {
      window.addEventListener('keydown', keyDownCB);
      window.addEventListener('keyup', keyUpCB);
  
      return () => {
        window.removeEventListener('keydown', keyDownCB);
        window.removeEventListener('keyup', keyUpCB);
      }
    }, [keyDownCB, keyUpCB]);
  
    // Add in conditional rendering for the param data; if not found, offer to redirect user back to set them up
    return (
      <div style={{width: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
  
        {!sessionData.startTime &&
        <div className='flex-centered flex-col'>
          <h1>Time to study, buddy!</h1>
          {/* HERE: Quick overview of what you're about to study with READY/BEGIN button */}
          <button className='btn' onClick={startSession}>Begin!</button>
        </div>
        }
  
        {(sessionData.startTime && !sessionData.finished) &&
        <div className='flex-centered flex-col' style={{width: '100%'}}>
          <h1>You ARE studying, buddy! You're on card {sessionData.currentCardIndex + 1} of {sessionData.cards.length}.</h1>
  
          <div>
            <h3>Study Time: {studyTime}</h3>
          </div>
  
          <div className='flex flex-row' style={{width: '90%', border: '1px solid black', justifyContent: 'space-around', alignItems: 'center'}}>
            <div className='flex-centered flex-col'>
              <h3>Mastery Level:{sessionData.cards[sessionData.currentCardIndex].mastery}</h3>
              <button className='select-mastery-btn' onClick={() => updateCardMastery(1)}>NO idea at all...</button>
              <button className='select-mastery-btn' onClick={() => updateCardMastery(2)}>Still super difficult/unfamiliar.</button>
              <button className='select-mastery-btn' onClick={() => updateCardMastery(3)}>It makes sense, but gotta think about it.</button>
              <button className='select-mastery-btn' onClick={() => updateCardMastery(4)}>It's pretty easy.</button>
              <button className='select-mastery-btn' onClick={() => updateCardMastery(5)}>Easy as pie-cake, effortless.</button>
            </div>
  
            <div className='flex-centered' style={{width: '500px', height: '300px', border: '1px solid black'}}>
              <textarea style={{border: '0', width: '490px', height: '200px', textAlign: 'center', resize: 'none', fontSize: '24px', fontFamily: 'sans-serif'}} value={sessionData.currentCardFace === 'front' ? sessionData.cards[sessionData.currentCardIndex].front : sessionData.cards[sessionData.currentCardIndex].back} readOnly={true}></textarea>
            </div>
  
            <div className='flex flex-col'>
              <h3>Viewing Card's {sessionData.currentCardFace.toUpperCase()}</h3>
              <button className='btn' onClick={flipCurrentCard}>(F)LIP!</button>
              <button className='btn small-btn' onClick={() => changeCurrentCard(1)}>Next Card</button>
            </div>
          </div>
  
          <div>
            <button onClick={finishSession}>Finish Studying</button>
          </div>
          
          <div style={{width: '60%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <textarea ref={answerRef} placeholder={'Tap (a) key to focus this answer section'} style={{padding: '10px', border: '1px solid black', width: '100%', height: '200px', textAlign: 'center', resize: 'none', fontSize: '24px', fontFamily: 'sans-serif'}} value={sessionData.cards[sessionData.currentCardIndex].answer} onChange={e => updateAnswer(e.target.value)}></textarea>
          </div>
          
  
        </div>
        }
  
        {sessionData.finished && 
        <div>
          <h1>Study Session OVER!</h1>
          <h2>Results: You did it.</h2>
          {/* HERE: Display more session data */}
        </div>
        }
  
      </div>
    )
}

export default SessionStudy;