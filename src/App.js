import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getRepoFiles, getRecordRef } from "./api";
import Navbar from "./components/Navbar";
import SubjectPicker from './components/SubjectPicker';
import SubjectList from './components/SubjectList';
import ListRecord from "./components/Record/ListRecord";
import CalendarRecord from "./components/Record/CalendarRecord";
import { getDate } from "./utils/common";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState(undefined);
  const [recordCounts, setRecordCounts] = useState([]);
  const [dateCounts, setDateCounts] = useState({});
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
          const datetime = getDate(record.timestamp);
          
          let recordSubject = subjects.find((subject, i) => {
            const subjectArr = subject.subject;
            if (subjectArr[0] === record.majorSubject && subjectArr[subjectArr.length-1] === record.subSubject) {
              counts[i]++;
              return true;
            };
            return false;
          });

          // subjects에 record와 관련된 subject가 없을 경우(README 문서가 삭제된 경우)
          // record의 majorSubject, subSubject만 사용하여 recordSubject 생성
          if (!recordSubject) {
            recordSubject = {
              subject: [record.majorSubject, record.subSubject],
              url: undefined
            };
          }
          
          return {
            key: key,
            datetime: datetime,
            subject: recordSubject,
          };
        });

        records.sort((a, b) => {
          const aDate = a.datetime.split('/').map(time => parseInt(time));
          const bDate = b.datetime.split('/').map(time => parseInt(time));
          for (let i = 0; i < 3; i++) {
            if (aDate[i] > bDate[i]) {
              return -1;
            } else if (aDate[i] < bDate[i]) {
              return 1;
            }
          }
          return -1;
        });
        
        setRecords(records);
        setRecordCounts(counts);

        let dateCounts = {};
        records.forEach(record => {
          if (!dateCounts.hasOwnProperty(record.datetime)) {
            dateCounts[record.datetime] = 0;
          }
          dateCounts[record.datetime]++;
        });
        setDateCounts(dateCounts);
      });
    }
  }, [subjects]);

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
        <SubjectPicker subjects={subjects} isLogin={isLogin} records={records} />
        <div className="d-flex">
          <div className="w-50">
            <SubjectList subjects={subjects} recordCounts={recordCounts} />
          </div>
          <div className="w-50">
            <h5 className="text-center text-success">
              <span id="record-header">기록</span>
            </h5>
            <CalendarRecord records={records} dateCounts={dateCounts} />
            <ListRecord records={records} dateCounts={dateCounts} isLogin={isLogin} /> :
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;