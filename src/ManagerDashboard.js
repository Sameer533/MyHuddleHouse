import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase'; // Import Firebase
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Firestore functions
import { ref, deleteObject } from 'firebase/storage'; // Storage functions
import './ManagerDashboard.css'; // Import the styles
import { Link } from 'react-router-dom';
import UploadManagerDashboard from './UploadManagerDasboard';


const ManagerDashboard = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image for zooming



  // Fetch the daily checklists (for both cook and server)
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dailyChecklists'));
        const fetchedChecklists = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChecklists(fetchedChecklists);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching checklists: ', error);
        setLoading(false);
      }
    };

    fetchChecklists();
  }, []);

  // Handle image zoom by setting the selected image
  const handleImageZoom = (url) => {
    setSelectedImage(url);
  };

  // Handle deleting checklist (Firestore + Storage)
  const handleDeleteChecklist = async (checklistId, tasks) => {
    try {
      // First, delete the checklist from Firestore
      await deleteDoc(doc(db, 'dailyChecklists', checklistId));

      // Then, delete associated images from Firebase Storage
      const deleteImagePromises = tasks.map((task) => {
        const storageRef = ref(storage, task.photoURL);
        return deleteObject(storageRef).catch((error) => {
          console.error('Error deleting image from storage: ', error);
        });
      });

      await Promise.all(deleteImagePromises);
      setChecklists(checklists.filter((checklist) => checklist.id !== checklistId));
      alert('Checklist and associated images deleted successfully!');
    } catch (error) {
      console.error('Error deleting checklist: ', error);
      alert('There was an error deleting the checklist.');
    }
  };

  if (loading) {
    return <p>Loading checklists...</p>;
  }

  return (
    <div>
      
      {/* <Link to="/"><button className='logoutButton'>Logout</button></Link> */}
      <Link to ="/manager-upload"><button>Upload schedule and add announcements</button></Link>
      <h1>Verify Checklist</h1>

      <div className="checklist-container">
        {checklists.length === 0 ? (
          <p>No checklists to verify</p>
        ) : (
          checklists.map((checklist) => (
            <div className="checklist-card" key={checklist.id}>
              <h3>{checklist.role === 'cook' ? 'Cook' : 'Server'} Checklist</h3>
              <p>Date: {checklist.date}</p>
              <h3>{checklist.signature}</h3>

              <div>
                <h4>Tasks:</h4>
                {checklist.tasks.map((task, index) => (
                  <div key={index}>
                    <p>{task.name}</p>
                    <img
                      src={task.photoURL}
                      alt={`Task ${index + 1}`}
                      className="task-image"
                      width="150"
                      height="150"
                      onClick={() => handleImageZoom(task.photoURL)}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleDeleteChecklist(checklist.id, checklist.tasks)}
                className="delete-button"
              >
                Delete Checklist
              </button>
            </div>
          ))
        )}
      </div>
      

      {/* Modal for Zooming Image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Zoomed Task" />
        </div>
      )} 
    </div>
  );
};

export default ManagerDashboard;
