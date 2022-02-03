import { useEffect, useState } from "react";
import _ from "lodash";
import { getDate } from "../../../utils/common";

const CalendarRecord = ({ dateCounts }) => {
  const [weekRecords, setWeekRecords] = useState([]);

  useEffect(() => {
    if (dateCounts !== {}) {
      let tempWeekRecords = [[]];
      let weekIdx = 0;
      let date = new Date();
      let dateStr;
      let dayRecord;
      for (let i = 0; i < 365; i++) {
        if (date.getDay() === 0 && i !== 0) {
          tempWeekRecords[weekIdx].reverse();
          tempWeekRecords.push([]);
          weekIdx++;
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
      
      setWeekRecords(tempWeekRecords);
    }
  }, [dateCounts]);

  return (
    <table className="mx-auto">
      <tbody>
        {weekRecords ?
          weekRecords.map((week, i) => {
            return (
              <tr key={i}>
                <td className="text-end pe-2">
                  {i !== (weekRecords.length-1) && week[week.length-1].date.getMonth() !== weekRecords[i+1][weekRecords[i+1].length-1].date.getMonth() ?
                    new Intl.DateTimeFormat('ko-KR', { month: 'short' }).format(week[week.length-1].date) :
                    <></>
                  }
                </td>
                {week.map((day, j) => {
                  return (
                    <td key={j} className="p-1">
                      <div
                        className="day-record-square"
                        style={{
                          backgroundColor:
                            day.count === 0 ? "#ebedf0" :
                            day.count === 1 ? "#9be9a8" :
                            day.count === 2 ? "#40c463" :
                            day.count === 3 ? "#30a14e" :
                            "#216e39"
                        }}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          }) :
          <></>
        }
      </tbody>
    </table>
  );
}
 
export default CalendarRecord;