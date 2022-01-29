import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { push, set } from "firebase/database";

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