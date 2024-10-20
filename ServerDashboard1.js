import React, { useState } from 'react';
import { db, storage } from './firebase'; // Import Firebase
import { setDoc, doc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Storage functions
import { useNavigate } from 'react-router-dom'; // For navigation after submission

const ServerDashboard = () => {
  const navigate = useNavigate();
  const [signature, setSignature] = useState(''); // To store server's signature
  const [tasks, setTasks] = useState([
    { name: 'STOCK CONDIMENTS STAND & JELLY CADDIES', image: null },
    { name: 'STOCK TOGO CUPS/LIDS/BAGS/ETC', image: null },
    { name: 'CLEAN & REFILL SYRUPS', image: null },
    { name: 'DISHES – CLEAN DISHPIT & PUT AWAY ALL DISHES', image: null },
    { name: 'BAG ALL SILVERWARE', image: null },
    { name: 'CUT LEMONS – AT LEAST ½ BAIN', image: null },
    { name: 'DETAIL & CLEAN COFFEE POTS & STAND', image: null },
    { name: 'REMOVE & SOAK BOTH TEA URNS', image: null },
    { name: 'REFILL ICE BIN', image: null },
    { name: 'WIPE ALL TABLES, FILL NAPKINS, SUGAR CADDIES', image: null },
    { name: 'SWEEP & MOP FRONT HOUSE', image: null },
    { name: 'EMPTY ALL TRASH CANS', image: null },
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
        role: 'server',
        tasks: completedTasks,
        signature,
        date: today
      };

      // Save the checklist with a unique ID in Firestore
      await setDoc(doc(db, 'dailyChecklists', `server_${today}_${Date.now()}`), checklistData);

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
    <div>
      <h1>Server Daily Checklist</h1>
      <form onSubmit={handleSubmit}>
        {tasks.map((task, index) => (
          <div key={index}>
            <p>{task.name}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              required
            />
          </div>
        ))}

        <div>
          <label>Signature & Shift: </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Checklist'}
        </button>
      </form>
    </div>
  );
};

export default ServerDashboard;
