import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, Text, Title, BigDeck, Button, DeckCollection, ColumnContainer, RowContainer } from '../components/styles';

const ViewDecks = () => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
  
    useEffect(() => {
      dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/view_decks', currentAction: {}}});
    }, []);
  
    useEffect(() => {
      save(state);
    }, [state]);
  
    return (
      <PageContainer>
        <Title headroom>Your Decks</Title>
        <DeckCollection>
          {state.decks.map((deck, index) => (
            <DeckPreview key={index} deck={deck} dispatch={dispatch} />
          ))}
          {state.decks.length === 0 && (
            <ColumnContainer>
              <Title>You have no decks assembled yet.</Title>
              {state.cards.length !== 0 ? (
                <Button onClick={() => history.push('/modify_deck')}>Let's Make Decks!</Button>
              ) : (
                <>
                  <Text>For that matter, you have no cards, either, so let's start there!</Text>
                  <Button onClick={() => history.push('/modify_card')}>Let's Make Cards!</Button>
                </>
              )}
            </ColumnContainer>
          )
          }
        </DeckCollection>
      </PageContainer>
    )
}
  


const DeckPreview = (props) => {
    const {deck} = props;
    const history = useHistory();
    const dispatch = props.dispatch;
    const [selected, setSelected] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(false);
  
    return (
      <BigDeck onMouseEnter={() => setSelected(true)} onMouseLeave={() => setSelected(false)}>
        <Title white roomy>{deck.name}</Title>
        <Title white>
          Cards: {deck.cards.length}
        </Title>

        {(selected && !deleteCandidate) ? (
          <RowContainer>
            <Button onClick={() => history.push('/modify_deck', {deckData: deck})}>View/Edit</Button>
            <Button onClick={() => setDeleteCandidate(true)}>Delete</Button>
          </RowContainer>
          ) : (
            <RowContainer style={{height: '3.1rem'}}></RowContainer>
          )
        }

        {deleteCandidate &&
          <>
            <Text>Are you sure you want to delete this deck?</Text>
            <Button action onClick={() => dispatch({type: actions.REMOVE_A_DECK, payload: deck.id})}>DELETE</Button>
            <Button onClick={() => setDeleteCandidate(false)}>No, Leave It</Button>
          </>  
        }
      </BigDeck>
    )
}

export default ViewDecks;