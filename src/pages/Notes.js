import React, { useContext, useState, useEffect } from 'react';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, RowContainer, ColumnContainer, Form, Text, Title, Button, Input } from '../components/styles';

const Notes = () => {
    const [state, dispatch] = useContext(Context);
    const [selectedTopic, setSelectedTopic] = useState(undefined);
    const [newTopicName, setNewTopicName] = useState('');

    function createNewTopic(e) {
        e.preventDefault();
        if (newTopicName.length > 0) {
            // make new topic
            const newTopic = {
                name: newTopicName
            };
            dispatch({type: actions.ADD_A_TOPIC, payload: newTopic});
            setNewTopicName('');
            dispatch({type: actions.ALERT_USER, payload: {type: 'success', message: `New topic created!`, duration: 5}});
        } else {
            dispatch({type: actions.ALERT_USER, payload: {type: 'error', message: `Please give the new topic a name!`, duration: 10}});
        }
    }

    return (
        <PageContainer>
            {state.notes.length > 0 ? (
                <>
                    <Title>Select a Topic to Study or Take Notes On</Title>
                    {state.notes.map((topic, index) => (
                        // Ok! Works fine. Let's refactor into a proper Card/component.
                        <TopicCard key={index} topic={topic}>{topic.name}</TopicCard>
                    ))}
                </>
            ) : (
                <>
                    <Title>You haven't written any Notes yet!</Title>
                    <Text>Get started by naming a new Topic to take notes in:</Text>
                    <RowContainer half centered style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Form onSubmit={createNewTopic}>
                            <Input type='text' autoFocus={state.notes.length === 0 ? true : false}  placeholder={`(new topic name)`} value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)}></Input>
                            <Button>Create New Topic!</Button>
                        </Form>
                    </RowContainer>
                </>
            )}
            
        </PageContainer>
    )
}


const TopicCard = (props) => {
    const {topic} = props;
    return (
        <ColumnContainer>
            <Title>{topic.name}</Title>
        </ColumnContainer>
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

    RESOURCES - A quick list of boop-able links to stuff to use to brush up on something
    -- Probably "live" in the Topics level

    
    Ok, good basic brainstorm. How does the page look....'

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