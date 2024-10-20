import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const AddEmployeeForm = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");

  const handleEmployeeNameChange = (e) => setEmployeeName(e.target.value);
  const handleEmployeeRoleChange = (e) => setEmployeeRole(e.target.value);

  const handleAddEmployee = async () => {
    if (employeeName && employeeRole) {
      try {
        await addDoc(collection(db, "employees"), {
          name: employeeName,
          role: employeeRole,
        });
        alert("Employee added successfully!");
      } catch (error) {
        console.error("Error adding employee: ", error);
      }
    } else {
      alert("Please fill in both employee name and role.");
    }
  };

  return (
    <div>
      <h2>Add New Employee</h2>
      <input
        type="text"
        placeholder="Enter Employee Name"
        value={employeeName}
        onChange={handleEmployeeNameChange}
      />
      <input
        type="text"
        placeholder="Enter Employee Role"
        value={employeeRole}
        onChange={handleEmployeeRoleChange}
      />
      <button onClick={handleAddEmployee}>Add Employee</button>
    </div>
  );
};

export default AddEmployeeForm;
