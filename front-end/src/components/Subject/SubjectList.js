import SubjectItem from './SubjectItem';

const SubjectList = ({ subjects }) => {
  return (
    <table className="table table-striped table-bordered table-sm">
      <tbody>
        {subjects.map((subject, i) => {
          return (
            <tr key={i}>
              <SubjectItem subject={subject.subject} url={subject.url} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
 
export default SubjectList;