import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, Text, Title, BigDeck, Button, DeckCollection, RowContainer } from '../components/styles';

const ViewDecks = () => {
    const [state, dispatch] = useContext(Context);
  
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