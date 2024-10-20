import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import path as needed

const ServerDailyChecklist = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(
        collection(db, 'dailyChecklist'),
        where('role', '==', 'server'),
        where('date', '==', new Date().toISOString().split('T')[0])
      );
      const querySnapshot = await getDocs(q);
      const taskData = [];
      querySnapshot.forEach((doc) => {
        taskData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(taskData.length > 0 ? taskData[0].tasks : []);
    };

    fetchTasks();
  }, []);

  const handleTaskChange = async (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    try {
      const docRef = doc(db, 'dailyChecklist', `server_${new Date().toISOString().split('T')[0]}`);
      await updateDoc(docRef, { tasks: updatedTasks });
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  return (
    <div>
      <h2>Server Daily Checklist</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleTaskChange(index)}
            />
            {task.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerDailyChecklist;
