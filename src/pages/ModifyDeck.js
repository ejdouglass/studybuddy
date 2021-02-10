import React, { useContext, useState, useEffect } from 'react';
import { Context, actions } from '../context/context';
import { save, rando } from '../functions/globalfxns';
import { PageContainer } from '../components/styles';

const ModifyDeck = (props) => {
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
  
        if (deck.id) {
          console.log(`Deck already exists, we're just modifying it. Doing that now...`);
          const indexToEdit = state.decks.findIndex(deckedit => deckedit.id === deck.id);
          dispatch({type: actions.EDIT_A_DECK, payload: {deck: deck, index: indexToEdit}});
          setFeedback({type: 'info', message: 'Deck successfully updated!'});
          return;
        }
  
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
  
    function toggleCard(card) {
      const cardsIndex = deck.cards.findIndex(checkcard => checkcard.id === card.id);
      if (cardsIndex === -1) {
        // Card's not in the deck, add it
        let newDeckCards = [...deck.cards, card];
        setDeck({...deck, cards: newDeckCards});
        return;
      } else {
        // Already in the deck, toss it
        let newDeckCards = deck.cards.filter(newCard => newCard.id !== card.id);
        setDeck({...deck, cards: newDeckCards});
      }
    }
  
    useEffect(() => {
      dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/modify_deck', currentAction: {}}});
    }, []);
  
    useEffect(() => {
      save(state);
    }, [state]);
  
    useEffect(() => {
      if (props.location.state?.deckData) {
        setDeck(props.location.state.deckData);
      }
    }, [props.location.state?.deckData]);
  
    // ADD: Deck description
    // ADD: Filters for difficulty of cards (currently don't exist), maybe dual sliders for min difficulty, max difficulty
    return (
      <PageContainer>
  
        <div className='flex flex-row' style={{width: '100%', height: '100px', border: '1px solid black'}}>
          <div className='flex-centered' style={{width: '50%'}}>
            <input type='text' className='text-input' placeholder={'Name of Deck'} value={deck.name} onChange={e => setDeck({...deck, name: e.target.value})}></input>
          </div>
          <div className='flex-centered' style={{width: '50%'}}>
            <h3>{feedback.message}</h3>
          </div>
        </div>
        
        <button className='btn small-btn' onClick={createDeck}>{deck.id ? 'Modify Deck' : 'Create Deck'}</button>
        <h2>Currently, this deck has {deck.cards.length} cards in it.</h2>
        
  
        <label>Search Card Categories</label>
        <div style={{display: 'flex', flexDirection: 'row', height: '60px', justifyContent: 'space-around', alignItems: 'center'}}>
          <input type='text' className='text-input' placeholder={'Search card categories'} value={searchbar} onChange={e => setSearchbar(e.target.value)}></input>
          <button className='btn small-btn' onClick={() => performSearch(false)}>Search</button>
          <button className='btn small-btn' onClick={() => performSearch(true)}>Search and Force Add</button>
        </div>
  
        <div className='flex flex-row' style={{height: '400px', width: '100%', border: '1px solid black', padding: '10px'}}>
          {foundCards.map((card, index) => (
            <CardPicker card={card} key={index} toggleCard={toggleCard} inDeck={deck.cards.findIndex(thiscard => thiscard.id === card.id) > -1} />
          ))}
        </div>
  
      </PageContainer>
    )
}
  
const CardPicker = (props) => {
    const {card} = props;
    const inDeck = props.inDeck;
    return (
      <div style={{display: 'flex', width: '150px', height: '120px', marginRight: '10px', border: inDeck ? '2px solid black' : '1px solid #CCC', borderRadius: '10px', fontSize: '18px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: inDeck ? 'white' : '#CCC'}} onClick={() => props.toggleCard(card)}>
        {card.front}
      </div>
    )
}

export default ModifyDeck;