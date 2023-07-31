import DataTable from "react-data-table-component";

export const CustomDataTable = ({ columns, data, className, ...rest }) => {
    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                className={className}
                {...rest}
                // noHeader // Hide the default table header
                customStyles={{
                    headRow: {
                        style: {
                            // Center the column names (headers)
                            // textAlign: 'center',
                            // backgroundColor: '#4f46e580', // Change the background color of the column headers
                            // color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '15px',
                        },
                    },
                }}
            />
        </>
    )
}
