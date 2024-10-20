import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path according to your project

// Function to add the default daily checklist for cooks
const addCooksDailyChecklist = async () => {
  const today = new Date().toISOString().split('T')[0];

  const checklistData = {
    role: 'cook',
    tasks: [
      { name: "STOCK – Sandwich board, Cooler, Freezer, Meat Drawers", completed: false, photoURL: "" },
      { name: "CLEAN WAFFLE IRONS", completed: false, photoURL: "" },
      { name: "CLEAN EGG BURNERS & EGG SHELL CONTAINERS", completed: false, photoURL: "" },
      { name: "WIPE ALL BOARDS & COUNTERS", completed: false, photoURL: "" },
      { name: "SWEEP AND MOP FRONT", completed: false, photoURL: "" },
      { name: "SWEEP AND MOP BACK", completed: false, photoURL: "" },
      { name: "ALL DISHES & SINK", completed: false, photoURL: "" },
      { name: "CLEAN MICROWAVE", completed: false, photoURL: "" },
      { name: "STOCK BREAD", completed: false, photoURL: "" },
      { name: "STOCK PLATES & TO GO PLATES", completed: false, photoURL: "" },
      { name: "CLEAN DISH PIT", completed: false, photoURL: "" },
      { name: "BRICK GRILL", completed: false, photoURL: "" },
      { name: "TRASH", completed: false, photoURL: "" }
    ],
    date: today
  };

  // Save checklist data to Firestore
  await setDoc(doc(db, 'dailyChecklist', `cook_${today}`), checklistData);
  console.log('Cook daily checklist added successfully.');
};

// Call the function to add the checklist
addCooksDailyChecklist();
