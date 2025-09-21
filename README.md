# 🏥 Assessment Management System

A comprehensive health and fitness assessment platform that provides AI-powered analysis, detailed reporting, and user authentication for tracking individual health metrics and generating professional PDF reports.

## 🌟 Overview

The Assessment Management System is designed to evaluate and track various health parameters including cardiovascular health, body composition, fitness levels, and posture analysis. The system combines real-time data processing with intelligent classification to provide actionable health insights.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Data Layer    │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (JSON Files)  │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Authentication│    │ • config.js     │
│ • Auth Forms    │    │ • Report Gen    │    │ • data.js       │
│ • User Mgmt     │    │ • API Routes    │    │ • user.js       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
assignment1/
├── backend/                    # Node.js Express Server
│   ├── config.js              # Assessment configurations & classifications
│   ├── data.js                # Sample assessment data
│   ├── auth.js                # JWT authentication & middleware
│   ├── user.js                # User management & password hashing
│   ├── report.js              # PDF report generation
│   ├── index.js               # Main server file
│   ├── template.html          # HTML template for reports
│   └── reports/               # Generated PDF reports
│       ├── report_session_001.pdf
│       └── report_session_002.pdf
├── frontend/                   # React Application
│   └── assessmentmanagementsystem/
│       ├── src/
│       │   ├── components/     # React components
│       │   │   ├── Auth.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   ├── LoginForm.jsx
│       │   │   └── RegisterForm.jsx
│       │   └── App.jsx
│       └── package.json
└── README.md
```

## 🔧 Core Components

### 1. **Configuration System (`config.js`)**

The heart of the assessment system that defines how different assessments are structured and evaluated.

#### **Assessment Types:**
- **`as_hr_02`** - Comprehensive Health & Fitness Assessment
- **`as_card_01`** - Cardiac Health Assessment

#### **Key Features:**
```javascript
// Example Assessment Configuration
as_hr_02: {
  sections: ["Key Body Vitals", "Heart Health", "Stress Level", "Fitness Levels", "Posture", "Body Composition"],
  fields: {
    "Overall Health Score": { path: "accuracy", classify: "score" },
    "Heart Rate": { path: "vitalsMap.vitals.heart_rate", classify: "heartRate" },
    "BMI": { path: "bodyCompositionData.BMI", classify: "bmi" }
  }
}
```

#### **Classification Rules:**
- **Score Classification**: Excellent (80+), Good (60+), Fair (40+), Poor (<40)
- **Heart Rate**: Low (<60), Normal (60-100), High (>100)
- **Blood Pressure**: Normal, Prehypertension, Hypertension
- **BMI**: Underweight (<18.5), Normal (18.5-25), Overweight (25-30), Obese (>30)
- **Endurance**: Based on cardiovascular performance metrics

### 2. **Data Management (`data.js`)**

Comprehensive assessment data storage containing:
- **Session Management**: Unique session IDs and timestamps
- **Vital Signs**: Heart rate, blood pressure, oxygen saturation
- **Body Composition**: BMI, body fat percentage, muscle mass
- **Exercise Data**: Performance metrics for various fitness tests
- **Advanced Analytics**: Stress levels, cardiovascular endurance, posture analysis

#### **Sample Data Structure:**
```javascript
{
  "session_id": "session_001",
  "assessment_id": "as_hr_02",
  "accuracy": 80,
  "vitalsMap": {
    "vitals": {
      "heart_rate": 75,
      "bp_sys": 124,
      "bp_dia": 82
    },
    "metadata": {
      "physiological_scores": {
        "bmi": "33.15",
        "bodyfat": "33.36",
        "vo2max": "79.83"
      }
    }
  }
}
```

### 3. **Authentication System (`auth.js`)**

Secure user authentication with JWT tokens:
- **User Registration**: Email validation, password hashing
- **User Login**: Credential verification with bcrypt
- **Token Management**: JWT with 24-hour expiration
- **Protected Routes**: Middleware for securing API endpoints

#### **API Endpoints:**
```
POST /auth/register    - User registration
POST /auth/login       - User authentication  
GET  /auth/profile     - Get user profile (protected)
```

### 4. **Report Generation (`report.js`)**

Advanced PDF report generation system:
- **Dynamic Data Extraction**: Configurable field mapping
- **Intelligent Classification**: Automatic health status evaluation
- **Professional Formatting**: HTML to PDF conversion using Puppeteer
- **Multi-format Support**: Text and HTML report generation

#### **Report Features:**
- Real-time data processing from assessment results
- Professional PDF formatting with company branding
- Comprehensive health metrics analysis
- Actionable recommendations based on classification rules

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd assignment1
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend/assessmentmanagementsystem
npm install
```

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm start
```
Server will run on `http://localhost:3000`

2. **Start the frontend development server:**
```bash
cd frontend/assessmentmanagementsystem
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register new user | None |
| POST | `/auth/login` | User login | None |
| GET | `/auth/profile` | Get user profile | Required |

### Report Generation Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/generate-report-download` | Generate PDF report | Required |
| POST | `/generate-report-preview` | Preview PDF report | Required |
| GET | `/health` | Health check | None |

### Example API Usage

#### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

#### Generate a report:
```bash
curl -X POST http://localhost:3000/generate-report-download \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "session_001"}'
```

## 📊 Assessment Types

### 1. Health & Fitness Assessment (`as_hr_02`)
**Comprehensive evaluation covering:**
- Key Body Vitals (Heart Rate, Blood Pressure)
- Heart Health Analysis
- Stress Level Assessment
- Fitness Performance Metrics
- Posture Analysis
- Body Composition Analysis

### 2. Cardiac Assessment (`as_card_01`)
**Focused cardiovascular evaluation:**
- Key Body Vitals
- Cardiovascular Endurance Testing
- Body Composition Metrics
- Cardiac Risk Assessment

## 🎯 Key Features

### 🔐 **Secure Authentication**
- JWT-based authentication system
- Password hashing with bcrypt
- Protected API endpoints
- Session management

### 📈 **Intelligent Data Processing**
- Dynamic field mapping from configuration
- Real-time health metric classification
- Automated risk assessment
- Performance trend analysis

### 📄 **Professional Reporting**
- Automated PDF generation
- Customizable report templates
- Multi-format output support
- Branded report styling

### 🔄 **Scalable Architecture**
- Modular configuration system
- Easy assessment type addition
- Flexible data structure
- RESTful API design

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Puppeteer** - PDF generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **ESLint** - Code linting

### Development Tools
- **Jest** - Testing framework
- **Git** - Version control

## 📋 Configuration Guide

### Adding New Assessment Types

1. **Update `config.js`:**
```javascript
new_assessment_type: {
  sections: ["Section 1", "Section 2"],
  fields: {
    "Field Name": { path: "data.path", classify: "classificationType" }
  }
}
```

2. **Add classification rules:**
```javascript
module.exports.classifications = {
  newClassification: (value) => {
    // Your classification logic
    return "Result";
  }
}
```

3. **Add sample data in `data.js`**

### Customizing Report Templates

Edit `template.html` to modify:
- Company branding
- Report styling
- Layout structure
- Color schemes

## 🔍 Data Flow

```
1. User Assessment → Data Collection
2. Data Processing → Classification Rules
3. Report Generation → PDF Creation
4. User Access → Authentication Required
5. Report Download → Secure Delivery
```

## 🚀 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real-time notifications
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Automated email reports
- [ ] Integration with health devices

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for better health management and assessment tracking.**
