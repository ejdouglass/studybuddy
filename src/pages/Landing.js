import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, Button, Title, Text } from '../components/styles';

const Landing = () => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();

    function alertTest() {
      const newAlert = {
        type: 'info',
        message: 'Test alert',
        startTime: new Date(),
        duration: 5
      };
      dispatch({type: actions.ALERT_USER, payload: newAlert});
    }
  
    useEffect(() => {
      dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/', currentAction: {}}});
    }, []);
  
    useEffect(() => {
      save(state);
    }, [state]);
  
    return (
      <PageContainer>
        <Title roomy>Welcome to your Landing Page. Working on content for this bit.</Title>
        <Text>You currently have {state.cards.length} cards in your box.</Text>
        <Text>You've made {state.decks.length} decks out of these.</Text>

        <Button wide onClick={alertTest}>(Test Alert System)</Button>
      </PageContainer>
    )
}

export default Landing;