import { useEffect, useState } from "react";
import _ from "lodash";
import { getDate } from "../../utils/common";

const CalendarRecord = ({ dateCounts }) => {
  const [weekRecords, setWeekRecords] = useState([]);
  const [monthChanges, setMonthChanges] = useState([]);

  useEffect(() => {
    if (dateCounts !== {}) {
      let tempWeekRecords = [[]];
      let weekIdx = 0;
      let date = new Date();
      let tempMonthChanges = [];

      let dateStr;
      let dayRecord;
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

        dateStr = getDate(date);
        dayRecord = {
          date: _.cloneDeep(date),
          count: 0,
        };
        if (dateStr in dateCounts) {
          dayRecord.count = dateCounts[dateStr];
        }
        tempWeekRecords[weekIdx].push(dayRecord);
        
        date.setDate(date.getDate() - 1);
      }
      tempWeekRecords.reverse().splice(0, 1);
      setWeekRecords(tempWeekRecords);
      setMonthChanges(tempMonthChanges);

      console.log(monthChanges);
    }
  }, [dateCounts]);

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
                      <td key={j}>
                        <div
                          className="calendar-record-square"
                          style={{
                            backgroundColor:
                              weekRecord[i].count === 0 ? "#ebedf0" :
                              weekRecord[i].count === 1 ? "#9be9a8" :
                              weekRecord[i].count === 2 ? "#40c463" :
                              weekRecord[i].count === 3 ? "#30a14e" :
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