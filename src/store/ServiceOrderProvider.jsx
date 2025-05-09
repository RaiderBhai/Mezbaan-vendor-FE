import { createContext, useReducer, useState, useEffect } from "react";
import axios from 'axios';

export const AppContext = createContext({
  services: [],
  bookings: [],
  loading: false,
  loadingBookings: false,
  addService: () => {},
  deleteService: () => {},
  fetchServices: () => {},
  fetchBookings: () => {},
});

const appReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };
      case "LOADING_BOOKINGS": 
      return {
        ...state,
        loadingBookings: true,
      };
    case "SET_SERVICES":
      return {
        ...state,
        services: action.payload,
        loading: false,
      };
    case "ADD_SERVICE":
      return {
        ...state,
        services: [...state.services, action.payload],
      };
    case "DELETE_SERVICE":
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
      };
    case "SET_BOOKINGS":
      return {
        ...state,
        bookings: action.payload,
        loadingBookings: false,
      };
    case "RESET":
      return {
        services: [],
        bookings: [],
        loading: false,
        loadingBookings: false,
      };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    services: [],
    bookings: [],
    loading: false,
    loadingBookings: false,
  });

  const fetchServices = async () => {
    const token = sessionStorage.getItem("authToken");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user?.id || "-";

    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    dispatch({ type: "RESET" });
    dispatch({ type: "LOADING" });

    try {
      const response = await axios.get(`https://mezbaan-db.vercel.app/users/${userId}/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: "SET_SERVICES", payload: response.data.services });
    } catch (error) {
      console.error("Error fetching services:", error);
      dispatch({ type: "LOADING" }); // Reset loading state in case of error
    }
  };
  const fetchBookings = async (vendorId) => {
    const token = sessionStorage.getItem("authToken");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user?.id || "-";

    if (!token) {
      console.error("No token found in session storage");
      return;
    }

    dispatch({ type: "LOADING_BOOKINGS" });  // Set loading for bookings

    try {
      const response = await axios.get(`https://mezbaan-db.vercel.app/vendors/${userId}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: "SET_BOOKINGS", payload: response.data.bookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      dispatch({ type: "LOADING_BOOKINGS" }); // Reset loading state in case of error
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchServices();
      fetchBookings();
    }
  }, []);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const addService = (service) => {
    dispatch({ type: "ADD_SERVICE", payload: service });
  };

  const deleteService = (serviceId) => {
    setServiceToDelete(serviceId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      dispatch({ type: "DELETE_SERVICE", payload: serviceToDelete });
    }
    setShowDeleteConfirmation(false);
    setServiceToDelete(null);
  };

  return (
    <AppContext.Provider
      value={{
        services: state.services,
        bookings: state.bookings,
        loading: state.loading,
        loadingBookings: state.loadingBookings,
        addService,
        deleteService,
        fetchServices,
        fetchBookings,
        dispatch,
      }}
    >
      {children}
      {showDeleteConfirmation && (
        <div
          className="alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x w-50"
          role="alert"
        >
          <strong>Warning!</strong> Are you sure you want to delete this service?
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-danger me-2"
              onClick={() => handleDeleteConfirmation(true)}
            >
              Yes, delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleDeleteConfirmation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export default AppProvider;
