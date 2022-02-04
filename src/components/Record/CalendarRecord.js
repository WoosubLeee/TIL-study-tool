import { useEffect, useState } from "react";
import { Tooltip } from "bootstrap";
import _ from "lodash";
import { getDate } from "../../utils/common";

const CalendarRecord = ({ records, dateCounts }) => {
  const [weekRecords, setWeekRecords] = useState([]);
  const [monthChanges, setMonthChanges] = useState([]);

  useEffect(() => {
    if (records && dateCounts !== {}) {
      let tempWeekRecords = [[]];
      let weekIdx = 0;

      let date = new Date();
      let tempMonthChanges = [];
      
      let dayRecord;
      let daySubjects;

      for (let i = 0; i < 232; i++) {
        if (date.getDay() === 6 && i !== 0) {
          tempWeekRecords[weekIdx].reverse();
          tempWeekRecords.push([]);
          weekIdx++;
        }

        if (date.getDate() === 1) {
          tempMonthChanges.push({
            month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
            idx: weekIdx
          });
        }

        dayRecord = {
          date: _.cloneDeep(date),
          subjects: [],
        };
        daySubjects = records.filter(record => record.datetime === getDate(date));
        if (daySubjects) {
          dayRecord.subjects = daySubjects.map(record => record.subject.subject);
        }
        tempWeekRecords[weekIdx].push(dayRecord);
        
        date.setDate(date.getDate() - 1);
      }
      tempWeekRecords.reverse().splice(0, 1);
      setWeekRecords(tempWeekRecords);
      setMonthChanges(tempMonthChanges);
    }
  }, [records, dateCounts]);

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl)
  });

  const formatTooltip = record => {
    let string = getDate(record.date);
    if (record.subjects.length > 0) {
      string += `\n${record.subjects.length}개`
    } else {
      string += '\n기록 없음'
    }
    return string;
  };

  return (
    <div className="my-4">
      <div id="calendar-header" className="mx-auto">
        {monthChanges.map((data, i) => {
          return (
            <span key={i} className="calendar-month" style={{right: `${data.idx*14.4}px`}}>
              {data.month}
            </span>
          )
        })}
      </div>
      <table className="mx-auto">
        <tbody>
          {Array(7).fill(0).map((a, i) => {
            return (
              <tr key={i}>
                {weekRecords.map((weekRecord, j) => {
                  if (weekRecord.length > i) {
                    return (
                      <td
                        key={j}
                        data-bs-toggle="tooltip"
                        title={formatTooltip(weekRecord[i])}
                        className="record-tooltip"
                      >
                        <div
                          className="calendar-record-square"
                          style={{
                            backgroundColor:
                              weekRecord[i].subjects.length === 0 ? "#ebedf0" :
                              weekRecord[i].subjects.length === 1 ? "#9be9a8" :
                              weekRecord[i].subjects.length === 2 ? "#40c463" :
                              weekRecord[i].subjects.length === 3 ? "#30a14e" :
                              "#216e39"
                          }}
                        />
                      </td>
                    )
                  }
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
 
export default CalendarRecord;