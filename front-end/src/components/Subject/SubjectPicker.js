import { useState } from "react";
import { recordStudy } from "../../api";
import SubjectItem from "./SubjectItem";

const SubjectPicker = ({ subjects, recordRef }) => {
  const [pickAmount, setPickAmount] = useState(2);
  const [picked, setPicked] = useState(Array(pickAmount).fill(' '));
  const [isPicked, setIsPicked] = useState(false);

  const pickSubjects = () => {
    let indexes = [];
    let idx;
    while (indexes.length < pickAmount) {
      idx = Math.floor(Math.random() * subjects.length);
      if (!indexes.includes(idx)) {
        indexes.push(idx);
      }
    }
    
    setPicked(indexes.map(idx => {
      return {
        subject: subjects[idx].subject,
        url: subjects[idx].url,
      };
    }));
    setIsPicked(true);
  };

  const handleComplete = subject => {
    const data = {
      majorSubject: subject[0],
      subSubject: subject[subject.length-1],
    };
    recordStudy(recordRef, data);
  };

  return (
    <div className="mx-auto text-center" id="picker-container">
      <table className="table table-bordered mb-2" id="picker-table">
        <tbody>
          {picked.map((subject, i) => {
            return (
              <tr key={i} className="picker-table-row d-flex justify-content-between">
                {isPicked ? 
                  <>
                    <SubjectItem subject={subject.subject} url={subject.url} classes={"picker-subject flex-grow-1"} />
                    <td>
                      <button onClick={() => handleComplete(subject.subject)} type="button" className="btn btn-success py-0 picker-btn complete-btn">완료</button>
                    </td>
                  </> : 
                  <td className="w-100">{"주제 선정 버튼을 클릭하세요"}</td>
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