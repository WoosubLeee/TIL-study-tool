import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { deleteRecord, recordStudy } from "../../api";
import { getDate } from "../../utils/common";
import SubjectItem from "../Common/SubjectItem";

const SubjectPicker = ({ subjects, isLogin, records }) => {
  const [pickAmount, setPickAmount] = useState(2);
  const [picked, setPicked] = useState(Array(pickAmount).fill(''));

  useEffect(() => {
    checkComplete(picked);
  }, [records]);

  const pickSubjects = () => {
    let indexes = [];
    let idx;
    while (indexes.length < pickAmount) {
      idx = Math.floor(Math.random() * subjects.length);
      if (!indexes.includes(idx)) {
        indexes.push(idx);
      }
    }
    
    const picked = indexes.map(idx => {
      return {
        subject: subjects[idx].subject,
        url: subjects[idx].url,
        isComplete: false,
      };
    });
    checkComplete(picked);
  };

  const checkComplete = picked => {
    if (isLogin) {
      picked = picked.map(pick => {
        const counts = records.filter(record => {
          if (JSON.stringify(record.subject.subject) === JSON.stringify(pick.subject) && (record.datetime === getDate(Date.now()))) {
            pick.isComplete = true;
            return true;
          };
          return false;
        }).length;
        if (pick.isComplete === true && counts === 0) pick.isComplete = false;
        return pick;
      });
    }
    setPicked(picked);
  };

  const handleComplete = (subject, idx) => {
    const data = {
      majorSubject: subject[0],
      subSubject: subject[subject.length-1],
    };
    recordStudy(data);
  };

  const handleCancel = idx => {
    const record = records.find(record => JSON.stringify(record.subject.subject) === JSON.stringify(picked[idx].subject));
    deleteRecord(record.key);
  };

  return (
    <div className="mx-auto text-center" id="picker-container">
      <table className="table table-bordered mb-2" id="picker-table">
        <tbody>
          {picked.map((subject, i) => {
            return (
              <tr key={i} className="picker-table-row d-flex justify-content-between">
                {subject !== '' ? 
                  <>
                    <SubjectItem subject={subject.subject} url={subject.url} classes={`picker-subject flex-grow-1 ${subject.isComplete ? "text-decoration-line-through" : ""}`} />
                    { isLogin ?
                      <td>
                        {subject.isComplete ?
                          <button onClick={() => handleCancel(i)} type="button" className="btn btn-secondary py-0 complete-btn">취소</button> :
                          <button onClick={() => handleComplete(subject.subject, i)} type="button" className="btn btn-success py-0 complete-btn">완료</button>
                        }
                      </td> : <></>
                    }
                  </> : 
                  <td className="w-100">주제를 선정해주세요</td>
                }
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={pickSubjects} type="button" className="btn btn-success mb-4">주제 선정</button>
    </div>
  );
}
 
export default SubjectPicker;