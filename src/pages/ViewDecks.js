import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, Title, ContentContainer, Button } from '../components/styles';

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
        <Title>Your Decks</Title>
        <ContentContainer className='decks-list-holder'>
          {state.decks.map((deck, index) => (
            <DeckPreview key={index} deck={deck} dispatch={dispatch} />
          ))}
        </ContentContainer>
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
      <div className='deck-preview flex flex-row' onMouseEnter={() => setSelected(true)} onMouseLeave={() => setSelected(false)}>
        <div style={{fontSize: '24px', fontWeight: '600', flex: '1', border: '1px solid blue'}}>
          {deck.name}
        </div>
        <div style={{fontSize: '24px', fontWeight: '600', flex: '1'}}>
          Cards: {deck.cards.length}
        </div>
        <div style={{visibility: selected ? 'visible' : 'hidden', flex: '1'}}>
          <Button>Peep</Button>
          <Button onClick={() => history.push('/modify_deck', {deckData: deck})}>Edit</Button>
          <Button onClick={() => setDeleteCandidate(true)}>Delete</Button>
        </div>
        {deleteCandidate &&
        <div style={{flex: '1'}}>
          <div> Are you sure you want to delete this deck? </div>
          <Button onClick={() => dispatch({type: actions.REMOVE_A_DECK, payload: deck.id})}>Yep</Button>
          <Button onClick={() => setDeleteCandidate(false)}>Nah</Button>
        </div>  
        }
      </div>
    )
}

export default ViewDecks;