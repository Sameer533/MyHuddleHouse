import React, { useState } from 'react';
import './Masti.css'; // Import your CSS file
import Navbar from './Navbar';

const Masti = () => {
  const [selectedImage, setSelectedImage] = useState(null); // State for the zoomed image

  // Sample data for employees
  const valuableEmployees = [
    { id: 1, name: 'John Doe', photo: 'https://via.placeholder.com/300', description: 'Top-performing server.' },
    { id: 2, name: 'Jane Smith', photo: 'https://via.placeholder.com/300', description: 'Always on time and reliable.' },
  ];

  const haramiEmployees = [
    { id: 1, name: 'Jim Brown', photo: 'https://via.placeholder.com/300', description: 'Needs improvement.' },
    { id: 2, name: 'Sara White', photo: 'https://via.placeholder.com/300', description: 'Frequently late to shifts.' },
  ];

  const healthInsuranceEmployees = [
    { id: 1, name: 'Mike Johnson', photo: 'https://via.placeholder.com/300', description: 'Covered under health insurance.' },
  ];

  const formerEmployees = [
    { id: 1, name: 'Anna Blue', photo: 'https://via.placeholder.com/300', description: 'Left the company last month.' },
  ];

  // Function to handle image zoom
  const handleImageZoom = (url) => {
    setSelectedImage(url);
  };

  return (
    <div className="masti-container">
        <Navbar/>
      {/* Owner Profile */}
      <div className="owner-profile">
        <img
          src="https://via.placeholder.com/300"
          alt="Owner"
          className="profile-pic"
          onClick={() => handleImageZoom('https://via.placeholder.com/300')} // Trigger zoom on click
        />
        <h2>Owner: Mr. Boss</h2>
        <p>Manager of the finest employees.</p>
      </div>

      {/* Valuable Employees */}
      <div className="employee-section">
        <h3>My Valuable Employees</h3>
        <div className="employee-cards">
          {valuableEmployees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <img
                src={employee.photo}
                alt={employee.name}
                className="employee-photo"
                onClick={() => handleImageZoom(employee.photo)} // Trigger zoom on click
              />
              <h4>{employee.name}</h4>
              <p>{employee.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Harami Employees */}
      <div className="employee-section">
        <h3>My Harami Employees</h3>
        <div className="employee-cards">
          {haramiEmployees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <img
                src={employee.photo}
                alt={employee.name}
                className="employee-photo"
                onClick={() => handleImageZoom(employee.photo)} // Trigger zoom on click
              />
              <h4>{employee.name}</h4>
              <p>{employee.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Employees with Health Insurance */}
      <div className="employee-section">
        <h3>Employees with Health Insurance</h3>
        <div className="employee-cards">
          {healthInsuranceEmployees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <img
                src={employee.photo}
                alt={employee.name}
                className="employee-photo"
                onClick={() => handleImageZoom(employee.photo)} // Trigger zoom on click
              />
              <h4>{employee.name}</h4>
              <p>{employee.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Former Employees */}
      <div className="employee-section">
        <h3>Former Employees</h3>
        <div className="employee-cards">
          {formerEmployees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <img
                src={employee.photo}
                alt={employee.name}
                className="employee-photo"
                onClick={() => handleImageZoom(employee.photo)} // Trigger zoom on click
              />
              <h4>{employee.name}</h4>
              <p>{employee.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <h3>RoyalSeven-Meme-compliation.mp4</h3>
        <video controls width="600">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Modal for Zooming Image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Zoomed" />
        </div>
      )}
    </div>
  );
};

export default Masti;
