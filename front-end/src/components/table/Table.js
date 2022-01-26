import { useEffect, useState } from "react";
import getRepoFiles from "../../api";
import './Table.css';

const Table = () => {
  const [tree, setTree] = useState([]);
  
  useEffect(() => {
    getRepoFiles()
      .then(data => {
        const readmes = data.tree.filter(file => file.path.includes('README.md'));
        makeTree(readmes);
      })
  }, []);

  const makeTree = readmes => {
    const readmeArr = readmes.map(readme => readme.path.split('/'));

    readmeArr.sort((a, b) => {
      let idx = 0;
      let compare;
      while (true) {
        if (a[idx] === 'README.md') return -1;
        else if (a[idx] === 'etc') return 1;
        else if (b[idx] === 'README.md') return 1;
        else if (b[idx] === 'etc') return -1;
        
        compare = a[idx].localeCompare(b[idx].toUpperCase(), undefined, { sensitivity: 'accent' });
        if (compare !== 0) {
          return compare;
        }
        idx++;
      };
    });
    
    setTree(readmeArr.map(arr => arr.slice(0, arr.length-1).join(' / ')));
  }

  return (
    <div className="readme-table">
      <table className="table">
        <tbody>
          {tree.map((readme, i) => {
            return (
              <tr key={i}>
                <td>{readme}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
 
export default Table;