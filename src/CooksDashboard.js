import React, { useState } from 'react';
import { db, storage } from './firebase'; // Import Firebase
import { setDoc, doc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Storage functions
import { useNavigate } from 'react-router-dom'; // For navigation after submission
import './CookDashboard.css'; // Import CSS file for styling
import Navbar from './Navbar';

const CookDashboard = () => {
  const navigate = useNavigate();
  const [signature, setSignature] = useState(''); // To store cook's signature
  const [tasks, setTasks] = useState([
    { name: 'STOCK – Sandwich board, Meat Drawers', image: null, icon: '📦' },
    { name: 'STOCK – Back Cooler', image: null, icon: '📦' }, 
    { name: 'STOCK – Front Cooler', image: null, icon: '📦' },
    { name: 'STOCK BREAD', image: null, icon: '🍞' },
    { name: 'STOCK EGGS', image: null, icon: '🍽️' },
    { name: 'PREP', image: null, icon: '🧽' },
    { name: 'CLEAN WAFFLE IRONS', image: null, icon: '🧽' },
    { name: 'CLEAN EGG BURNERS & EGG SHELL CONTAINERS', image: null, icon: '🧴' },
    { name: 'SWEEP AND MOP FRONT', image: null, icon: '🧼' },
    { name: 'SWEEP AND MOP BACK', image: null, icon: '🧽' },
    { name: 'ALL DISHES & SINK', image: null, icon: '🍽️' },
    { name: 'CLEAN MICROWAVE', image: null, icon: '🍴' },
    { name: 'CLEAN DISH PIT', image: null, icon: '🧽' },
    { name: 'BRICK GRILL', image: null, icon: '🔥' },
    { name: 'TRASH', image: null, icon: '🗑️' },
  ]);

  const [loading, setLoading] = useState(false);

  // Handle image selection for each task
  const handleFileChange = (index, file) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].image = file;
    setTasks(updatedTasks);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    // Process each task and upload image to Firebase Storage
    const taskPromises = tasks.map(async (task, index) => {
      if (!task.image) return null;

      // Create a unique file name using task index and current timestamp
      const uniqueFileName = `task_${index + 1}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `checklistPhotos/${today}/${uniqueFileName}`);

      const uploadTask = await uploadBytesResumable(storageRef, task.image);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      return { name: task.name, photoURL: downloadURL }; // Return the task with its photo URL
    });

    try {
      const taskResults = await Promise.all(taskPromises); // Wait for all tasks to be uploaded

      // Filter out any tasks that didn't have images uploaded
      const completedTasks = taskResults.filter(Boolean);

      // Save checklist and tasks to Firestore
      const checklistData = {
        role: 'cook',
        tasks: completedTasks,
        signature,
        date: today
      };

      // Save the checklist with a unique ID in Firestore
      await setDoc(doc(db, 'dailyChecklists', `cook_${today}_${Date.now()}`), checklistData);

      setLoading(false);
      alert('Work submitted successfully!');
      navigate('/'); // Redirect to home dashboard after successful submission
    } catch (error) {
      console.error('Error submitting the checklist: ', error);
      setLoading(false);
      alert('There was an error submitting the checklist.');
    }
  };

  return (
    <div className="cook-dashboard">
       <Navbar/>
      <h1>Cook Daily Checklist</h1>
      <form onSubmit={handleSubmit}>
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <span className="task-icon">{task.icon}</span>
            <p>{task.name}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              required
            />
          </div>
        ))}

        <div className="signature-field">
          <label>Signature & Shift  : </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Checklist'}
        </button>
      </form>
    </div>
  );
};

export default CookDashboard;
