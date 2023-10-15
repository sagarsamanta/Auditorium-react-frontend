import React from "react";
import DataTable from "react-data-table-component";
import { PiSpinnerGapThin } from "react-icons/pi";

export const CustomDataTable = ({
  columns,
  data,
  className,
  paginationPerPage,
  onPageChange,
  currentPage,
  totalRecords,
  ...rest
}) => {
  const handlePageChange = ({ selected }) => {
    // Handle the next page action
    console.log("Next Page Clicked, New Page:", selected + 1);
    // You can perform any additional actions here, such as fetching data for the next page.
  };
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        className={className}
        pagination // Enable pagination
        paginationPerPage={2} // Number of records per page
        paginationTotalRows={totalRecords} // Total number of records
        paginationDefaultPage={currentPage} // Current page
        paginationOnChange={onPageChange} // Page change handler
        onPageChange={handlePageChange}
        progressComponent={
          <div className="animate-spin">
            <PiSpinnerGapThin size={40} />
          </div>
        }
        {...rest}
        customStyles={{
          headRow: {
            style: {
              fontWeight: "bold",
              fontSize: "15px",
            },
          },
        }}
      />
    </>
  );
};
