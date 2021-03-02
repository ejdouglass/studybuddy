import React, { useContext, useState, useEffect, useRef } from 'react';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { NoteSection, NoteSectionTitle, NotepadNotes, CollapseButton, PageContainer, RowContainer, Card, ColumnContainer, Form, Text, Title, Button, Input, TopicsContainer, Notepad, Word, NotepadToolbar, NoteToolButton, ContentContainer } from '../components/styles';

const Notes = () => {
    const [state, dispatch] = useContext(Context);
    const [selectedTopicIndex, setSelectedTopicIndex] = useState(undefined);
    const [selectedSubtopicIndex, setSelectedSubtopicIndex] = useState(undefined);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(undefined);
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
        -- Mostly for NEW SECTIONS. It's silly to -have- to switch to mouse to do stuff like that.

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
                                title: 'Note Section #1',
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

    function addNewSection() {
        // HERE: Add new section :P
        // Basically just push a new entry onto the notes.topic.subtopic array with default values and set its index to the current one.
        // BONUS: Zoomies to that entry

        // I just now realized that I'm directly referencing global state the entire time to render everything. Interesting choice. :P
        // Not completely wackadoo, since every change would be saved directly into global state immediately anyway...
        // For a more nuanced program, we'd probably stick with local state, with changes more periodically/intentionally pushed.
        // For now we'll just do DISPATCH HIJINKS...

        // topic is array, subtopic is array, each subtopic has content that is 'title, text, type'
        
        const payload = {
            topicIndex: selectedTopicIndex,
            subTopicIndex: selectedSubtopicIndex,
            content: {
                title: `Note Section #${state.notes[selectedTopicIndex].subtopics[selectedSubtopicIndex].content.length + 1}`,
                text: ``,
                type: 'notes'
            }
        }; // We need to know the current TOPIC INDEX and SUBTOPIC INDEX... might as well define defaults as well
        dispatch({type: actions.ADD_A_NOTE_SECTION, payload: payload});
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
            setSelectedSubtopicIndex(0);
        }
    }, [selectedTopicIndex]);

    useEffect(() => {
        // HERE: Save global state when user does something
        // ... awkwardly, there's no central repository of 'note' content, so I'll have to make an 'extra' state above to check against?
    }, []);

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
                                    <SectionOfNotes key={index} content={content} state={state} topicIndex={selectedTopicIndex} subTopicIndex={selectedSubtopicIndex} index={index} setSelectedSectionIndex={setSelectedSectionIndex} selected={selectedSectionIndex === index ? true : false} />
                                ))}
                            </ContentContainer>
                        ))}
                        <Button leftside onClick={addNewSection}>Add Note Section</Button>
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
    const [state, dispatch] = useContext(Context);
    const [section, setSection] = useState({
        title: props.content.title || `Unnamed Section`,
        text: props.content.text || '',
        type: props.content.type || 'notes'
    });
    const [containerHeight, setContainerHeight] = useState('auto');
    const [sectionHeight, setSectionHeight] = useState('auto');
    const [collapsed, setCollapsed] = useState(false);
    const textRef = useRef(null);
    const firstLoad = useRef(true);

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

    useEffect(() => {
        if (firstLoad.current) firstLoad.current = false
        else {
            const updatedSectionData = {
                ...section,
                topicIndex: props.topicIndex,
                subTopicIndex: props.subTopicIndex,
                sectionIndex: props.index
            };
            dispatch({type: actions.UPDATE_A_NOTE_SECTION, payload: updatedSectionData});
        }
    }, [section]);


    // Copied the textarea-resizing from Googling results; figure out WHY it works and play with it

    // Consider changing NoteSection to have a slightly different BG color?
    
    return (
        // Probably at some point add the 'section differentiators' to this, changing ContentContainer up a bit most likely
        // Can also tweak it to ensure we avoid scrolling issues and such

        <ContentContainer column fullwidth style={containerStyle, {backgroundColor: props.selected ? 'hsla(230, 35%, 80%, 0.7)' : 'white'}} onClick={() => props.setSelectedSectionIndex(props.index)}>
            <RowContainer fullwidth style={{alignItems: 'center', padding: '0'}}>
                <CollapseButton onClick={() => setCollapsed(collapsed => !collapsed)}>{collapsed ? '+' : '-'}</CollapseButton>
                <NoteSectionTitle style={{border: '1px solid hsl(230, 10%, 90%, 0.6)', borderRadius: '6px'}} type='text' value={section.title} onChange={e => setSection({...section, title: e.target.value})} placeholder={`(enter section title here)`}></NoteSectionTitle>
            </RowContainer>
            <NoteSection ref={textRef} selected={props.selected} style={{...sectionStyle, display: collapsed ? 'none' : 'block'}} value={section.text} onChange={e => handleChange(e)} autoFocus={true} rows={1} placeholder={`(type some notes here)`} onFocus={() => props.setSelectedSectionIndex(props.index)}></NoteSection>
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