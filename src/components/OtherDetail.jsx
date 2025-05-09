import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import { FaInstagram, FaFacebook, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OtherDetail = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [otherData, setOtherData] = useState(null);
  const navigate = useNavigate();
  const containerStyle = {
    width: "800px",
    height: "400px",
    margin: "0 auto"
  };

  useEffect(() => {
    if (id) {
      fetch(`https://mezbaan-db.vercel.app/otherServices/${id}`)
        .then((response) => response.json())
        .then((data) => setOtherData(data))
        .catch((error) => console.error("Error fetching service data:", error));
    }
  }, [id]);

  const handleEdit = () => {
    navigate('/addother', { state: { existingData: otherData.data } });
  };

  if (!id) return <div className="text-center text-danger mt-4">Invalid ID</div>;
  if (!otherData) return <div className="text-center text-primary mt-4">Loading...</div>;

  const { name, description, cost, contactNumber, guestLimit, duration, images, averageRating,ratings } = otherData.data;
  const { otherImages } = otherData.data;

  return (
    <div className="ven-div bg-check ofy">
      <div
      className="container-fluid p-5"
    >
      {otherImages.length > 0 && <div style={containerStyle}>
        <ImageSlider slides={otherImages}></ImageSlider>
      </div>}
      {/* Page Title */}
      <h1
        className="text-center mb-4"
        style={{
          fontWeight: "bold",
          color: "#FFFFFF",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
        }}
      >
        Service Details
      </h1>
      <div>
      {/* Rest of the component */}
      <button onClick={handleEdit} className="btn btn-warning mb-3">
        Edit Service
      </button>
    </div>
      {/* Service Overview */}
      <div
        className="card shadow-lg p-4 mb-4"
        style={{
          backgroundColor: "#FFE4C4",
          border: "1px solid #FFC0CB",
          borderRadius: "15px",
        }}
      >
        <div className="row">
          {/* Service Information */}
          <div className="col-md-6">
            <h3 className="text-danger">{name || "No Name Provided"}</h3>
            <p>
              <strong>Description:</strong> {description || "No Description"}
            </p>
            <p>
              <FaPhoneAlt className="text-secondary" />{" "}
              <strong>Contact:</strong> {contactNumber || "No Contact"}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              <span className="badge bg-warning text-dark">
                {averageRating || "No Rating"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Section */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: "#FFB6C1",
              textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black',
              color: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h5>Cost</h5>
            <p>{cost || "N/A"}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: "#87CEEB",
              color: "#fff",
              textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black',
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h5>Guests</h5>
            <p>{guestLimit || "N/A"} People</p>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: "#FFA07A",
              textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black',
              color: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h5>Duration</h5>
            <p>{duration || "N/A"} mins</p>
          </div>
        </div>
      </div>
      {/* Reviews Section */}
      {ratings?.length>0 && (
      <div
        className="card shadow-lg p-4 mb-4 mt-5"
        style={{
          backgroundColor: "#f3e5f5",
          border: "1px solid #ce93d8",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-purple text-center mb-3">Customer Reviews</h2>
        <div className="row d-flex justify-content-space-around align-items-center">
          {ratings.map((review, index) => (
            <div
              key={index}
              className="col-md-4 col-sm-6 mb-3"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className="p-2"
                style={{
                  backgroundColor: "#fce4ec",
                  border: "1px solid #f48fb1",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                  maxWidth: "300px",
                  width: "100%",
                }}
              >
                <h5 className="text-center mb-1">{review.name}</h5>
                <p className="text-center mb-2">
                  <strong>Rating:</strong> ⭐ {review.rating}
                </p>
                <p
                  className="text-center"
                  style={{
                    fontSize: "0.9rem",
                    color: "#6a1b9a",
                  }}
                >
                  {review.comments}
                </p>
              </div>
            </div>
          ))}
    </div>
  </div>
)}
    </div>
    </div>
  );
};

export default OtherDetail;
