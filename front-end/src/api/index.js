const getRepoFiles = () => {
  const headers = {
    Authorization: 'Token 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',
  };

  return fetch('https://api.github.com/repos/WoosubLeee/TIL/git/trees/master?recursive=1', {
    headers: headers,
  })
    .then(res => res.json());
};

export default getRepoFiles;