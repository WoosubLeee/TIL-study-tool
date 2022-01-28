import { push, set } from "firebase/database";

export const getRepoFiles = () => {
  const headers = {
    Authorization: 'Token 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',
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