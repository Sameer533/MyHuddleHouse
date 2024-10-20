import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const AddTaskForm = () => {
  const [task, setTask] = useState("");
  const [role, setRole] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const handleTaskChange = (e) => setTask(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleEmployeeChange = (e) => setEmployeeName(e.target.value);

  const handleAddTask = async () => {
    if (task && (role || employeeName)) {
      try {
        await addDoc(collection(db, "tasks"), {
          task: task,
          role: role,
          employeeName: employeeName,
          completed: false,
          verified: false,
        });
        alert("Task added successfully!");
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    } else {
      alert("Please enter task and assign it to either a role or employee.");
    }
  };

  return (
    <div>
      <h2>Add New Task</h2>
      <input
        type="text"
        placeholder="Enter Task"
        value={task}
        onChange={handleTaskChange}
      />
      <input
        type="text"
        placeholder="Assign to Role (optional)"
        value={role}
        onChange={handleRoleChange}
      />
      <input
        type="text"
        placeholder="Assign to Employee (optional)"
        value={employeeName}
        onChange={handleEmployeeChange}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default AddTaskForm;
