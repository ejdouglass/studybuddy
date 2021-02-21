import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, ContentContainer, Button, Title, Text, Input } from '../components/styles';

const ViewCards = () => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
    const [filter, setFilter] = useState({
      front: true,
      back: true,
      categories: true,
      description: true
    });
    const [search, setSearch] = useState('');
    const [viewedCards, setViewedCards] = useState([]);
    const [deletionDetails, setDeletionDetails] = useState({
      card: {},
      confirmDelete: false
    });
  
    function deleteCard(card) {
      setDeletionDetails({...deletionDetails, card: card});
    }
  
    useEffect(() => {
      dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/view_cards', currentAction: {}}});
    }, []);
  
    useEffect(() => {
      save(state);
      setViewedCards(state.cards); // Might have to change this due to card deletion logic? We'll see
    }, [state]);
  
    useEffect(() => {
      if (search === '') {
        setViewedCards(state.cards);
      } else {
        setViewedCards(state.cards.filter(card => {
          let searchFound = false;
          if (filter.front) {
            searchFound = card.front.includes(search);
            if (searchFound) return card;
          }
          if (filter.back) {
            searchFound = card.back.includes(search);
            if (searchFound) return card;
          }
          if (filter.categories) {
            searchFound = card.categories.includes(search);
            if (searchFound) return card;
          }
          if (filter.description) {
            searchFound = card.description?.includes(search);
            if (searchFound) return card;
          }
          return searchFound;
        }));
    }
    }, [search]);
  
    useEffect(() => {
      // Set up DELETION PROMPT RESPONSE
      if (deletionDetails.confirmDelete) {
        dispatch({type: actions.REMOVE_A_CARD, payload: deletionDetails.card.id});
        setDeletionDetails({card: {}, confirmDelete: false});
      }
      // Also set deletionDetails.card back to undefined when done
    }, [deletionDetails.confirmDelete]);
  
    return (
      <PageContainer>
  
        {deletionDetails.card?.id &&
        <ContentContainer column centered>
          <Title>Are you sure you want to delete this card?</Title>
          <ContentContainer row centered>
            <Button onClick={() => setDeletionDetails({...deletionDetails, confirmDelete: true})}>Yep</Button>
            <Button onClick={() => setDeletionDetails({...deletionDetails, card: {}})}>Nah</Button>
          </ContentContainer>
        </ContentContainer>
        }
  
        <div className='flex-centered flex-row' style={{width: '90vw', justifyContent: 'space-around', border: '1px solid black'}}>
          <Text>Search and Mod Cards</Text>
          <ContentContainer>
            <Text>Search: </Text>
            <Input type='text' value={search} onChange={e => setSearch(e.target.value)}></Input>
          </ContentContainer>
  
          <ContentContainer>
            <Text>Search Areas: </Text>
            <Button style={{backgroundColor: filter.front ? 'green' : 'red'}} onClick={() => setFilter({...filter, front: !filter.front})} >Front</Button>
            <Button style={{backgroundColor: filter.back ? 'green' : 'red'}} onClick={() => setFilter({...filter, back: !filter.back})}   >Back</Button>
            <Button style={{backgroundColor: filter.categories ? 'green' : 'red'}} onClick={() => setFilter({...filter, categories: !filter.categories})}   >Categories</Button>
            <Button style={{backgroundColor: filter.description ? 'green' : 'red'}} onClick={() => setFilter({...filter, description: !filter.description})}  >Description</Button>
          </ContentContainer>
          
        </div>

        <ContentContainer className='cards-list-holder'>
          {viewedCards.map((card, index) => (
          <CardPreview card={card} key={index} deleteCard={deleteCard} history={history}/>
          ))}
        </ContentContainer>
      </PageContainer>
    )
}

const CardPreview = (props) => {
    const {card} = props;
    const [optionsVisible, setOptionsVisible] = useState(false);
    const deleteCard = props.deleteCard;
  
    return (
      <div className='card-preview' onMouseEnter={() => setOptionsVisible(true)} onMouseLeave={() => setOptionsVisible(false)}>
        <div style={{flex: 3}}>
          <p style={{fontSize: '24px', fontWeight: '700'}}>{card.front}</p>
        </div>
        
        <div style={{visibility: optionsVisible ? 'visible' : 'hidden', flex: 1}}>
          <button>Peep</button>
          <button onClick={() => deleteCard(card)}>Delete</button>
          <button onClick={() => props.history.push('/modify_card', {cardData: card})}>Edit</button>
        </div>
  
      </div>
    )
}

export default ViewCards;