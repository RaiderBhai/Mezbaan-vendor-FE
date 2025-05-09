import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import SignUp from './components/SignUp';
import LogIn from "./components/LogIn";
import Dashboard from "./components/dashboard";
import Services from "./components/Services";
import Bookings from "./components/Bookings";
import AddService from "./components/addPage";
import AddVenue from "./components/addVenue";
import AddPhotography from "./components/addPhotography";
import AddDecoration from "./components/addDecoration";
import AddCatering from "./components/addCatering";
import AddOther from "./components/addOther";
import VenueDetail from "./components/VenueDetail";
import DecorationDetail from "./components/DecorationDetail";
import PhotographyDetail from "./components/PhotographyDetail";
import CateringDetail from "./components/CateringDetail";
import OtherDetail from "./components/OtherDetail";
import VenueBookDetail from "./components/VenueBookDetail";
import PhotographyBookDetail from "./components/PhotographyBookDetail";
import DecorationBookDetail from "./components/DecorationBookDetail";
import OtherBookDetail from "./components/OtherBookDetail";
import CateringBookDetail from "./components/CateringBookDetail";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ServiceOrderProvider from "./store/ServiceOrderProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import BackgroundManager from "./components/backgroundManager";
import UserProfile from "./components/UserProfile";

function App() {
  const [successfulLogin, setSuccessfulLogin] = useState(null);
  const [currentPage, setPage] = useState("Dashboard");

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    const user = sessionStorage.getItem("user");
  
    if (authToken && user) {
      setSuccessfulLogin(true);
    } else {
      setSuccessfulLogin(false);
    }
  }, []);

  if (successfulLogin === null) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId = {process.env.VITE_GOOGLE_CLIENT_ID}>
      <ServiceOrderProvider>
        <Router>
          <BackgroundManager successfulLogin={successfulLogin} />
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn setSuccessfulLogin={setSuccessfulLogin} />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                successfulLogin ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/profile"
              element={
                successfulLogin ? <UserProfile /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/dashboard"
              element={
                successfulLogin ? (
                  <Dashboard
                  currentPage={currentPage}
                  setSuccessfulLogin={setSuccessfulLogin}
                  setPage={setPage}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/services"
              element={
                successfulLogin ? (
                  <Services 
                  currentPage={currentPage}
                  setPage={setPage}
                  setSuccessfulLogin={setSuccessfulLogin}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/addvenue"
              element={
                successfulLogin ? <AddVenue currentPage={currentPage}
                setPage={setPage} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/addphotography"
              element={
                successfulLogin ? <AddPhotography currentPage={currentPage}
                setPage={setPage} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/adddecoration"
              element={
                successfulLogin ? <AddDecoration currentPage={currentPage}
                setPage={setPage} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/addcatering"
              element={
                successfulLogin ? <AddCatering currentPage={currentPage}
                setPage={setPage} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/addother"
              element={
                successfulLogin ? <AddOther currentPage={currentPage}
                setPage={setPage} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/addpage"
              element={
                successfulLogin ? <AddService currentPage={currentPage}
                setPage={setPage} setSuccessfulLogin={setSuccessfulLogin} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/venue"
              element={
                successfulLogin ? <VenueDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/decoration"
              element={
                successfulLogin ? <DecorationDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/photography"
              element={
                successfulLogin ? <PhotographyDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/catering"
              element={
                successfulLogin ? <CateringDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/other"
              element={
                successfulLogin ? <OtherDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/venueBook"
              element={
                successfulLogin ? <VenueBookDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/decorationBook"
              element={
                successfulLogin ? <DecorationBookDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/photographyBook"
              element={
                successfulLogin ? <PhotographyBookDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/cateringBook"
              element={
                successfulLogin ? <CateringBookDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/otherBook"
              element={
                successfulLogin ? <OtherBookDetail /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/bookings"
              element={
                successfulLogin ? <Bookings currentPage={currentPage}
                setPage={setPage} setSuccessfulLogin={setSuccessfulLogin} /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </Router>
      </ServiceOrderProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
