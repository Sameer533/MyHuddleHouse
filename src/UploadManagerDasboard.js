import React, { useState, useEffect } from 'react';
import './UploadManagerDashboard.css'; // Import the styles
import Navbar from './Navbar';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

const UploadManagerDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [scheduleImageUrl, setScheduleImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Load announcements from Firestore
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const querySnapshot = await getDocs(collection(db, "announcements"));
      const announcementsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(announcementsData);
    };

    fetchAnnouncements();

    // Fetch the current schedule image URL from Firebase Storage
    const fetchScheduleImage = async () => {
      try {
        const imageUrl = await getDownloadURL(ref(storage, 'schedules/currentSchedule.jpg'));
        setScheduleImageUrl(imageUrl);
      } catch (error) {
        console.log("No existing schedule found.");
      }
    };

    fetchScheduleImage();
  }, []);

  // Add new announcement to Firestore
  const addAnnouncement = async () => {
    if (newAnnouncement.trim()) {
      const docRef = await addDoc(collection(db, "announcements"), {
        text: newAnnouncement,
      });
      setAnnouncements([...announcements, { id: docRef.id, text: newAnnouncement }]);
      setNewAnnouncement(""); // Clear input
    }
  };

  // Delete announcement from Firestore
  const deleteAnnouncement = async (id) => {
    await deleteDoc(doc(db, "announcements", id));
    setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
  };

  // Handle schedule image upload to Firebase Storage (replace the existing image)
  const handleScheduleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, 'schedules/currentSchedule.jpg'); // Fixed path for the schedule
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      setScheduleImageUrl(imageUrl); // Update with the new URL
    }
  };

  // Function to handle image zoom
  const handleImageZoom = (url) => {
    setSelectedImage(url);
  };

  return (
    <div className="upload-manager-dashboard">
      <Navbar />
      <h1>Add & Upload</h1>

      {/* Announcements Section */}
      <div className="announcements-section">
        <h2>Announcements</h2>
        <ul>
          {announcements.map((announcement) => (
            <li key={announcement.id}>
              {announcement.text}
              <button className="delete-button" onClick={() => deleteAnnouncement(announcement.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          placeholder="Add new announcement"
        />
        <button onClick={addAnnouncement}>Add Announcement</button>
      </div>

      {/* Schedule Section */}
      <div className="schedule-section">
        <h2>Work Schedule</h2>
        {scheduleImageUrl ? (
          <img
            src={scheduleImageUrl}
            alt="Work Schedule"
            className="schedule-image"
            onClick={() => handleImageZoom(scheduleImageUrl)}
          />
        ) : (
          <p>No schedule uploaded</p>
        )}
        <input type="file" onChange={handleScheduleImageUpload} />
      </div>

      {/* Modal for Zooming Image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Zoomed Schedule" />
        </div>
      )}
    </div>
  );
};

export default UploadManagerDashboard;
