const SubjectItem = ({ subject, url, classes }) => {
  return (
    <td className={classes}>
      <a href={url} className="text-decoration-none text-dark" target="_blank" rel="noreferrer">
        {subject.join(' / ')}
      </a>
    </td>
  );
}
 
export default SubjectItem;