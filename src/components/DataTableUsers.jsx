import { Link } from "react-router-dom";
import { CustomDataTable as DataTable } from "./DataTable";
import { MdEdit } from "react-icons/md";

const DataTableUsers = ({ data, className }) => {

    const columns = [
        {
            name: 'Emp Id',
            sortable: true,
            selector: row => row.empId,
            cell: row => <Link to={`/admin/users/booking/${row._id}`} className="underline text-blue-500">{row.empId}</Link>,
        },
        {
            name: 'Name',
            cell: row => <div className="w-72 md:w-80">{row.name}</div>,
        },
        {
            name: 'Email',
            cell: row => <div className="w-72">{row.email}</div>,
        },
        {
            name: 'Mobile',
            cell: row => <div>{row.mobile}</div>,
        },
        {
            name: 'Action',
            cell: row => (
                <div >
                    <Link to={`/admin/users/${row._id}`} className="inline-block p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white" title="Edit"><MdEdit size={15} /></Link>
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
