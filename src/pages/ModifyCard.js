import React, { useState, useEffect, useContext, useRef } from 'react';
import { Context, actions } from '../context/context';
import { save, rando } from '../functions/globalfxns';

const ModifyCard = (props) => {
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
    const focusRef = useRef(null);
  
  
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
        
        if (card.id) {
          console.log(`Oh! This card already exists. We should modify it instead of creating it.`);
          const indexToEdit = state.cards.findIndex(cardedit => cardedit.id === card.id);
          dispatch({type: actions.EDIT_A_CARD, payload: {card: card, index: indexToEdit}});
          setFeedback({type: 'info', message: `You have modified this card successfully!`});
          return;
        }
  
        const creationTime = new Date();
        let finalizedCard = {...card};
        if (!card.creationTime) {
          finalizedCard = {...finalizedCard, creationTime: creationTime};
        }
        if (!card.id) {
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
          finalizedCard = {...finalizedCard, id: creationID};
        }
  
        setFeedback({type: 'info', message: `You have created a new card! Clearing this page if you want to make a new one.`});
        
        dispatch({type: actions.ADD_NEW_CARD, payload: finalizedCard});
  
        setCard({...card, id: undefined, type: '', topic: '', front: '', back: '', creationTime: undefined});
        focusRef.current.focus();
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
  
    useEffect(() => {
      if (props.location.state?.cardData) {
        setCard({...props.location.state.cardData});
      }
    }, [props.location.state?.cardData]);
  
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
        <textarea className='create-card' ref={focusRef} value={card.front} rows='3' cols='50' onChange={e => setCard({...card, front: e.target.value})}></textarea>
  
        <label>Back</label>
        <textarea className='create-card' value={card.back} rows='5' cols='50' onChange={e => setCard({...card, back: e.target.value})}></textarea>
  
        <button className='btn' onClick={createNewCard}>{card.id ? 'Update Card' : 'Make New Card'}</button>
  
      </div>
    )
}

export default ModifyCard;