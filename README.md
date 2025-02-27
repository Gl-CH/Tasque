# Tasque - Task Manager PWA

## Overview
Tasque is a **Progressive Web App (PWA)** designed for managing tasks efficiently with user authentication and login functionality. It provides a seamless experience across desktop and mobile devices while ensuring data security and user-friendly interactions.

## Screenshots

### Home Page
![Home Screenshot 1](Screenshots/Home%20-%20Google%20Chrome%202_27_2025%207_57_24%20AM.png)
![Home Screenshot 2](Screenshots/Home%20-%20Google%20Chrome%202_27_2025%207_57_37%20AM.png)
![Home Screenshot 3](Screenshots/Home%20-%20Google%20Chrome%202_27_2025%207_57_55%20AM.png)

### Task Management Interface
![Tasks Screenshot](Screenshots/Tasks%20-%20Google%20Chrome%202_24_2025%208_33_38%20PM.png)

### Sign-In Page
![Sign In Screenshot](Screenshots/Sign%20In%20-%20Google%20Chrome%202_25_2025%208_55_13%20PM.png)




## Features
- ✅ **User Authentication** (Signup, Login, Logout)
- ✅ **Task Management** (Create, Edit, Delete, Mark as Done)
- ✅ **Progressive Web App (PWA) Support** (Installable on devices)
- ✅ **Responsive UI** (Works on mobile & desktop)
- ✅ **Offline Support** (Tasks can be managed without an internet connection)
- ✅ **Data Persistence** (Syncs with backend when online)
- ✅ **Dark Mode Support**

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Django
- **Database:** SQLite / PostgreSQL
- **Authentication:** Django Authentication
- **PWA Implementation:** Service Workers, Web App Manifest

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Python 3.x
- Django
- Node.js (for PWA optimizations, if needed)

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/tasque.git
   cd tasque
   ```

2. **Create a virtual environment & install dependencies:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Apply migrations & run server:**
   ```sh
   python manage.py migrate
   python manage.py runserver
   ```

4. **Access the app:**
   Open `http://127.0.0.1:8000/` in your browser.

5. **Enable PWA features:**
   - Ensure service workers are registered
   - Add the app to the home screen for an enhanced experience

## Usage
1. **Sign up/Login** to create an account.
2. **Create tasks** and manage them using the dashboard.
3. **Install the PWA** for offline access.

## Future Enhancements
- 🔹 Task prioritization & categorization
- 🔹 Push notifications for reminders
- 🔹 Multi-user collaboration
- 🔹 API for third-party integrations

## License
MIT License


