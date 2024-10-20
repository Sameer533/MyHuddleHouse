import { useState } from "react";
import './ManagerLogin.css'; // Import the styles

const ManagerLogin = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePinChange = (e) => setPin(e.target.value);

  const handleLogin = () => {
    const managerPin = "1234"; // Replace with the desired PIN
    if (pin === managerPin) {
      onLogin(); // Call the onLogin prop to show the dashboard
    } else {
      setError("Incorrect PIN, try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(); // Call handleLogin when Enter key is pressed
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Manager Login</h2>
        <input
          type="password"
          value={pin}
          onChange={handlePinChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter Manager PIN"
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ManagerLogin;
