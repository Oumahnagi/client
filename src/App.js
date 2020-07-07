/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import './App.css';
import Flexbox from 'flexbox-react';
import axios from 'axios';
import useApi from './useApi';
const {callAPI,postAPI,callOfficers,postOfficer,patchAPI} = useApi();
const App =() => {
  const [caseName, setCaseName] = useState('');
  const [officers, setOfficers] = useState([]);
  const [officerName, setOfficerName] = useState('');
  const [cases, setCases] = useState([]);

  useEffect(() => {
    callOfficers(setOfficers);
    callAPI(setCases);
  }, []);
  const refresh = () =>{
    setTimeout(() => {
      callAPI(setCases);
      callOfficers(setOfficers);
    }, 1000);
  }
  return (
    <div className="App" width="100%" height="100%">
      <Flexbox flexDirection="row" justifyContent='center' style={{
        width:'50%',
        height:'100%',
        marginTop:'50px',
        backgroundColor:'white',
        alignSelf:'center'
      }}>
        <div>
        <TextField  style={{
            marginBottom:'20px'
          }} 
          placeholder="report a stolen bike"
          onChange={(e) => { 
            setCaseName(e.target.value);
          }}
          />

          <button type="button" className="button" onClick={()=>{
            postAPI(caseName);
            refresh();
            }}>post</button>
          <div>to do:</div>
          {cases.map((map, idx) => (
            !map.officer
          && (
          <Flexbox justifyContent="space-between">
            {map.case}
            {' '}
            <div>
            <button
              
              className="button"
              onClick={() => {
                const freeOficcer = officers.find(o => o.free === true);
                console.log('found this:',freeOficcer);
        
                if(freeOficcer){
                  patchAPI(map,freeOficcer);
                }    
                refresh();
              }}
            >
              assign
            </button>
            <button
              type="button"
              className="button"
              onClick={() => {
                axios.delete(`http://localhost:9000/cases/${map._id}`)
                  .then((response) => {
                    console.log(response);
                  });
                  refresh();
              }}
            >
              delete
            </button>
            </div>
          </Flexbox>
          )
          ))}
          <div>in process:</div>
          {cases.map((map, idx) => (
            map.officer
          && (
          <Flexbox justifyContent="space-between">
            {map.case}
            {`(${map.officer})`}
            {' '}
            <div>
            <button
              type="button"
              className="button"
              onClick={() => {
                axios.delete(`http://localhost:9000/cases/${map._id}`)
                  .then((response) => {
                    console.log(response);
                  });
                  refresh();
              }}
            >
              delete
            </button>
            </div>
          </Flexbox>
          )

          ))}
        </div>

        <div>
          <TextField  style={{
            marginBottom:'20px'
          }}
          placeholder="add new officer"
          onChange={(e, v) => {
            setOfficerName(e.target.value);
          }}
          />
          <button type="button" className="button" onClick={()=>{
            postOfficer(officerName);
            refresh();
          }}>post</button>
          {officers.map((map, idx) => (
            <Flexbox justifyContent="space-between">
              {map.name}
              {' '}
              {(map.free ? 'free' : 'busy')}
              {' '}
              <div>
              <button type="button" className="button" onClick={()=>{
                axios.delete(`http://localhost:9000/officers/${map._id}`)
                .then((response) => {
                  console.log(response);
                });
              }
              }>retire</button>
              <button type="button" className="button" onClick={()=>{
                  axios.delete(`http://localhost:9000/cases/${map.case}`)
                  .then((response) => {
                    console.log(response);
                  });
                  axios.patch(`http://localhost:9000/officers/${map._id}`, {
                    name: map.name,
                      free: true,
                      case:'',
                    })
                    .then((response) => {
                      console.log(response);    
                    });
                    refresh();
                    setTimeout(() => {
                      const freeCase = cases.find(c=>c.officer=='');
                      if(freeCase)patchAPI(freeCase,map);
                    }, 1000);    
                    refresh();
                                    
              }
              }>case solved</button>
              </div>
            </Flexbox>

          ))}
        </div>
      </Flexbox>
    </div>
  );
};

export default App;
