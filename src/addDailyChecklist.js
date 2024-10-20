import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path according to your project

// Function to add the default daily checklist for servers
const addDailyChecklist = async () => {
  const today = new Date().toISOString().split('T')[0];

  const checklistData = {
    role: 'server',
    tasks: [
      { name: "STOCK CONDIMENTS STAND & JELLY CADDIES", completed: false, signature: "" },
      { name: "STOCK TOGO CUPS/LIDS/BAGS/ETC", completed: false, signature: "" },
      { name: "CLEAN & REFILL SYRUPS", completed: false, signature: "" },
      { name: "DISHES – CLEAN DISHPIT & PUT AWAY ALL DISHES***", completed: false, signature: "" },
      { name: "BAG ALL SILVERWARE***", completed: false, signature: "" },
      { name: "CUT LEMONS – ATLEAST ½ BAIN", completed: false, signature: "" },
      { name: "DETAIL & CLEAN COFFEE POTS & STAND", completed: false, signature: "" },
      { name: "REMOVE & SOAK BOTH TEA URNS", completed: false, signature: "" },
      { name: "REFILL ICE BIN", completed: false, signature: "" },
      { name: "WIPE ALL TABLES, FILL NAPKINS, SUGAR CADDIES", completed: false, signature: "" },
      { name: "SWEEP & MOP FRONT HOUSE***", completed: false, signature: "" },
      { name: "EMPTY ALL TRASH CANS", completed: false, signature: "" }
    ],
    date: today
  };

  // Save checklist data to Firestore
  await setDoc(doc(db, 'dailyChecklist', `server_${today}`), checklistData);
  console.log('Daily checklist added successfully.');
};

// Call the function to add the checklist
//addDailyChecklist();
