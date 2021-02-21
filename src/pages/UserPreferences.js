import React, { useContext, useState, useEffect } from 'react';
import { Context, actions } from '../context/context';
import { save } from '../functions/globalfxns';
import { PageContainer, Title, Button, Input } from '../components/styles';

const UserPreferences = () => {
    const [state, dispatch] = useContext(Context);
    const [loaderFile, setLoaderFile] = useState();
    const [appDataString, setAppDataString] = useState('');
  
    function copyData() {
      document.querySelector('#text-app-data').select();
      document.execCommand('copy');
    }
  
    function saveDataToFile() {
      const a = document.createElement('a');
      const file = new Blob([JSON.stringify(state)], {type: 'application/json'});
  
      a.href = URL.createObjectURL(file);
      a.download = 'study_buddy_data.txt';
      a.click();
  
      URL.revokeObjectURL(a.href);
    }
  
    useEffect(() => {
      dispatch({type: actions.UPDATE_WHATDO, payload: {page: '/user_preferences', currentAction: {}}});
    }, []);
  
    useEffect(() => {
      save(state);
    }, [state]);
  
    useEffect(() => {
      if (loaderFile) {
        let reader = new FileReader();
        reader.onload = (e) => {
          setAppDataString(reader.result);
        }
        reader.readAsText(loaderFile[0]); // I guess since I stored it as an array-y Blob above? Gotta read more into how blob-saving/loading works.
      }
    }, [loaderFile]);
  
    useEffect(() => {
      if (appDataString) {
        // Loads up the app data from the previously-saved .txt file. Huh. May have to do this for Ideas, too.
        dispatch({type: actions.LOAD_SAVED_DATA, payload: JSON.parse(appDataString)});
      }
    }, [appDataString]);
  
    return (
      <PageContainer>
        <Title>User Preferences</Title>
        
        <Button className='btn small-btn'>CLEAR APP DATA</Button>

        <Input type='file' id='file-selector' accept='.txt' onChange={e => setLoaderFile(e.target.files)} ></Input>
        
        <textarea id='text-app-data' value={JSON.stringify(state)} style={{resize: 'none', width: '40vw', height: '300px', border: '1px solid black'}} readOnly={true}></textarea>
  
      
        <Button roomy className='btn small-btn' onClick={copyData}>Copy App Data to Clipboard</Button>

        <Button className='btn small-btn' onClick={saveDataToFile}>Save App Data as .txt File</Button>

      </PageContainer>
    )
}

export default UserPreferences;