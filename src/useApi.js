import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import './App.css';
import Flexbox from 'flexbox-react';
import axios from 'axios';
import lodash from 'lodash'

const useApi = () =>{
const callAPI = async(setCases) => {
  await axios.get('http://localhost:9000/cases')
    .then((response) => {
      console.log(response);
      setCases(response.data);
    });
};
const postAPI =async (caseName) => {
  await axios.post('http://localhost:9000/cases', {
    case: caseName,
    resolved: false,
    officer: '',
  })
    .then((response) => {
      console.log(response);
    });
};
const callOfficers = async(setOfficers) => {
  await axios.get('http://localhost:9000/officers')
    .then((response) => {
      setOfficers(response.data);
      console.log(response.data)
    });
};
const postOfficer = async(officerName) => {
  await axios.post('http://localhost:9000/officers', {
    name: officerName,
    case:'',
  })
    .then((response) => {
      console.log(response);
    });
};
const patchAPI = async(foundCase,foundOfficer) => {
  await axios.patch(`http://localhost:9000/cases/${foundCase._id}`, {
    case: foundCase.case,
    resolved: false,
    officer: foundOfficer.name,
  })
    .then((response) => {
      console.log(response);
    });
    // setTimeout(() => {
      await axios.patch(`http://localhost:9000/officers/${foundOfficer._id}`, {
       name: foundOfficer.name,
        free: false,
        case:foundCase._id,
      })
        .then((response) => {
          console.log(response);
        });
    // }, 1000);
  
}
return{
callAPI,
postAPI,
callOfficers,
postOfficer,
patchAPI
};
}
export default useApi;