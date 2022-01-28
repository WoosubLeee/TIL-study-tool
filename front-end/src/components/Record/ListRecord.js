import { onValue } from "firebase/database";
import { useEffect, useState } from "react";
import SubjectItem from "../Subject/SubjectItem";

const ListRecord = ({ subjects, recordRef }) => {
  const [records, setRecords] = useState(undefined);
  const [dateCounts, setDateCounts] = useState({});

  useEffect(() => {
    onValue(recordRef, snapshot => {
      if (subjects.length !== 0) {
        const data = snapshot.val();

        const recordsArr = Object.values(data).map(record => {
          const date = new Date(record.timestamp);
          const datetime = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    
          const recordSubject = subjects.find(subject => {
            const subjectArr = subject.subject;
            return subjectArr[0] === record.majorSubject && subjectArr[subjectArr.length-1] === record.subSubject;
          });
          
          return {
            datetime: datetime,
            subject: recordSubject,
          };
        }).reverse();
        
        setRecords(recordsArr);
        countDates(recordsArr);
      }
    });
  }, [subjects]);

  const countDates = (records) => {
    let counts = {};
    records.forEach(record => {
      if (!counts.hasOwnProperty(record.datetime)) {
        counts[record.datetime] = 0;
      }
      counts[record.datetime]++;
    });
    setDateCounts(counts);
  };

  return (
    <table className="table">
      <tbody>
        {records ? records.map((record, i) => {
          return (
            <tr key={i}>
              {i === 0 || record.datetime !== records[i-1].datetime ? <td rowSpan={dateCounts[record.datetime]}>{record.datetime}</td> : <></>}
              <SubjectItem subject={record.subject.subject} url={record.subject.url} />
            </tr>
          )
        }) : <></>}
      </tbody>
    </table>
  );
}
 
export default ListRecord;