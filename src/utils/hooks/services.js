import database from '@react-native-firebase/database';

import React, {useState} from 'react';

export function generateImageName(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function setData() {
  const [result, setResult] = useState(false);

  const addUser = (path, data) => {
    console.log('---------', data);
    database()
      .ref(path)
      .set(data)
      .then(() => setResult(true));
  };

  return {result, addUser};
}

export function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km (change this constant to get miles)
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  // if (d > 1) return Math.round(d) + "km";
  // else if (d <= 1) return Math.round(d * 1000) + "m";
  return Math.abs(d);
}

export function usePublications() {
  const [state, setState] = useState(false);
  const addPublications = (path, data) => {
    database()
      .ref(path)
      .set(data)
      .then(() => setState(true));
  };
  return {
    state,
    addPublications,
  };
}

export function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var hour = String(today.getHours())
  var min = String(today.getMinutes())
  var sec = String(today.getSeconds())
  return{yyyy, mm, dd, hour, min, sec}
}

export function sortByLocation(temp, userData){
  for (let i = 0; i < temp.length; i++) {
    for (let j = 0; j <= i; j++) {
      if (
        distance(
          temp[i].location.lat,
          temp[i].location.long,
          userData.location.lat,
          userData.location.long,
        ) <
        distance(
          temp[j].location.lat,
          temp[j].location.long,
          userData.location.lat,
          userData.location.long,
        )
      ) {
        let tempItem = temp[i];
        temp[i] = temp[j];
        temp[j] = tempItem;
      }
    }
  }
  return temp
}
