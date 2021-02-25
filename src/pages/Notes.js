import React, { useContext, useState, useEffect, useRef } from 'react';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, RowContainer, Card, ColumnContainer, Form, Text, Title, Button, Input, TopicsContainer, Notepad, Word, NotepadToolbar, NoteToolButton } from '../components/styles';

const Notes = () => {
    const [state, dispatch] = useContext(Context);
    const [selectedTopicIndex, setSelectedTopicIndex] = useState(undefined); 
    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicDesc, setNewTopicDesc] = useState('');
    const initialLoad = useRef(true);

    function createNewTopic(e) {
        e.preventDefault();
        if (newTopicName.length > 0) {
            // make new topic
            const newTopic = {
                name: newTopicName,
                description: newTopicDesc
            };
            dispatch({type: actions.ADD_A_TOPIC, payload: newTopic});
            setNewTopicName('');
            setNewTopicDesc('');
            dispatch({type: actions.ALERT_USER, payload: {type: 'success', message: `New topic created!`, duration: 5}});
        } else {
            dispatch({type: actions.ALERT_USER, payload: {type: 'error', message: `Please give the new topic a name!`, duration: 10}});
        }
    }

    useEffect(() => {
        if (!initialLoad.current) {
            save(state);
            return;
        }
        initialLoad.current = false;
    }, [state]);

    useEffect(() => {
        dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/notes', currentAction: {}}});
    }, [dispatch]);

    useEffect(() => {
        if (selectedTopicIndex !== undefined) {
            // A topic has been selected; act on that here, if applicable
        }
    }, [selectedTopicIndex]);

    return (
        <PageContainer>
            {selectedTopicIndex === undefined ? (
                <>
                {state.notes.length > 0 ? (
                    <>
                        <RowContainer full centered>
                            <Form centered row onSubmit={createNewTopic}>
                                <Input type='text' autoFocus={state.notes.length === 0 ? true : false} placeholder={`(new topic name)`} value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)}></Input>
                                <Input doublewide tight type='text' placeholder={`(new topic description)`} value={newTopicDesc} onChange={(e) => setNewTopicDesc(e.target.value)}></Input>
                                <Button>Create New Topic!</Button>
                            </Form>
                        </RowContainer>
                        <Title>Select a Topic to Study or Take Notes On</Title>
                        <TopicsContainer>
                            {state.notes.map((topic, index) => (
                                // Ok! Works fine. Let's refactor into a proper Card/component.
                                <TopicCard key={index} index={index} topic={topic} setSelectedTopicIndex={setSelectedTopicIndex}>{topic.name}</TopicCard>
                            ))}
                        </TopicsContainer>
                    </>
                ) : (
                    <>
                        <Title>You haven't written any Notes yet!</Title>
                        <Text>Get started by naming a new Topic to take notes in:</Text>
                        <ColumnContainer half centered>
                            <Form onSubmit={createNewTopic}>
                                <Input type='text' autoFocus={state.notes.length === 0 ? true : false} placeholder={`(new topic name)`} value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)}></Input>
                                <Input doublewide tight type='text' placeholder={`(new topic description)`} value={newTopicDesc} onChange={(e) => setNewTopicDesc(e.target.value)}></Input>
                                <Button rightside>Create New Topic!</Button>
                            </Form>
                        </ColumnContainer>
                    </>
                )}
                </> 
            ) : (
                <ColumnContainer fullwidth>
                    <RowContainer fullwidth>
                        <Button bold leftside onClick={() => setSelectedTopicIndex(undefined)}>Go Back</Button>
                    </RowContainer>
                    <Title>{state?.notes[selectedTopicIndex].name}</Title>
                    <Notepad>
                        <NotepadToolbar>
                            <NoteToolButton>HI</NoteToolButton>
                            <NoteToolButton>YO</NoteToolButton>
                        </NotepadToolbar>
                        {/* Words go here :P */}
                    </Notepad>
                </ColumnContainer>
            )}
        </PageContainer>
    )
}


const TopicCard = (props) => {
    const {topic} = props;
    const setSelectedTopicIndex = props.setSelectedTopicIndex;
    return (
        <Card onClick={() => setSelectedTopicIndex(props.index)}>
            <Title>{topic.name}</Title>
            <Text>{topic.description || `(no description)`}</Text>
        </Card>
    )
}

export default Notes;

/*

    Topics, Notes, & Resources

    TOPICS - The broadly sweeping topics that you're studying (say, JS General, React, Backend, what have you)
    -- Sub-Topics - Topics within topics! (React would be a decent sub-topic for JS General, or maybe String methods, etc.)
    -- For each topic, a button to "collapse all" or "uncollapse all" would be helpful
    -- Searchability also would be great ... but what parts to search?

    NOTES - The stuff you write about the subjects and study.
    -- It'd be neat if you could do HIGHLIGHTING and such (requires some granularity in how the text is stored/displayed)
    -- Built-in capacity to do bullet points, sections, sub-sections, etc.
    -- QUICK NOTES capacity would be cool; a self-contained 'Note' that you can sort later, which would live in a 'Loose Notes' section

    RESOURCES - A quick list of boop-able links to stuff to use to brush up on something
    -- Probably "live" in the Topics level

    
    Ok, good basic brainstorm. How does the page look....

    -- list of topics (searchable/filterable) going down the page in wide columns? Or perhaps bigger cards?
    -- conditional rendering based on currently selected topic
    -- top-level 'Create New Topic' button

    DATA:
    -- 'Notes' is an array at the global state level, format: [ { topic1 }, { topic2 }, ... ]
    -- Each index represents a 'topic' object:
    topic: {
        name: 'TOPIC_NAME',
        subtopics: [ {} ],
        resources: [ {} ],
        notes: [ { type: 'paragraph || header || bullets', content: [ 'word1', 'word2', '...' ] } ]
    }

*/