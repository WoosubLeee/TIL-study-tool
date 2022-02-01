import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getRepoFiles, getRecordRef } from "./api";
import Navbar from "./components/Navbar/Navbar";
import SubjectPicker from './components/Picker/SubjectPicker';
import SubjectList from './components/Subject/SubjectList';
import ListRecord from "./components/Record/ListRecord";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);
  const [records, setRecords] = useState(undefined);
  const [recordCounts, setRecordCounts] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    getRepoFiles()
      .then(repoData => {
        const readmes = repoData.tree.filter(file => file.path.includes('README.md'));
        saveSubjects(readmes);
      })
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      const recordRef = getRecordRef();
      onValue(recordRef, snapshot => {
        const recordData = snapshot.val();

        const counts = Array(subjects.length).fill(0);
        const records = Object.keys(recordData).map(key => {
          const record = recordData[key];
          const date = new Date(record.timestamp);
          const datetime = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
          
          const recordSubject = subjects.find((subject, i) => {
            const subjectArr = subject.subject;
            if (subjectArr[0] === record.majorSubject && subjectArr[subjectArr.length-1] === record.subSubject) {
              counts[i]++;
              return true;
            };
            return false;
          });
          
          return {
            key: key,
            datetime: datetime,
            subject: recordSubject,
          };
        }).reverse();
        
        setRecords(records);
        setRecordCounts(counts);
      });
    }
  }, [isSubjectsLoading]);

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
    setIsSubjectsLoading(false);
  };

  return (
    <div className="App mx-auto">
      <Navbar isLogin={isLogin} setIsLogin={setIsLogin} />
      <div className="main-container mx-auto my-4">
        <SubjectPicker subjects={subjects} isLogin={isLogin} records={records} />
        <div className="d-flex">
          <div className="w-50">
            <SubjectList subjects={subjects} recordCounts={recordCounts} />
          </div>
          <div className="w-50">
            <ListRecord records={records} isLogin={isLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;