# 🎓 Gate Pass Management System (Frontend + Firebase)

## 📌 Overview

The Gate Pass Management System is a web-based application designed to streamline the process of issuing and managing gate passes for students within a university campus. It ensures secure authentication, real-time data handling, and role-based access for students and warden and guard with QR based verification and automatic in and out time registration.

This project focuses on a **frontend-driven architecture** powered by **Firebase services** for backend operations such as authentication, database, and hosting.
Checkout the website: https://local-pass-18424.web.app/
---

## 🚀 Features

### 👨‍🎓 Student

* Secure login using Enrollment Number
* Request gate pass
* View pass status (Approved / Pending / Rejected)
* Track history of requests

### 🛠️ Admin

* Admin authentication
* View all student requests
* Approve / Reject gate passes
* Manage student data

---

## 🏗️ System Architecture

```
┌───────────────┐
│   Frontend    │ (React.js)
│ (UI + Logic)  │
└──────┬────────┘
       │
       ▼
┌────────────────────┐
│ Firebase Services  │
│--------------------│
│ • Authentication   │
│ • Firestore DB     │
│ • Hosting          │
└────────────────────┘
```

### 🔍 Architecture Explanation

* **Frontend (React.js)** handles UI rendering and client-side logic.
* **Firebase Authentication** manages login and user sessions.
* **Firestore Database** stores student, warden, and gate pass data.
* **Firebase Hosting** deploys the application.

---

## 🧩 Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React.js, Tailwind CSS            |
| Backend  | Firebase (No traditional backend) |
| Database | Firestore                         |
| Auth     | Firebase Authentication           |
| Hosting  | Firebase Hosting                  |

---

## 📂 Project Structure

```
GATE_PASS/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── firebase/          # Firebase config
│   ├── assets/            # Images & logos
│   └── App.jsx            # Main App
│
├── index.html
├── public/
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔐 Authentication Flow

1. First the User select its operation
2. Students enters enrollment
3. Firebase Authentication validates user
4. User role is verified from Firestore
5. Redirect based on role:

   * Student → Dashboard
   * warden → warden Panel
   * Guard → Guard Panel

---

## 🔄 Data Flow

### Gate Pass Request

1. Student submits request
2. Data stored in Firestore (`gatepasses` collection)
3. Warden fetches requests in real-time
4. warden updates status
5. Student sees updated status instantly

---

## 🎨 UI/UX Design Principles

* Minimal and clean interface
* Role-based dashboards
* Responsive design (mobile-friendly)
* Real-time updates using Firebase listeners


---

## 🔒 Security Considerations

* Firestore rules to restrict access based on roles
* Authentication required for all operations
* Warden-only write permissions for approvals

---

## 📈 Future Enhancements

* Email/SMS notifications
* Analytics dashboard (Power BI integration)

---

## 💡 Developed By

* Deepak Kumar Sharma
* Liannaka Dadi
