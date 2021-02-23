import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, Title, ColumnContainer, Button, Text, Input } from '../components/styles';

const Syllabus = () => {
    const [state, dispatch] = useContext(Context);
    const [newSyllabusItem, setNewSyllabusItem] = useState('');

    function addNewSyllabusItem() {
        
    }

    return (
        <PageContainer>
            <Title>SYLLABUS</Title>
            <ColumnContainer fullheight>
                {state.syllabus.length > 0 && 
                    <></>
                }
                {state.syllabus.length === 0 &&
                    <Text>You have no items to study yet! Add some here.</Text>
                }
                <Input type='text' value={newSyllabusItem} onChange={e => setNewSyllabusItem(e.target.value)}></Input>
                <Button onClick={addNewSyllabusItem}>Add Study Item</Button>
            </ColumnContainer>
        </PageContainer>
    )
}

export default Syllabus;