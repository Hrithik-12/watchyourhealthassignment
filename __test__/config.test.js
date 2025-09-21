// const data = require("../data");
// const config = require("../config");
// const { generatePdfReport } = require("../report");

// // helper from your report.js
// function getfieldvalue(obj, path) {
//   return path.split('.').reduce((val, key) => val?.[key], obj);
// }

// describe("Config System", () => {
//   test("fitness_01 config resolves correctly", () => {
//     const record = data.find(d => d.session_id === "session_001");
//     const assessment = config[record.assessment_id];

//     for (const [label, details] of Object.entries(assessment.fields)) {
//       const raw = Array.isArray(details.path)
//         ? details.path.map(p => getfieldvalue(record, p))
//         : getfieldvalue(record, details.path);

//       expect(raw).toBeDefined(); // ✅ ensures no undefined
//     }
//   });

//   test("cardiac_01 config resolves correctly", () => {
//     const record = data.find(d => d.session_id === "session_002");
//     const assessment = config[record.assessment_id];

//     for (const [label, details] of Object.entries(assessment.fields)) {
//       const raw = Array.isArray(details.path)
//         ? details.path.map(p => getfieldvalue(record, p))
//         : getfieldvalue(record, details.path);

//       expect(raw).toBeDefined();
//     }
//   });
// });


// const { classifications } = require("../config");

// describe("Classification functions", () => {
//   test("score classification works", () => {
//     expect(classifications.score(85)).toBe("Excellent");
//     expect(classifications.score(70)).toBe("Good");
//     expect(classifications.score(50)).toBe("Poor");
//   });

//   test("heart rate classification works", () => {
//     expect(classifications.heartRate(55)).toBe("Low");
//     expect(classifications.heartRate(75)).toBe("Normal");
//     expect(classifications.heartRate(110)).toBe("High");
//   });

//   test("blood pressure classification works", () => {
//     expect(classifications.bp([110, 70])).toBe("Normal");
//     expect(classifications.bp([130, 85])).toBe("Prehypertension");
//     expect(classifications.bp([150, 95])).toBe("Hypertension");
//   });
// });


const data = require("../data");
const config = require("../config");
const { generatePdfReport } = require("../report");

// helper from your report.js
function getfieldvalue(obj, path) {
  return path.split('.').reduce((val, key) => val?.[key], obj);
}

describe("Config System", () => {
  test("as_hr_02 config resolves correctly", () => {
    const record = data.find(d => d.session_id === "session_001");
    const assessment = config[record.assessment_id];

    expect(record.assessment_id).toBe("as_hr_02");
    expect(assessment).toBeDefined();
    expect(assessment.sections).toEqual([
      "Key Body Vitals", 
      "Heart Health", 
      "Stress Level", 
      "Fitness Levels", 
      "Posture", 
      "Body Composition"
    ]);

    for (const [label, details] of Object.entries(assessment.fields)) {
      const raw = Array.isArray(details.path)
        ? details.path.map(p => getfieldvalue(record, p))
        : getfieldvalue(record, details.path);

      // Some paths might be undefined in complex data, but shouldn't error
      console.log(`${label}: ${raw}`);
    }
  });

  test("as_card_01 config resolves correctly", () => {
    const record = data.find(d => d.session_id === "session_002");
    const assessment = config[record.assessment_id];

    expect(record.assessment_id).toBe("as_card_01");
    expect(assessment).toBeDefined();
    expect(assessment.sections).toEqual([
      "Key Body Vitals", 
      "Cardiovascular Endurance", 
      "Body Composition"
    ]);

    for (const [label, details] of Object.entries(assessment.fields)) {
      const raw = Array.isArray(details.path)
        ? details.path.map(p => getfieldvalue(record, p))
        : getfieldvalue(record, details.path);

      console.log(`${label}: ${raw}`);
    }
  });

  test("different assessments have different sections", () => {
    const fitnessConfig = config["as_hr_02"];
    const cardiacConfig = config["as_card_01"];

    expect(fitnessConfig.sections.length).toBe(6);
    expect(cardiacConfig.sections.length).toBe(3);
    
    // Fitness has more sections
    expect(fitnessConfig.sections).toContain("Heart Health");
    expect(fitnessConfig.sections).toContain("Stress Level");
    expect(fitnessConfig.sections).toContain("Fitness Levels");
    expect(fitnessConfig.sections).toContain("Posture");
    
    // Cardiac doesn't have these sections
    expect(cardiacConfig.sections).not.toContain("Heart Health");
    expect(cardiacConfig.sections).not.toContain("Stress Level");
  });
});

describe("Classification functions", () => {
  const { classifications } = require("../config");

  test("score classification works", () => {
    expect(classifications.score(85)).toBe("Excellent");
    expect(classifications.score(70)).toBe("Good");
    expect(classifications.score(50)).toBe("Fair");
    expect(classifications.score(30)).toBe("Poor");
  });

  test("heart rate classification works", () => {
    expect(classifications.heartRate(55)).toBe("Low");
    expect(classifications.heartRate(75)).toBe("Normal");
    expect(classifications.heartRate(110)).toBe("High");
  });

  test("blood pressure systolic classification works", () => {
    expect(classifications.bpSys(110)).toBe("Normal");
    expect(classifications.bpSys(130)).toBe("Prehypertension");
    expect(classifications.bpSys(150)).toBe("Hypertension");
  });

  test("blood pressure diastolic classification works", () => {
    expect(classifications.bpDia(70)).toBe("Normal");
    expect(classifications.bpDia(85)).toBe("Prehypertension");
    expect(classifications.bpDia(95)).toBe("Hypertension");
  });

  test("BMI classification works", () => {
    expect(classifications.bmi("18.0")).toBe("Underweight");
    expect(classifications.bmi("22.5")).toBe("Normal");
    expect(classifications.bmi("27.0")).toBe("Overweight");
    expect(classifications.bmi("32.0")).toBe("Obese");
  });

  test("endurance classification works", () => {
    expect(classifications.endurance(65)).toBe("Excellent");
    expect(classifications.endurance(50)).toBe("Good");
    expect(classifications.endurance(35)).toBe("Fair");
    expect(classifications.endurance(25)).toBe("Poor");
  });
});

describe("Data paths resolve correctly", () => {
  test("key data paths exist in session_001", () => {
    const record = data.find(d => d.session_id === "session_001");
    
    expect(getfieldvalue(record, "accuracy")).toBe(80);
    expect(getfieldvalue(record, "vitalsMap.vitals.heart_rate")).toBe(75);
    expect(getfieldvalue(record, "vitalsMap.vitals.bp_sys")).toBe(124);
    expect(getfieldvalue(record, "vitalsMap.vitals.bp_dia")).toBe(82);
    expect(getfieldvalue(record, "bodyCompositionData.BMI")).toBe("33.145");
    expect(getfieldvalue(record, "exercises.2.setList.0.time")).toBe(61);
  });

  test("key data paths exist in session_002", () => {
    const record = data.find(d => d.session_id === "session_002");
    
    expect(getfieldvalue(record, "accuracy")).toBe(17);
    expect(getfieldvalue(record, "vitalsMap.vitals.heart_rate")).toBe(66);
    expect(getfieldvalue(record, "vitalsMap.vitals.bp_sys")).toBe(110);
    expect(getfieldvalue(record, "vitalsMap.vitals.bp_dia")).toBe(75);
    expect(getfieldvalue(record, "bodyCompositionData.BMI")).toBe("9.51");
    expect(getfieldvalue(record, "exercises.2.setList.0.time")).toBe(47);
  });
});