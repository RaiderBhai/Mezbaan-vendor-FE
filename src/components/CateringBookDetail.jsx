import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const CateringBookDetail = () => {
  const { state } = useLocation();
  const { id, type } = state || {};
  const [cateringData, setCateringData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (id) {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        console.error("No token found, please login first.");
        return;
      }

      fetch(`https://mezbaan-db.vercel.app/bookings/${type}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unauthorized");
          }
          return response.json();
        })
        .then((data) => setCateringData(data))
        .catch((error) =>
          console.error("Error fetching Catering data:", error)
        );
    }
  }, [id, type, refreshKey]);

  const handleStatusChange = async (newStatus) => {
    const confirmation = window.confirm(
      `Are you sure you want to ${
        newStatus === "approve" ? "accept" : "reject"
      } this booking?`
    );
    if (!confirmation) return;

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.error("No token found, please login first.");
      return;
    }

    const url = `https://mezbaan-db.vercel.app/bookings/${id}/${newStatus}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${newStatus} booking`);
      }
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error(`Error during ${newStatus} operation:`, error);
    }
  };

  if (!id) return <div className="text-center text-danger mt-4">Invalid ID</div>;
  if (!cateringData)
    return <div className="text-center text-primary mt-4">Loading...</div>;

  const { booking, cateringBooking, bookedMenuItems, bookedPackages, customer, cateringService } = cateringData;

  // Group menu items by type
  const groupedMenuItems = bookedMenuItems.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="card-header bg-dark text-white text-center">
          <h2>{cateringService.name}</h2>
        </div>
        <div className="card-body">
          {/* Booking Information */}
          <h5 className="card-title text-secondary mb-4">Booking Information</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Booking ID:</strong> {booking.id}
            </div>
            <div className="col-md-6">
              <strong>Date:</strong> {new Date(booking.date).toDateString()}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Start Time:</strong> {booking.startTime}
            </div>
            <div className="col-md-6">
              <strong>End Time:</strong> {booking.endTime || "N/A"}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Customer name:</strong> {customer.name}
            </div>
            <div className="col-md-6">
              <strong>Customer contact:</strong> {customer.phone || "N/A"}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Address:</strong> {booking.address}
            </div>
            <div className="col-md-6">
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  booking.status === "APPROVED"
                    ? "bg-success"
                    : booking.status === "CANCELLED"
                    ? "bg-danger"
                    : "bg-warning"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Bill:</strong> {booking.bill} PKR
            </div>
            <div className="col-md-6">
              <strong>Guest Count:</strong> {cateringBooking.guestCount}
            </div>
          </div>
          <hr />
          <h5 className="card-title text-secondary mb-4">Packages</h5>
          {bookedPackages.length > 0 ? (
            bookedPackages.map((pkg) => (
              <div className="row mb-3" key={pkg.id}>
                <div className="col-md-4">
                  <strong>Package Name:</strong> {pkg.name}
                </div>
                <div className="col-md-4">
                  <strong>Price:</strong> {pkg.price} PKR
                </div>
              </div>
            ))
          ) : (
            <p>No Packages booked.</p>
          )}
          <hr />

          {/* Menu Items */}
          <h5 className="card-title text-secondary mb-4">Menu Items</h5>
          {bookedMenuItems && bookedMenuItems.length > 0 ? (
            Object.entries(groupedMenuItems).map(([type, items]) => (
              <div key={type}>
                <h6 className="text-info">{type}</h6>
                {items.map((item) => (
                    <div className="row mb-2" key={item.id}>
                      <div className="col-md-4">
                        <strong>Dish Name:</strong> {item.name}
                      </div>
                      <div className="col-md-4">
                        <strong>Cost:</strong> {item.cost} PKR
                      </div>
                    </div>
                  ))}
                  <hr />
                </div>
              ))
            ) : (
          <p>No menu items available.</p>
          )}

          {booking.status === "REQUESTED" && (
            <div className="d-flex justify-content-center w-100 align-items-center">
              <div className="col-md-6 d-flex justify-content-center w-100 align-items-center">
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleStatusChange("approve")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleStatusChange("reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="card-footer text-center bg-light">
          <button
            className="btn btn-primary me-2"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CateringBookDetail;
