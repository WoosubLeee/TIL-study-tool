import { useState } from "react";
import { deleteRecord } from "../../api";
import SubjectItem from "../Common/SubjectItem";

const ListRecord = ({ records, dateCounts, isLogin }) => {
  const [deleteMode, setDeleteMode] = useState(false);

  const handleDelete = key => {
    deleteRecord(key);
  };

  const switchDelete = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div>
      <table id="list-record" className="table table-bordered">
        <tbody>
          {records ? records.map((record, i) => {
            return (
              <tr key={i} className="record-row">
                {i === 0 || record.datetime !== records[i-1].datetime ? <td className="list-record-item record-date text-center align-middle" rowSpan={dateCounts[record.datetime]}>{record.datetime}</td> : <></>}
                <SubjectItem subject={record.subject.subject} url={record.subject.url} classes={"list-record-item flex-grow-1"} />
                {deleteMode ? 
                  <td className="list-record-delete-td text-center">
                    <button type="button" className="del-btn btn btn-danger bg-danger py-0 px-2" onClick={() => handleDelete(record.key)}>삭제</button>
                  </td> :
                  <></>
                }
              </tr>
            )
          }) : <></>}
        </tbody>
      </table>
      {isLogin ?
        <div className="position-relative" onClick={switchDelete}>
          {deleteMode ?
            <button type="button" className="del-switch-btn btn btn-secondary py-0 px-4">닫기</button> :
            <button type="button" className="del-switch-btn btn btn-danger bg-danger py-0 px-4">삭제</button>
          }
        </div> :
        null
      }
    </div>
  );
}
 
export default ListRecord;