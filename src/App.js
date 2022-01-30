import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getRepoFiles } from "./api";
import Navbar from "./components/Navbar/Navbar";
import SubjectPicker from './components/Picker/SubjectPicker';
import SubjectList from './components/Subject/SubjectList';
import ListRecord from "./components/Record/ListRecord";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    getRepoFiles()
      .then(data => {
        const readmes = data.tree.filter(file => file.path.includes('README.md'));
        saveSubjects(readmes);
      });
  }, []);

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      setIsLogin(true);
    }
  }, []);

  const saveSubjects = readmes => {
    let readmeArrs = readmes.map(readme => readme.path.split('/'));
    readmeArrs = readmeArrs.filter(arr => arr.length >= 2);

    readmeArrs.sort((a, b) => {
      let idx = 0;
      let compare;
      while (true) {
        if (a[idx] === 'README.md' || b[idx] === 'etc') return -1;
        else if (a[idx] === 'etc' || b[idx] === 'README.md') return 1;
        
        compare = a[idx].localeCompare(b[idx].toUpperCase(), undefined, { sensitivity: 'accent' });
        if (compare !== 0) {
          return compare;
        }
        idx++;
      };
    });
    
    const baseUrl = 'https://github.com/WoosubLeee/TIL/tree/master/';
    const subjects = readmeArrs.map(arr => {
      arr = arr.slice(0, arr.length-1);
      return {
        subject: arr,
        url: baseUrl + arr.join('/'),
      };
    });
    setSubjects(subjects);
  };

  return (
    <div className="App mx-auto">
      <Navbar isLogin={isLogin} setIsLogin={setIsLogin} />
      <div className="main-container mx-auto my-4">
        <SubjectPicker subjects={subjects} isLogin={isLogin} />
        <div className="d-flex">
          <div className="w-50">
            <SubjectList subjects={subjects} />
          </div>
          <div className="w-50">
            <ListRecord subjects={subjects} isLogin={isLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;