# Expense Tracker – React + Node (JSON Storage)

A simple, full-stack **Expense Tracker web application** built using **React (Vite)** for the frontend and **Node.js + Express** for the backend.
The application stores data in a **JSON file** instead of a database, making it lightweight, easy to understand, and ideal for learning and portfolio use.

---

## 🔹 Features

* Add, edit, and delete expenses
* Persist data in a JSON file (no database)
* REST API backend using Express
* React frontend with clean component structure
* Ready for deployment
* Easy to extend (charts, filters, export, auth)

---

## 🔹 Tech Stack

### Frontend

* React (Vite)
* JavaScript (ES6+)
* Axios
* CSS / basic styling

### Backend

* Node.js
* Express.js
* File-based storage using JSON
* UUID generation using Node `crypto`

### Tooling

* Git & GitHub
* Nodemon (dev)
* PowerShell / Terminal

---

## 🔹 Project Structure

```
expense-tracker/
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── data/
│   │   └── expenses.json   # JSON storage (acts as DB)
│   ├── index.js            # Express server
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔹 How It Works

* The **React frontend** sends HTTP requests to the backend
* The **Express server** reads/writes expense data from `expenses.json`
* Each expense has:

  * `id`
  * `date`
  * `amount`
  * `category`
  * `note`

This approach avoids database complexity while keeping real-world API flow intact.

---

## 🔹 Getting Started (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker
```

---

### 2️⃣ Backend setup

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```
http://localhost:4000
```

Test:

```
GET http://localhost:4000/api/health
```

---

### 3️⃣ Frontend setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔹 API Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/expenses`     | Get all expenses  |
| POST   | `/api/expenses`     | Add a new expense |
| PUT    | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET    | `/api/health`       | Health check      |

---

## 🔹 Environment Variables (Frontend)

Create a `.env` file inside `client/`:

```
VITE_API_BASE_URL=http://localhost:4000
```

For production, point this to the deployed backend URL.

---

## 🔹 Deployment

### Frontend

* Deploy to **Vercel** or **Netlify**
* Build command:

```bash
npm run build
```

* Output directory:

```
dist
```

### Backend

* Deploy to **Render**, **Railway**, or VPS
* Note: JSON file storage may reset on redeploy unless persistent storage is enabled

---

## 🔹 Limitations

* JSON file storage is not suitable for high-traffic production apps
* No authentication
* No multi-user support

(These are intentional trade-offs for simplicity and learning.)

---

## 🔹 Future Enhancements

* Monthly & category charts
* Filters and search
* Export to CSV
* Authentication
* Database integration (MongoDB / PostgreSQL)

---

## 🔹 Author

**Kaushal**
Full-Stack Developer
📍 New Zealand

---

## 🔹 License

This project is licensed under the **MIT License**.

---

