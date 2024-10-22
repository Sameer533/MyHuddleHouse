import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase'; // Import Firebase
import { setDoc, doc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Storage functions
import { useNavigate } from 'react-router-dom'; // For navigation after submission
import './CookDashboard.css'; // Import CSS file for styling
import Navbar from './Navbar';

const CookDashboard = () => {
  const navigate = useNavigate();
  const [signature, setSignature] = useState('');
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

  useEffect(() => {
    const cachedTasks = JSON.parse(localStorage.getItem('tasks')) || tasks;
    setTasks(cachedTasks);
  }, []);

  const saveToLocalStorage = (updatedTasks) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Handle file change
  const handleFileChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedTasks = [...tasks];
      updatedTasks[index].image = reader.result;
      setTasks(updatedTasks);
      saveToLocalStorage(updatedTasks);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Check if all tasks have images uploaded
  const allTasksHaveImages = tasks.every((task) => task.image !== null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allTasksHaveImages) {
      alert('Please upload images for all tasks before submitting.');
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    const taskPromises = tasks.map(async (task, index) => {
      if (!task.image) return null;

      const blob = await (await fetch(task.image)).blob();
      const uniqueFileName = `task_${index + 1}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `checklistPhotos/${today}/${uniqueFileName}`);

      const uploadTask = await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      return { name: task.name, photoURL: downloadURL };
    });

    try {
      const taskResults = await Promise.all(taskPromises);
      const completedTasks = taskResults.filter(Boolean);

      const checklistData = {
        role: 'cook',
        tasks: completedTasks,
        signature,
        date: today
      };

      await setDoc(doc(db, 'dailyChecklists', `cook_${today}_${Date.now()}`), checklistData);

      setLoading(false);
      alert('Work submitted successfully!');
      localStorage.removeItem('tasks');
      navigate('/');
    } catch (error) {
      console.error('Error submitting the checklist: ', error);
      setLoading(false);
      alert('There was an error submitting the checklist.');
    }
  };

  return (
    <div className="cook-dashboard">
      <Navbar />
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
            />
            {task.image && (
              <img src={task.image} alt={`Preview ${index}`} className="preview-image" />
            )}
          </div>
        ))}

        <div className="signature-field">
          <label>Signature & Shift:</label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading || !allTasksHaveImages}>
          {loading ? 'Submitting...' : 'Submit Checklist'}
        </button>
      </form>
    </div>
  );
};

export default CookDashboard;
