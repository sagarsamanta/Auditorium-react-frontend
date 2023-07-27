import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

const DataTableUsers = ({ data, className }) => {    

    const columns = [
        {
            name: 'Emp Id',
            selector: row => <Link to={`/admin/users/booking/${row._id}`} className="underline text-blue-500">{row.empId}</Link>,
        },
        {
            name: 'Name',
            selector: row => <div>{row.name}</div>,
        },
        {
            name: 'Email',
            selector: row => <div>{row.email}</div>,
        },
        {
            name: 'Mobile',
            selector: row => <div>{row.mobile}</div>,
        },
        {
            name: 'Action',
            selector: row => (
                <div className="space-x-4">
                    <Link href={`/admin/users/`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 border border-blue-600 w-24 text-center text-blue-600 font-serif hover:bg-blue-600 hover:text-white">Edit</Link>


                </div>
            ),
        },
    ];
    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                className={className}
                pagination
            />
        </>
    )
}

export default DataTableUsers;
