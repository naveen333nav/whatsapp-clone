// Import the functions you need from the SDKs you need

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyAJf271Ud87jjAfH7fa0oCgrvu6hxlvBg4',

  authDomain: 'whatsapp-clone-cc31e.firebaseapp.com',

  projectId: 'whatsapp-clone-cc31e',

  storageBucket: 'whatsapp-clone-cc31e.appspot.com',

  messagingSenderId: '685653633614',

  appId: '1:685653633614:web:8a7c8e2de2be639014b11f',
}

const app = firebase.initializeApp(firebaseConfig)

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()
const storage = firebase.storage().ref('images')
const audioStorage = firebase.storage().ref('audios')

const createTimestamp = firebase.firestore.FieldValue.serverTimestamp
const serverTimestamp = firebase.database.ServerValue.TIMESTAMP

export {
  db,
  auth,
  provider,
  storage,
  audioStorage,
  createTimestamp,
  serverTimestamp,
}
