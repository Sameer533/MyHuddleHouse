import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import './App.css'; // Import CSS for styling
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { ref, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions
import { db, storage } from './firebase'; // Import Firebase configuration

const App = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [scheduleImageUrl, setScheduleImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Load announcements from Firestore and schedule image from Firebase Storage
  useEffect(() => {
    // Fetch announcements from Firestore
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'announcements'));
        const announcementsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(announcementsData.map(announcement => announcement.text)); // Extract 'text' field
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    // Fetch schedule image from Firebase Storage
    const fetchScheduleImage = async () => {
      try {
        const imageUrl = await getDownloadURL(ref(storage, 'schedules/currentSchedule.jpg'));
        setScheduleImageUrl(imageUrl);
      } catch (error) {
        console.error('Error fetching schedule image:', error);
      }
    };

    fetchAnnouncements();
    fetchScheduleImage();
  }, []);

  // Handle image zoom by setting the selected image
  const handleImageZoom = (url) => {
    setSelectedImage(url);
  };

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <h1>Welcome!</h1>

        {/* Announcements Section */}
        <div className="announcements-section">
          <h2>Manager Announcements</h2>
          <ul>
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <li key={index}>{announcement}</li>
              ))
            ) : (
              <p>No announcements available</p>
            )}
          </ul>
        </div>

        {/* Schedule Image Section */}
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
            <p>No schedule available</p>
          )}
        </div>
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

export default App;
