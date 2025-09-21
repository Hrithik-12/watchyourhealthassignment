// config.js
// module.exports = {
//     fitness_01: {
//       sections: ["Vitals Summary"],
//       fields: {
//         "Health Score": "accuracy",
//         "Heart Rate": "vitals.heart_rate",
//         "Blood Pressure": ["vitals.bp_sys", "vitals.bp_dia"]
//       }
//     }
//   };
  

// module.exports = {
//     fitness_01: {
//       sections: ["Vitals Summary"],
//       fields: {
//         "Health Score": "accuracy",
//         "Heart Rate": "vitals.heart_rate",
//         "Blood Pressure": ["vitals.bp_sys", "vitals.bp_dia"]
//       }
//     },
//     cardiac_01: {
//       sections: ["Heart Health"],
//       fields: {
//         "Overall Score": "accuracy",
//         "Resting Heart Rate": "vitals.heart_rate",
//         "BP (Sys/Dia)": ["vitals.bp_sys", "vitals.bp_dia"]
//       }
//     }
//   };
  

// config.js
// module.exports = {
//     fitness_01: {
//       sections: ["Vitals Summary"],
//       fields: {
//         "Health Score": { path: "accuracy", classify: "score" },
//         "Heart Rate": { path: "vitals.heart_rate", classify: "heartRate" },
//         "Blood Pressure": {
//           path: ["vitals.bp_sys", "vitals.bp_dia"],
//           classify: "bp"
//         }
//       }
//     },
//     cardiac_01: {
//       sections: ["Heart Health"],
//       fields: {
//         "Overall Score": { path: "accuracy", classify: "score" },
//         "Resting Heart Rate": { path: "vitals.heart_rate", classify: "heartRate" },
//         "BP (Sys/Dia)": {
//           path: ["vitals.bp_sys", "vitals.bp_dia"],
//           classify: "bp"
//         }
//       }
//     }
//   };
  
  // New classification rules
  // module.exports.classifications = {
  //   score: value => (value >= 80 ? "Excellent" : value >= 60 ? "Good" : "Poor"),
  //   heartRate: value => (value < 60 ? "Low" : value <= 100 ? "Normal" : "High"),
  //   bp: ([sys, dia]) => {
  //     if (sys < 120 && dia < 80) return "Normal";
  //     if (sys <= 139 || dia <= 89) return "Prehypertension";
  //     return "Hypertension";
  //   }
  // };
  

  // config.js - Assessment Configuration System
module.exports = {
  // Health & Fitness Assessment (as_hr_02)
  as_hr_02: {
    sections: ["Key Body Vitals", "Heart Health", "Stress Level", "Fitness Levels", "Posture", "Body Composition"],
    fields: {
      "Overall Health Score": { path: "accuracy", classify: "score" },
      "Heart Rate": { path: "vitalsMap.vitals.heart_rate", classify: "heartRate" },
      "Blood Pressure Systolic": { path: "vitalsMap.vitals.bp_sys", classify: "bpSys" },
      "Blood Pressure Diastolic": { path: "vitalsMap.vitals.bp_dia", classify: "bpDia" },
      "BMI": { path: "bodyCompositionData.BMI", classify: "bmi" },
      "Cardiovascular Endurance": { path: "exercises.2.setList.0.time", classify: "endurance" }
    }
  },

  // Cardiac Assessment (as_card_01) 
  as_card_01: {
    sections: ["Key Body Vitals", "Cardiovascular Endurance", "Body Composition"],
    fields: {
      "Overall Score": { path: "accuracy", classify: "score" },
      "Heart Rate": { path: "vitalsMap.vitals.heart_rate", classify: "heartRate" },
      "Blood Pressure Systolic": { path: "vitalsMap.vitals.bp_sys", classify: "bpSys" },
      "Blood Pressure Diastolic": { path: "vitalsMap.vitals.bp_dia", classify: "bpDia" },
      "BMI": { path: "bodyCompositionData.BMI", classify: "bmi" },
      "Cardiovascular Endurance": { path: "exercises.2.setList.0.time", classify: "endurance" }
    }
  }
};

// Classification Rules
module.exports.classifications = {
  score: (value) => {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Fair";
    return "Poor";
  },

  heartRate: (value) => {
    if (value < 60) return "Low";
    if (value <= 100) return "Normal";
    return "High";
  },

  bpSys: (value) => {
    if (value < 120) return "Normal";
    if (value <= 139) return "Prehypertension";
    return "Hypertension";
  },

  bpDia: (value) => {
    if (value < 80) return "Normal";
    if (value <= 89) return "Prehypertension";
    return "Hypertension";
  },

  bmi: (value) => {
    const numValue = parseFloat(value);
    if (numValue < 18.5) return "Underweight";
    if (numValue < 25) return "Normal";
    if (numValue < 30) return "Overweight";
    return "Obese";
  },

  endurance: (value) => {
    if (value >= 60) return "Excellent";
    if (value >= 45) return "Good";
    if (value >= 30) return "Fair";
    return "Poor";
  }
};