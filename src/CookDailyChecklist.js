import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from './firebase'; // Adjust imports for Firestore and Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage imports

const CookDailyChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [signature, setSignature] = useState(''); // New state for signature
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(
        collection(db, 'dailyChecklist'),
        where('role', '==', 'cook'),
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

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    const taskName = tasks[index].name.replace(/\s+/g, '_').toLowerCase(); // Use task name as part of image filename
    const storageRef = ref(storage, `checklistImages/cook/${taskName}_${Date.now()}`);

    // Upload the image to Firebase Storage
    await uploadBytes(storageRef, file);

    // Get the image URL
    const imageUrl = await getDownloadURL(storageRef);

    // Update the task with the image URL
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, photoURL: imageUrl } : task
    );
    setTasks(updatedTasks);

    try {
      const docRef = doc(db, 'dailyChecklist', `cook_${new Date().toISOString().split('T')[0]}`);
      await updateDoc(docRef, { tasks: updatedTasks });
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  const handleSubmit = async () => {
    // Check if all tasks have a photo uploaded and signature is provided
    const incompleteTasks = tasks.filter(task => !task.photoURL);
    if (incompleteTasks.length > 0) {
      setError('Please upload a photo for all tasks.');
      alert('Please upload a photo for all tasks.');
      return;
    }

    if (!signature) {
      setError('Please provide a signature.');
      return;
    }

    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(db, 'dailyChecklist', `cook_${today}`);

    try {
      await updateDoc(docRef, { tasks, signature }); // Add signature to Firestore document
      setIsSubmitting(false);
      alert('Work submitted successfully');
      // Redirect to home page
      window.location.href = '/home'; // Adjust the redirect URL as needed
    } catch (error) {
      console.error('Error submitting work:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Cook Daily Checklist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <p>{task.name}</p>
            <input
              type="file"
              onChange={(e) => handleImageUpload(index, e.target.files[0])}
            />
            {task.photoURL && (
              <div>
                <p>Uploaded Image:</p>
                <img src={task.photoURL} alt="Uploaded task" width="100" height="100" />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div>
        <label htmlFor="signature">Signature:</label>
        <input
          type="text"
          id="signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default CookDailyChecklist;
