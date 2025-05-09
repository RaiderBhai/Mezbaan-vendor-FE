# 🧆 Mezbaan

**Mezbaan** is a full-featured event service management platform. It allows service providers to manage their listings, handle bookings, and support customer interactions with modern authentication and a sleek UI built with React and Bootstrap.

## 🚀 Features

* 🔐 **Google Authentication** (Firebase OAuth2)
* 🎨 **Modern UI** using Bootstrap, and styled-components
* 🧭 **Routing** with React Router DOM
* ☁️ **Backend Communication** with Axios
* 🌐 **Social Login** via Google
* 📱 **Responsive Design** with Bootstrap 5 & Bootstrap Icons
* 🔁 **Persistent State** using `react-persist`
* 📦 Built with **Vite** for lightning-fast development and production builds

## 🛠️ Tech Stack

| Category | Tech Used |
|----------|-----------|
| **Frontend** | React 18, Vite, React Router DOM |
| **UI Components** | Bootstrap components, Bootstrap Icons |
| **State Management** | Local state, `react-persist` |
| **Auth** | Firebase Auth, react-google-login |
| **HTTP Client** | Axios |
| **Icons** | React Icons, Bootstrap Icons |
| **Linting** | ESLint with React & Hooks plugins |
| **Dev Tools** | Nodemon (backend), Vite (frontend) |

## 🔧 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RaiderBhai/Mezbaan-vendor-FE.git
cd Mezbaan-vendor-FE
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory with the following:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Start Development Server

```bash
npm run dev
```

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Bootstrap](https://getbootstrap.com/)