import SubjectItem from './SubjectItem';

const SubjectList = ({ subjects, recordCounts }) => {
  return (
    <table className="table table-striped table-bordered table-sm">
      <thead>
        <tr className="text-center">
          <th>주제</th>
          <th id="count-col">공부 횟수</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject, i) => {
          return (
            <tr key={i}>
              <SubjectItem subject={subject.subject} url={subject.url} />
              <td className={`text-center align-middle ${recordCounts[i] > 0 ? "fw-bold" : "fw-light"}`}>{recordCounts[i]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
 
export default SubjectList;