import React, { useState, useEffect } from "react";
import axiosclient from "../../services/axiosclient";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

function User() {
  const [userData, setUserData] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [filterText, setFilterText] = useState("");

  const navigate = useNavigate(); // 👈 navigation hook

  const fetchUserData = async () => {
    try {
      const response = await axiosclient.get("get_users_record.php");
      if (response.data.status === "success") {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "User will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosclient.delete("delete.php", { data: { id } });
      if (response.data.status === "success") {
        setUserData((prev) => prev.filter((user) => user.ID !== id));
        MySwal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      MySwal.fire("Error", "Delete failed", "error");
    }
  };

  const handleEdit = (user) => setEditUser(user);

  const handleChange = (e) =>
    setEditUser({ ...editUser, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const response = await axiosclient.put("update.php", editUser);
      if (response.data.status === "success") {
        MySwal.fire({
          icon: "success",
          title: "Updated!",
          timer: 1200,
          showConfirmButton: false,
        });
        setEditUser(null);
        fetchUserData();
      }
    } catch (error) {
      MySwal.fire("Error", "Update failed", "error");
    }
  };

  const customStyles = {
    rows: {
      style: {
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#f8fafc",
        color: "#6b7280",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.ID,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold text-primary">#{row.ID}</span>
      ),
    },
    {
      name: "Username",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Password",
      cell: () => <span className="text-muted">••••••••</span>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="btn btn-danger btn-sm me-2"
            onClick={() => handleDelete(row.ID)}
          >
            Delete
          </button>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
        </>
      ),
    },
  ];

  const filteredItems = userData.filter(
    (item) =>
      (item.Name &&
        item.Name.toLowerCase().includes(filterText.toLowerCase())) ||
      String(item.ID).includes(filterText)
  );

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f1f5f9", minHeight: "100vh" }}
    >
      <h2 className="mb-4 text-dark fw-bold">User Management</h2>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold text-dark">User List</h5>

          {/* 👇 Search + Add Button */}
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by ID or Name"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />

            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/")}
            >
              + Add User
            </button>
          </div>
        </div>

        <div className="card-body">
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            noDataComponent={
              <div className="text-muted py-3">No users found</div>
            }
          />
        </div>
      </div>

      {editUser && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditUser(null)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Name"
                    value={editUser.Name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Password"
                    value={editUser.Password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;