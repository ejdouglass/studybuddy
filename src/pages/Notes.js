import React, { useContext, useState, useEffect, useRef } from 'react';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { NoteSection, NotepadNotes, PageContainer, RowContainer, Card, ColumnContainer, Form, Text, Title, Button, Input, TopicsContainer, Notepad, Word, NotepadToolbar, NoteToolButton, ContentContainer } from '../components/styles';

const Notes = () => {
    const [state, dispatch] = useContext(Context);
    const [selectedTopicIndex, setSelectedTopicIndex] = useState(undefined);
    const [selectedSubtopicIndex, setSelectedSubtopicIndex] = useState(undefined);
    const [selectedContentIndex, setSelectedContentIndex] = useState(undefined);
    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicDesc, setNewTopicDesc] = useState('');
    /*
    topic.subtopics format:
    subtopics: [ { name: 'SUBTOPIC_NAME', content: [ {} ] } ],
    -- thinking just textareas all the way down, with little basic outline borders (maybe only top and bottom partials)
    -- collapsibility would be good, so 'wrap' the content in a component below for display purposes (pass in object, which will include type)
    -- each content object is a 'section' of notes, in its array: { title: '', text: '', type: '' } ... should cover it
        -> typess: notes, ___

    So we can just have CONTENTARRAY.map((note, index) => (
        <Note key={index} type={note.type} />
    ))
    ... so the object for each note can include a 'type' that is a prop that is used to dictate its styling from styled? Should work fine!
    ... even if the Note component is written below, it can just have note={note} and have the type extracted and used in a styled component there
    ... the link below lets us know what parts of the textarea are selected, but can we 'highlight' or reformat with that?? HRM.

    [?] Is there a way to know programmatically where in the textarea a cursor is? 
        -- This would REALLY help with keyboard stuff, like arrows up and down taking you through textareas and then into surrounding content properly
        -- Aha: https://ourcodeworld.com/articles/read/282/how-to-get-the-current-cursor-position-and-selection-within-a-text-input-or-textarea-in-javascript

    [?] Is there a way to force the screen to scroll to a certain part of the page? Actually, there definitely is. Figure out how!

    [!] Handling keydowns
        -- Eh, mostly just button shortcuts for now, I think. Each textarea/Note can support multiple lines reasonably enough.
        -- Should each Note have its own title/header? Maybe.
        -- Then we're looking at an INPUT with TITLE-like attributes in each Note, as well as the textarea.

    */
    const initialLoad = useRef(true);

    function createNewTopic(e) {
        e.preventDefault();
        if (newTopicName.length > 0) {
            // make new topic
            const newTopic = {
                name: newTopicName,
                description: newTopicDesc,
                subtopics: [
                    {
                        name: 'Subtopic #1',
                        content: [
                            {
                                title: 'Nameless Section',
                                text: '',
                                type: 'notes'
                            }
                        ]
                    }
                ]
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
                    <Title>{state?.notes[selectedTopicIndex].name.toUpperCase()}</Title>
                    <Notepad>
                        <NotepadToolbar>
                            <NoteToolButton>HI</NoteToolButton>
                            <NoteToolButton>YO</NoteToolButton>
                        </NotepadToolbar>
                        <NotepadNotes>
                        {state?.notes[selectedTopicIndex]?.subtopics?.map((subtopic, index) => (
                            <ContentContainer key={index} column fullwidth>
                                {/* Later on, let's change this TITLE into a boopable entity to collapse and such */}
                                <Title leftside>{subtopic.name}</Title>
                                {subtopic.content.map((content, index) => (
                                    <SectionOfNotes key={index} content={content} />
                                ))}
                            </ContentContainer>
                        ))}
                        <Button>MOAR SXNS</Button>
                        </NotepadNotes>
                        
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



const SectionOfNotes = (props) => {
    const [section, setSection] = useState({
        title: props.content.title || `Unnamed Section`,
        text: props.content.text || '',
        type: props.content.type || 'notes'
    });
    const [containerHeight, setContainerHeight] = useState('auto');
    const [sectionHeight, setSectionHeight] = useState('auto');
    const textRef = useRef(null);

    const containerStyle = {
        minHeight: containerHeight
    }

    const sectionStyle = {
        height: sectionHeight
    }

    function handleChange(e) {
        setSectionHeight('auto');
        setContainerHeight(`${textRef.current.scrollHeight}px`);
        setSection({...section, text: e.target.value});
    }

    useEffect(() => {
        setContainerHeight(`${textRef.current.scrollHeight}px`);
        setSectionHeight(`${textRef.current.scrollHeight}px`);
    }, [section.text]);

    // I *may* be able to... hm... have onClick handlers for this module-ized content so each one can be edited?
    // Then it can pass up whatever it needs to for the 'main' component to update said content.
    // So then this needs to know the Toolbar buttons and what they're up to... what else?
    
    return (
        // Probably at some point add the 'section differentiators' to this, changing ContentContainer up a bit most likely
        // Can also tweak it to ensure we avoid scrolling issues and such
        <ContentContainer column fullwidth style={containerStyle}>
            <Text leftside>{section.title}</Text>
            <NoteSection ref={textRef} style={sectionStyle} value={section.text} onChange={e => handleChange(e)} autoFocus={true} rows={1} placeholder={`(type some notes here)`}></NoteSection>
        </ContentContainer>
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
        description: '',
        subtopics: [ { name: 'SUBTOPIC_NAME', content: [ {} ] } ],
        resources: [ {} ],
        notes: [ { type: 'paragraph || header || bullets', content: [ 'word1', 'word2', '...' ] } ]
    }


    For a little later:
    -- rename topics
    -- reorganize bits into other parts (if I make a new topic and want to scoot stuff around)



    TOOLBAR BITS:
    -- Add Subtopic (mega-heading; searchable; everything under it is collapsible)
    -- Add Header (basic visual heading differentiator; defaults to turning back off when you hit enter)
    -- Add Bullet(s) (defaults to on for newline; turns back 'on' if you backspace into previous, bulleted line; turns off if backspace at newline that is tentatively bulleted)
    -- Highlighting? (Gotta figure out how I want to implement this)



    Should I HIJACK the keyDown stuff here? Hmmm. Like a totally independent behavior that mimics but isn't the default behavior for all keys?
    ... risky, because it'll lock out a lot of the user's expected keyboard shortcut behavior, which I don't like.
    ... think about ways to parse incoming data in a non-blocking way... observe the user's input, and respond behind-the-scenes more cleverly.


    LATEST 2/26/21 - 
    -- Gotta be able to take notes. Refer to above for structuring, then build out CAN TAKE NOTES.
    -- Think through how you want to use it, backsolve.
    
    -- USING IT! I click on Notes. On Note page. Click the Topic. Default is "loose notes" for that topic? "Unsorted" is always the first Subtopic.

    2/27/21 - 
    Let's not get lost in the weeds. Simplify for now:
    -- Each section is just "notes" by default, a textarea (of whatever size it needs to be), and when user hits "enter" it pops to the next section
        -> Conditional behavior: selects next textarea in array to FOCUS, or if none, creates a new one and focuses that instead
    -- User can enter different "modes" with the toolbar buttons (or shortcuts, if/when applicable)
        -> 'Aside' mode: code snippets, quotes, definitions, etc. in self-styled and border-bounded boxes (probably separate font style)

*/