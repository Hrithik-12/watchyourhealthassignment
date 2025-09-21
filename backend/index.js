// const express = require("express");
// // const bodyParser = require("body-parser");
// const { generatePdfReport } = require("./report"); // reuse your logic

// const app = express();
// app.use(express.json());

// // API endpoint


// app.post("/generate-report-download", async (req, res) => {
//     try {
//       const { session_id } = req.body;
//       console.log("Incoming request for session:", session_id);
  
//       const filePath = await generatePdfReport(session_id);
//       console.log("Generated file path:", filePath);
  
//       res.json({ success: true, file: filePath });
//     } catch (err) {
//       console.error("Error in generate-report:", err);
//       res.status(500).json({ success: false, message: "Error generating report" });
//     }
//   }); 

// app.post("/generate-report-preview", async (req, res) => {
//     try {
//       const { session_id } = req.body;
//       console.log("Incoming request for session:", session_id);
  
//       const filePath = await generatePdfReport(session_id);
  
//       res.download(filePath, `report_${session_id}.pdf`, (err) => {
//         if (err) {
//           console.error("Error sending PDF:", err);
//           res.status(500).json({ success: false, message: "Error sending PDF" });
//         }
//       });
//     } catch (err) {
//       console.error("Error in generate-report:", err);
//       res.status(500).json({ success: false, message: "Error generating report" });
//     }
//   });  
  
  

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });


const express = require("express");
const cors = require("cors"); // Add this for React frontend
const { generatePdfReport } = require("./report");
const { router: authRouter, authenticateToken } = require("./auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for React frontend

// Authentication routes
app.use('/auth', authRouter);

// Protected report generation endpoints
app.post("/generate-report-download", authenticateToken, async (req, res) => {
  try {
    const { session_id } = req.body;
    console.log("Incoming request for session:", session_id);
    console.log("User:", req.user); // Now we have user info

    const filePath = await generatePdfReport(session_id);
    console.log("Generated file path:", filePath);

    res.json({ success: true, file: filePath });
  } catch (err) {
    console.error("Error in generate-report:", err);
    res.status(500).json({ success: false, message: "Error generating report" });
  }
});

app.post("/generate-report-preview", authenticateToken, async (req, res) => {
  try {
    const { session_id } = req.body;
    console.log("Incoming request for session:", session_id);
    console.log("User:", req.user);

    const filePath = await generatePdfReport(session_id);

    res.download(filePath, `report_${session_id}.pdf`, (err) => {
      if (err) {
        console.error("Error sending PDF:", err);
        res.status(500).json({ success: false, message: "Error sending PDF" });
      }
    });
  } catch (err) {
    console.error("Error in generate-report:", err);
    res.status(500).json({ success: false, message: "Error generating report" });
  }
});

// Public health check endpoint
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Test endpoint to check if auth is working (remove in production)
app.get("/protected-test", authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: "Protected route accessed successfully",
    user: req.user 
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Auth endpoints:");
  console.log("- POST /auth/register");
  console.log("- POST /auth/login");
  console.log("- GET /auth/profile");
});