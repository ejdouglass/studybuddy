import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, ColumnContainer, ContentContainer, Button, Title, Text, Input, DeckCard, CardCollection, RowContainer } from '../components/styles';

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
  
        <RowContainer>
          <ContentContainer>
            <Text>Search: </Text>
            <Input wide type='text' placeholder={`(search cards for words or phrases)`} value={search} onChange={e => setSearch(e.target.value)}></Input>
          </ContentContainer>
  
          <ContentContainer>
            <Text>Card Parts Searched: </Text>
            <Button grayed={!filter.front} onClick={() => setFilter({...filter, front: !filter.front})}>Front</Button>
            <Button grayed={!filter.back} onClick={() => setFilter({...filter, back: !filter.back})}>Back</Button>
            <Button grayed={!filter.categories} onClick={() => setFilter({...filter, categories: !filter.categories})}>Categories</Button>
            <Button grayed={!filter.description} onClick={() => setFilter({...filter, description: !filter.description})}>Description</Button>
          </ContentContainer>
        </RowContainer>

        <CardCollection>
          {viewedCards.map((card, index) => (
            <CardPreview card={card} key={index} deleteCard={deleteCard} history={history}/>
          ))}
          {state.cards.length === 0 && (
            <ColumnContainer>
              <Title>You can't search your cards until you make some!</Title>
              <Button onClick={() => history.push('/modify_card')}>Go Make Cards!</Button>
            </ColumnContainer>
          )
          }
        </CardCollection>

        {deletionDetails.card?.id &&
        <ContentContainer column centered>
          <Title>Are you sure you want to delete this card?</Title>
          <ContentContainer row centered>
            <Button onClick={() => setDeletionDetails({...deletionDetails, confirmDelete: true})}>Yep</Button>
            <Button onClick={() => setDeletionDetails({...deletionDetails, card: {}})}>Nah</Button>
          </ContentContainer>
        </ContentContainer>
        }

      </PageContainer>
    )
}




const CardPreview = (props) => {
    const {card} = props;
    const [optionsVisible, setOptionsVisible] = useState(false);
    const deleteCard = props.deleteCard;
  
    return (
      <DeckCard onMouseEnter={() => setOptionsVisible(true)} onMouseLeave={() => setOptionsVisible(false)}>
        
        <Text white>{card.front}</Text>

        {optionsVisible &&
          <>
            <RowContainer fullwidth>
              <Button itty onClick={() => props.history.push('/modify_card', {cardData: card})}>View/Edit</Button>
              <Button itty action onClick={() => deleteCard(card)}>Delete</Button>
            </RowContainer>
          </>
        }
  
      </DeckCard>
    )
}

export default ViewCards;