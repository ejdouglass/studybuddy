import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { Title, PageContainer, ButtonPrompt, DeckSelectorMenu, Button, Text, Segment, SessionVariablesContainer, ContentContainer, InputContainer, Input, ValueModifierButton, DecksList, Deck } from '../components/styles';

const SessionSetup = () => {
    const [state, dispatch] = useContext(Context);
    const [sessionPrep, setSessionPrep] = useState({
      decksToChoose: state.decks,
      decksToUse: [],
      sessionEndCondition: 'user',
      sessionEndTime: 5,
      sessionEndIterations: 3
    });
    const [deckSearch, setDeckSearch] = useState('');
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
      let sessionEndNumber = 1;
      if (sessionPrep.sessionEndCondition === 'time') sessionEndNumber = sessionPrep.sessionEndTime;
      if (sessionPrep.sessionEndCondition === 'iterations') sessionEndNumber = sessionPrep.sessionEndIterations;
      const sessionData = {
        decks: [...sessionPrep.decksToUse],
        endWhen: sessionPrep.sessionEndCondition,
        endAt: sessionEndNumber
      }
      if (sessionData.decks.length < 1) {
        const pleasePickOneMsg = {
          type: 'error',
          message: `You've got to pick at least one deck to work with there, cap'n.`,
          duration: 10
        }
        dispatch({type: actions.ALERT_USER, payload: pleasePickOneMsg});
        return;
      }
      else history.push('/session_study', {sessionData: sessionData})
    }

    function launchSavedSession(session) {
      // Playing fast and loose with this; might have to amend the session object details before passing it
      history.push('/session_study', {sessionData: session});
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

    useEffect(() => {
      if (deckSearch === '') {
        setSessionPrep({...sessionPrep, decksToChoose: state.decks});
      } else {
        let newDecks = state.decks.filter(deck => deck.name.toLowerCase().includes(deckSearch.toLowerCase()));
        setSessionPrep({...sessionPrep, decksToChoose: newDecks});
      }
    }, [deckSearch]);
  
    return (
      <PageContainer>
        <Title big headroom footroom>Session Setup</Title>
        
        {/* HERE: Menu for session deets  */}

        <ContentContainer wide centered>
          <ButtonPrompt>Session ends when:</ButtonPrompt>
          <ContentContainer wide row>
            <Segment half>
              <Button left selected={sessionPrep.sessionEndCondition === 'time'} onClick={() => setSessionPrep({...sessionPrep, sessionEndCondition: 'time'})}>I reach a time limit</Button>
              <Button segment selected={sessionPrep.sessionEndCondition === 'user'} onClick={() => setSessionPrep({...sessionPrep, sessionEndCondition: 'user'})}>I manually end the session</Button>
              <Button right selected={sessionPrep.sessionEndCondition === 'iterations'} onClick={() => setSessionPrep({...sessionPrep, sessionEndCondition: 'iterations'})}>I go through all cards X times</Button>
            </Segment>
  
            <SessionVariablesContainer>
              {sessionPrep.sessionEndCondition === 'time' &&
              <InputContainer wide row>
                <ButtonPrompt>Time Limit:</ButtonPrompt>
                <ValueModifierButton onClick={() => setSessionPrep({...sessionPrep, sessionEndTime: sessionPrep.sessionEndTime > 5 ? sessionPrep.sessionEndTime - 5 : 5})}>-</ValueModifierButton>
                <Input centered type='text' readOnly={true} value={sessionPrep.sessionEndTime + ' minutes'} min={5} max={100}></Input>
                <ValueModifierButton onClick={() => setSessionPrep({...sessionPrep, sessionEndTime: sessionPrep.sessionEndTime + 5})}>+</ValueModifierButton>
              </InputContainer>
              }
              {sessionPrep.sessionEndCondition === 'iterations' &&
              <InputContainer wide row>
                <ButtonPrompt>Iterations:</ButtonPrompt>
                <ValueModifierButton onClick={() => setSessionPrep({...sessionPrep, sessionEndIterations: sessionPrep.sessionEndIterations > 1 ? sessionPrep.sessionEndIterations - 1 : 1})}>-</ValueModifierButton>
                <Input centered type='text' readOnly={true} value={sessionPrep.sessionEndIterations + ' times through'} min={1} max={100}></Input>
                <ValueModifierButton onClick={() => setSessionPrep({...sessionPrep, sessionEndIterations: sessionPrep.sessionEndIterations + 1})}>+</ValueModifierButton>
              </InputContainer>
              }
              {sessionPrep.sessionEndCondition === 'user' &&
              <InputContainer>
                <ButtonPrompt>Just tap the button when you're done!</ButtonPrompt>
              </InputContainer>
              }
            </SessionVariablesContainer>
            
          </ContentContainer>

          
  
        </ContentContainer>
  
        {/* HERE: Add deck search */}
        <ContentContainer full centered headroom>
          <Text>Deck Search: </Text>
          <Input elbowroom type='text' value={deckSearch} onChange={e => setDeckSearch(e.target.value)}></Input>
        </ContentContainer>
        <ContentContainer centered full tall>
          <DecksList>
            {sessionPrep.decksToChoose.map((deck, index) => (<Deck key={index} onClick={() => addDeckToSession(deck)}>{deck.name}</Deck>))}
          </DecksList>

          <DeckSelectorMenu>
            {/* Mostly arrow over boopy show */}
            (boopy arrow go here)
          </DeckSelectorMenu>
  
          <DecksList>
            {sessionPrep.decksToUse.map((deck, index) => (<Deck key={index} onClick={() => removeDeckFromSession(deck)}>{deck.name}</Deck>))}
          </DecksList>

          <Button huge bold grayed={sessionPrep.decksToUse.length > 0 ? false : true} onClick={goStudy}>{sessionPrep.decksToUse.length > 0 ? 'READY TO STUDY!' : 'CHOOSE 1+ DECK(S)'}</Button>
        </ContentContainer>
  
        
        <ContentContainer short centered full row style={{border: '1px solid gray'}}>
          {state.sessions?.map((session, index) => (
            <Button tall elbowroom onClick={() => launchSavedSession(session)}>{session.name}</Button>
          ))}
          {!state.sessions.length && <Text>Alas, you have no currently saved sessions.</Text>}
        </ContentContainer>
        
  
      </PageContainer>
    )
}

export default SessionSetup;