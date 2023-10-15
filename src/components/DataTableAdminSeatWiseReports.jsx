import React from "react";
import { displayDate, getCurrencyFormat } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";
import { SEATS_STATUS } from "../lib/consts";

const DataTableAdminSeatWiseReports = ({ data, className, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-52 lg:h-96">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 h-16 w-16"></div>
      </div>
    );
  }

  // Collect all unique shows across all data objects and sort them
  const allShows = data
    .reduce((shows, report) => {
      report.shows.forEach((show) => {
        if (!shows.includes(show.showTitle)) {
          shows.push(show.showTitle);
        }
      });
      return shows;
    }, [])
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  return (
    <div className="overflow-x-auto">
      <div className="w-full overflow-x-auto">
        <table className="table-fixed min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">Movie Title</th>
              <th className="px-2 py-1 border">Release Date</th>
              {allShows.map((showTitle) => (
                <th
                  key={showTitle}
                  className="px-2 py-1 border text-center font-semibold text-sm"
                >
                  {showTitle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((report, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-2 py-1 border text-xs">
                  {report.movieTitle}
                </td>
                <td className="px-2 py-1 border text-xs">
                  {displayDate(report.releaseDate)}
                </td>
                {allShows.map((showTitle) => {
                  const show = report.shows.find(
                    (show) => show.showTitle === showTitle
                  );
                  return (
                    <td key={showTitle} className="px-2 py-1 border">
                      <table className="table-auto">
                        <tbody className="">
                          {show?.dates.map((dateInfo) => (
                            <tr key={dateInfo.date}>
                              <td className="px-1 py-1 text-center text-xs">
                                {new Date(dateInfo.date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              {dateInfo.statusCounts.map((statusCount) => (
                                <React.Fragment key={statusCount.status}>
                                  <td className="px-1 py-1 text-center">
                                    <span
                                      className={`${
                                        statusCount.status ===
                                          SEATS_STATUS.BOOKED && "text-blue-600"
                                      } ${
                                        statusCount.status ===
                                          SEATS_STATUS.VISITED &&
                                        "text-green-600"
                                      } 
                                      ${
                                        statusCount.status ===
                                          SEATS_STATUS.RESERVED &&
                                        "text-yellow-600"
                                      }  text-xs font-semibold`}
                                    >
                                      {statusCount.status}
                                    </span>
                                  </td>
                                  <td className="px-1 py-1 text-center">
                                    <span className="text-xs font-semibold">
                                      {statusCount.count}
                                    </span>
                                  </td>
                                </React.Fragment>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableAdminSeatWiseReports;
