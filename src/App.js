import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import logo from './logo.svg';
import './App.css';
import { getOrCreateMeeting, getDemoResponse } from './graphql/queries'

const initialState = { desiredMeetingId: '', actualMeetingId: '' }

function App() {
  const [formState, setFormState] = useState(initialState)
  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function multiplyTheNumber() {
    try {
      let result = await API.graphql(graphqlOperation(getDemoResponse, {input: "210"}));
      console.log(JSON.stringify(result));
    }catch(err) {
      console.log(JSON.stringify(err));
    }
  }

  async function joinMeeting() {
    try {
      let meetingAndAttendeeInfo = await API.graphql(graphqlOperation(getOrCreateMeeting, {meetingId: formState.desiredMeetingId}));
      console.log(JSON.stringify(meetingAndAttendeeInfo));
    } catch(err) {
      console.error(JSON.stringify(err));
    }
  }

  return (
    <div style={styles.container}>
      <h2>Join a meeting</h2>
      <input
        onChange={event => setInput('desiredMeetingId', event.target.value)}
        style={styles.input}
        value={formState.desiredMeetingId} 
        placeholder="Meeting ID"
      />
      <button style={styles.button} onClick={joinMeeting}>Join meeting</button>
      <button style={styles.button} onClick={multiplyTheNumber}>Multiply the number</button>
    </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App;
