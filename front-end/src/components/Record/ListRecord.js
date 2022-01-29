import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { deleteRecord } from "../../api";
import SubjectItem from "../Subject/SubjectItem";

const ListRecord = ({ subjects, recordRef, isLogin }) => {
  const [records, setRecords] = useState(undefined);
  const [dateCounts, setDateCounts] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    onValue(recordRef, snapshot => {
      if (subjects.length !== 0) {
        const data = snapshot.val();

        const recordsArr = Object.keys(data).map(key => {
          const record = data[key];
          const date = new Date(record.timestamp);
          const datetime = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    
          const recordSubject = subjects.find(subject => {
            const subjectArr = subject.subject;
            return subjectArr[0] === record.majorSubject && subjectArr[subjectArr.length-1] === record.subSubject;
          });
          
          return {
            key: key,
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

  const handleDelete = key => {
    deleteRecord(key);
  };

  const switchDelete = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div>
      <table className="table">
        <tbody>
          {records ? records.map((record, i) => {
            return (
              <tr key={i}>
                {i === 0 || record.datetime !== records[i-1].datetime ? <td rowSpan={dateCounts[record.datetime]} valign="middle">{record.datetime}</td> : <></>}
                <SubjectItem subject={record.subject.subject} url={record.subject.url} classes={"flex-grow-1"} />
                <td style={{visibility: deleteMode ? "visible" : "hidden"}}>
                  <button type="button" className="del-btn btn btn-danger bg-danger py-0 px-2" onClick={() => handleDelete(record.key)}>삭제</button>
                </td>
              </tr>
            )
          }) : <></>}
        </tbody>
      </table>
      {isLogin ?
        <div onClick={switchDelete}>
          {deleteMode ?
            <button type="button" className="del-switch-btn btn btn-secondary py-0 px-4">취소</button> :
            <button type="button" className="del-switch-btn btn btn-danger bg-danger py-0 px-4">삭제</button>
          }
        </div> :
        null
      }
    </div>
  );
}
 
export default ListRecord;