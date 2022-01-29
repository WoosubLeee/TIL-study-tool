import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, push, set, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "til-study-tool.firebaseapp.com",
  projectId: "til-study-tool",
  storageBucket: "til-study-tool.appspot.com",
  messagingSenderId: "1006968567706",
  appId: "1:1006968567706:web:c79c3616cdbe0fc29aec23",
  measurementId: "G-ZK7MJGRSJ1"
};
initializeApp(firebaseConfig);
const db = getDatabase();

export const requestLogin = password => {
  const auth = getAuth();
  const email = 'zbxv1423@gmail.com';
  return signInWithEmailAndPassword(auth, email, password);
};

export const requestLogout = () => {
  const auth = getAuth();
  return signOut(auth);
};

export const getRepoFiles = () => {
  const headers = {
    Authorization: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
  };

  return fetch('https://api.github.com/repos/WoosubLeee/TIL/git/trees/master?recursive=1', {
    headers: headers,
  })
    .then(res => res.json());
};

export const recordStudy = (ref, data) => {
  data.timestamp = new Date().getTime();
  set(push(ref), data);
};

export const deleteRecord = key => {
  const recordRef = ref(db, `record/${key}`);
  return remove(recordRef);
};