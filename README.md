# DevNexus 
**The Ultimate Productivity Workspace for Developers.**
DevNexus unifies the fragmented workflow of modern software engineers. It combines code snippet management, Kanban-style task tracking, rich-text note-taking, and dynamic developer portfolios into a single, cohesive ecosystem.
---

##  Live Demo

* **Frontend:** [https://devnexus.vercel.app](https://www.google.com/search?q=https://devnexus.vercel.app) *(Update with your actual link)*
* **Backend API:** [https://devnexus-api.onrender.com](https://www.google.com/search?q=https://devnexus-api.onrender.com) *(Update with your actual link)*

---

##  Tech Stack

| Frontend          | Backend           | Database        | Authentication | Deployment & DevOps      |
| ----------------- | ----------------- | --------------- | -------------- | ------------------------ |
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) | ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white) | ![Vercel](https://img.shields.io/badge/-Vercel-black?logo=vercel&logoColor=white) |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) | ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white) |                   | ![Nodemailer](https://img.shields.io/badge/-Nodemailer-44a6d1) | ![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render&logoColor=white) |
|                   |                   |                   | ![Bcrypt](https://img.shields.io/badge/-Bcrypt-blue)  | ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white) |


---

##  Key Features

### 1.  Secure Authentication & Recovery

* **JWT Authentication:** Stateless, secure session management.
* **Password Reset Flow:** Production-grade "Forgot Password" system using **Brevo (SMTP)** to send secure, time-sensitive reset links.
* **Encryption:** Passwords hashed with `bcryptjs`.

### 2.  Code Vault (Snippet Library)

* **Syntax Highlighting:** Store algorithms and patterns with multi-language support.
* **Search & Tagging:** Instantly retrieve code using a robust filtering system.

### 3.  Rich Text Notes

* **Advanced Editor:** Built with **Tiptap**, supporting bold, italics, code blocks, and lists.
* **Dark Mode Optimized:** Editor styles automatically adapt to the global theme using `@tailwindcss/typography`.

### 4.  Task Command (Kanban)

* **Kanban Board:** Drag-and-drop interface for engineering tasks.
* **Status Tracking:** Visual indicators for Todo, In-Progress, and Completed items.

### 5.  Dynamic Career Profile

* **Live Stats:** Integrates **GitHub REST API** and **LeetCode API** to fetch real-time contribution data.
* **Resume Builder:** Auto-generates a shareable portfolio page based on your saved projects and skills.

---

##  Local Setup and Installation

Follow these steps to run the complete DevNexus ecosystem locally.

### 1. Clone the Repository

```bash
git clone https://github.com/manasraj/DevNexus.git
cd DevNexus

```

### 2. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_email@gmail.com
# Frontend URL for Redirects
CLIENT_URL=http://localhost:5173

```

Start the Server:

```bash
npm run dev

```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:3000

```

Start the Client:

```bash
npm run dev

```

---

## 🐳 Docker Support

DevNexus is fully dockerized. You can spin up the entire stack (Frontend + Backend + MongoDB) with a single command.

```bash
docker-compose up --build

```

---

## 📝 API Endpoints

The backend exposes a robust REST API. Here are examples of the primary routes:

### Authentication

**POST** `/api/users/login`

```json
// Response
{
  "id": "65f2...",
  "username": "manas",
  "email": "manas@example.com",
  "token": "eyJhbGciOiJIUzI1Ni..."
}

```

### Code Snippets

**GET** `/api/snippets`

```json
[
  {
    "_id": "65f2...",
    "title": "Binary Search Template",
    "language": "C++",
    "code": "int binarySearch(vector<int>& nums, int target) { ... }",
    "tags": ["algorithm", "search"]
  }
]

```

### Tasks

**POST** `/api/tasks`

```json
// Request Body
{
  "content": "Refactor Authentication Middleware",
  "isCompleted": false
}

```

| Module | Method | Endpoint | Description |
| --- | --- | --- | --- |
| **Auth** | POST | `/api/users/register` | Register a new user |
|  | POST | `/api/users/forgot-password` | Send reset email via Brevo |
|  | POST | `/api/users/reset-password/:token` | Set new password |
| **Notes** | GET | `/api/notes` | Fetch all user notes |
|  | POST | `/api/notes` | Create rich-text note |
| **Snippets** | POST | `/api/snippets` | Save new code snippet |
| **Tasks** | PUT | `/api/tasks/:id` | Update task status |
| **Profile** | GET | `/api/user-profile` | Fetch public profile data |

---

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Contact
**Manas Raj** - Full Stack Developer & Competitive Programmer

* **GitHub:** github.com/manaskng
* **Email:** manasraj850@gmail.com

© 2025 DevNexus. All rights reserved.
