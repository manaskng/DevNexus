# DevNexus- 
**The Ultimate Productivity Workspace for Developers.**
**Live:https://devnexus-app.vercel.app**
DevNexus unifies the fragmented workflow of modern software engineers. It combines code snippet management, Kanban-style task tracking, rich-text note-taking, and dynamic developer portfolios into a single, cohesive ecosystem.
---

## 🚀 Live Demo & Walkthrough
### 🌐 Deployment
| Component | URL | Status |
| :--- | :--- | :--- |
| **Frontend** | [devnexus-app.vercel.app](https://devnexus-app.vercel.app) | ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel) |
| **Backend API** | [devnexus-api.onrender.com](https://devnexus-api.onrender.com) | ![Render](https://img.shields.io/badge/Render-Active-46E3B7?logo=render&logoColor=white) |

---
### Youtube  Video workflow Live:
*Watch the full workflow demo:*
[![DevNexus Video Walkthrough](https://img.youtube.com/vi/EKsHeZQpwYA/maxresdefault.jpg)](https://youtu.be/EKsHeZQpwYA)
> **[▶️ Click here to watch the full video on YouTube](https://youtu.be/EKsHeZQpwYA)**
![DevNexus_gif](https://github.com/user-attachments/assets/cf0da425-dae3-449b-b988-143cb4cbaf6a)


## 🛠 Tech Stack

| Frontend          | Backend           | Database        | Authentication | Deployment & DevOps      |
| ----------------- | ----------------- | --------------- | -------------- | ------------------------ |
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) | ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white) | ![Vercel](https://img.shields.io/badge/-Vercel-black?logo=vercel&logoColor=white) |
| ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) | ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white) |                 | ![Nodemailer](https://img.shields.io/badge/-Nodemailer-44a6d1) | ![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render&logoColor=white) |
| ![Framer](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white) |                   |                 | ![Bcrypt](https://img.shields.io/badge/-Bcrypt-blue)  | ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white) |

---

## 💎 Key Features

### 1.  Secure Authentication & Recovery
* **JWT Authentication:** Stateless session management with secure HTTP headers.
* **Reliable Recovery:** Production-grade password reset flow using **Brevo (SMTP)** for high deliverability.
* **Encryption:** Sensitive data hashed using `bcryptjs` before storage.
  <img width="1920" height="1080" alt="Screenshot (334)" src="https://github.com/user-attachments/assets/3196daba-1fe9-4095-9a5d-39fa1db6f375" />
  <img width="725" height="761" alt="Screenshot 2025-12-17 221108" src="https://github.com/user-attachments/assets/69588f0b-4cae-445b-b18c-f35b2fb12fb7" />
  <img width="683" height="633" alt="Screenshot 2025-12-17 221212" src="https://github.com/user-attachments/assets/fd300ea4-def1-4f46-8606-ba7501302ecd" />

### 2.  Code Vault (Snippet Library)
  <img width="1889" height="866" alt="Screenshot 2025-12-18 133358" src="https://github.com/user-attachments/assets/60d00622-619b-46cb-aed9-957f162d506e" />
* **Syntax Highlighting:** Store reusable algorithms with automatic language detection and PrismJS highlighting.
* **Smart Search:** Instantly filter snippets by tags (e.g., `#dp`, `#recursion`) or title.
  <img width="1895" height="902" alt="Screenshot 2026-01-04 214316" src="https://github.com/user-attachments/assets/20c45553-dd6d-48fb-8b6d-c60e473aa628" />


### 3.  Rich Text Notes
  <img width="1886" height="858" alt="Screenshot 2025-12-18 133341" src="https://github.com/user-attachments/assets/69363887-24ff-452a-9649-25322d08ace3" />
* **Advanced Editor:** Built on **TipTap**, supporting bold, italics, code blocks, lists, and links.
* **Dark Mode Native:** The editor uses `@tailwindcss/typography` to seamlessly adapt text styles between light and dark themes.
  <img width="1897" height="893" alt="Screenshot 2026-01-04 214451" src="https://github.com/user-attachments/assets/871ebb95-0a1a-4aeb-997b-8c1199233fdf" />
  <img width="456" height="329" alt="Screenshot 2025-12-18 132732" src="https://github.com/user-attachments/assets/80124a12-c21d-4877-83ce-72e441f3d382" />

 
### 4.  Task Command (Kanban)
* **Kanban Board:** A drag-and-drop interface for managing engineering tasks.
* **Visual States:** distinct visual indicators for *Todo*, *In-Progress*, and *Completed* items.
  <img width="1911" height="895" alt="Screenshot 2026-01-01 143152" src="https://github.com/user-attachments/assets/276a427b-df64-47f2-ae41-f9056fb5fb15" />
 
### 5.  Dynamic Career Profile
* **Live Stats Aggregation:** Automatically pulls and visualizes data from **GitHub** and **LeetCode** APIs.
* **Smart Portfolio:** Generates a public, shareable link (e.g., `/u/username`) that serves as a live resume for recruiters.
* **Auto-Asset Generation:** Uses OpenGraph to generate project cover images automatically from GitHub repository links.
<img width="1917" height="894" alt="Screenshot 2025-12-17 204527" src="https://github.com/user-attachments/assets/b1795180-5bf9-4182-89b7-9a7d4a6c1ac9" />
<img width="1918" height="826" alt="Screenshot 2026-01-01 143242" src="https://github.com/user-attachments/assets/954d0734-d2e7-4fe8-905f-a3167461c501" />
<img width="1919" height="817" alt="Screenshot 2026-01-01 143259" src="https://github.com/user-attachments/assets/8d8778da-0d37-4657-b845-5dd1099dda3c" />

---

##  APIs, Libraries & Integrations

DevNexus leverages a suite of powerful APIs and specialized libraries to deliver a seamless user experience:

### **External Data & Services**
* **[SkillIcons.dev](https://skillicons.dev):** Dynamically renders high-quality SVG icons for the "Tech Stack" section by normalizing user input (e.g., mapping "C++" to `cpp`).
* **[GitHub Open Graph API](https://opengraph.githubassets.com):** Automatically fetches social preview images from GitHub repositories to populate project cover images without user upload.
* **[GitHub Profile Summary Cards](https://github-profile-summary-cards.vercel.app):** Visualizes real-time GitHub activity, stars, and commits via a dark-mode optimized dashboard card.
* **[LeetCard API](https://leetcard.jacoblin.cool):** Fetches live LeetCode problem-solving statistics and global ranking for the career profile.
* **[Brevo (Sendinblue)](https://www.brevo.com):** Powers the secure, production-grade "Forgot Password" email delivery system via SMTP.

### **Core UI & Functionality**
* **[TipTap (ProseMirror)](https://tiptap.dev):** The engine behind the headless Rich Text Editor, providing a Notion-like writing experience with extensive formatting support.
* **[React Syntax Highlighter](https://github.com/react-syntax-highlighter):** Enables PrismJS-based syntax highlighting for the Code Snippet Library, supporting multiple languages.
* **[Framer Motion](https://www.framer.com/motion/):** Powers the complex animations, including the 3D project card lift effects, empty state transitions, and modal interactions.

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

##  API Endpoints

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
