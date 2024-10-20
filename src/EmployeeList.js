import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch employees from Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"));
        const employeeData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle deletion of employee
  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this employee?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "employees", id));
        setEmployees(employees.filter((employee) => employee.id !== id));
        alert("Employee removed successfully!");
      } catch (error) {
        console.error("Error removing employee: ", error);
      }
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.role}
            <button onClick={() => handleDeleteEmployee(employee.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
