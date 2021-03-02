import React, { createContext, useReducer } from 'react'

export const actions = {
    ADD_NEW_CARD: 'add_new_card',
    EDIT_A_CARD: 'edit_a_card',
    REMOVE_A_CARD: 'remove_a_card',
    ADD_NEW_DECK: 'add_new_deck',
    EDIT_A_DECK: 'edit_a_deck',
    REMOVE_A_DECK: 'remove_a_deck',
    ADD_NEW_SESSION: 'add_new_session',
    UPDATE_WHATDO: 'update_whatdo',
    LOAD_SAVED_DATA: 'load_saved_data',
    ALERT_USER: 'alert_user',
    DISMISS_ALERT: 'dismiss_alert',
    ADD_A_TOPIC: 'add_a_topic',
    ADD_A_NOTE_SECTION: 'add_a_note_section',
    UPDATE_A_NOTE_SECTION: 'update_a_note_section',
    ADD_A_SUBTOPIC: 'add_a_subtopic'
};
  
export const Reducer = (state, action) => {
    switch (action.type) {
        case actions.ADD_NEW_CARD:
            let newCardPile = [...state.cards, action.payload];
            return {...state, cards: newCardPile};

        case actions.EDIT_A_CARD:
            // Edits a single card. However, it does NOT currently update this card in various decks. Whoops! It probably should. :P
            let decksCopy = JSON.parse(JSON.stringify(state.decks));
            for (let i = 0; i < decksCopy.length; i++) {
                let indexToChange = decksCopy[i].cards.findIndex(card => card.id === action.payload.card.id);
                if (indexToChange === -1) break;
                if (indexToChange >= 0) {
                decksCopy[i].cards[indexToChange] = action.payload.card;
                }
            }
            let modCards = JSON.parse(JSON.stringify(state.cards));
            modCards[action.payload.index] = action.payload.card;
            return {...state, cards: modCards, decks: decksCopy};

        case actions.REMOVE_A_CARD:
            // Receives the card's ID as payload
            let updatedDecks = [...state.decks];
            for (let i = 0; i < state.decks.length; i++) {
                updatedDecks[i].cards = state.decks[i].cards.filter(card => card.id !== action.payload);
            }
            console.log(updatedDecks); // Yyyyeah this is just an empty array so it erases all decks, whoops :P
            return {...state, cards: state.cards.filter(card => card.id !== action.payload), decks: updatedDecks};

        case actions.REMOVE_A_DECK:
            return {...state, decks: state.decks.filter(deck => deck.id !== action.payload)};

        case actions.EDIT_A_DECK:
            // Gimme a deck index and a new deck, like edit-a-card, and I'll get to work.
            let modDecks = JSON.parse(JSON.stringify(state.decks));
            modDecks[action.payload.index] = action.payload.deck;
            return {...state, decks: modDecks};

        case actions.ADD_NEW_DECK:
            let newDeckPile = [...state.decks, action.payload];
            return {...state, decks: newDeckPile};

        case actions.UPDATE_WHATDO:
            // We'll test it out, but we're expecting a payload object with page URL and currentAction object, if applicable
            // Specifically, page and currentAction
            return {...state, whatdo: action.payload};

        case actions.LOAD_SAVED_DATA:
            return action.payload;

        case actions.ALERT_USER:
            let alert = action.payload;
            if (!alert.duration) alert.duration = 10;
            if (!alert.type) alert.type = 'info';
            return {...state, alert: alert};
        
        case actions.DISMISS_ALERT:
            return {...state, alert: {type: 'info', message: '', startTime: undefined, duration: 0}};

        case actions.ADD_NEW_SESSION:
            let newSessionCollection = [...state.sessions, action.payload];
            return {...state, sessions: newSessionCollection};

        case actions.ADD_A_TOPIC:
            // I don't get what's going on here anymore :P
            let newTopic = {...action.payload, subtopics: [{name: 'Unsorted Notes', content: []}]};
            let newNotes = [...state.notes, action.payload];
            return {...state, notes: newNotes};
        
        case actions.ADD_A_NOTE_SECTION:
           let notesCopy = JSON.parse(JSON.stringify(state.notes));

           notesCopy[action.payload.topicIndex].subtopics[action.payload.subTopicIndex].content.push(action.payload.content);
           return {...state, notes: notesCopy};

        case actions.UPDATE_A_NOTE_SECTION:
            let newSxnNotes = JSON.parse(JSON.stringify(state.notes));
            newSxnNotes[action.payload.topicIndex].subtopics[action.payload.subTopicIndex].content[action.payload.sectionIndex] = {
                title: action.payload.title,
                text: action.payload.text,
                type: action.payload.type
            };
            return {...state, notes: newSxnNotes};

        case actions.ADD_A_SUBTOPIC:
            let newSubtopicNotes = JSON.parse(JSON.stringify(state.notes));
            const newSubtopic = {
                name: action.payload.newSubtopicName,
                content: [ { title: `Note Section #1`, text: ``, type: 'notes' } ]
            }
            newSubtopicNotes[action.payload.topicIndex].subtopics.push(newSubtopic);
            return {...state, notes: newSubtopicNotes};

        default:
            return state;
    }
}

const initialState = {
    username: 'Card-Seeker',
    whatdo: {
        page: '/',
        currentAction: {}
    },
    cards: [],
    decks: [],
    sessions: [],
    history: {},
    settings: {
        font: 'default'
    },
    syllabus: [],
    notes: [], // array of topics, with subtopics, with content
    alert: {type: 'info', message: '', startTime: undefined, duration: 0},
    backupAlerts: []
}

export const Context = createContext(initialState);

export const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}