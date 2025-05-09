import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaInstagram, FaFacebook, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ImageSlider from "./ImageSlider";
import { useNavigate } from "react-router-dom";

const PhotographyDetail = () => {
  const { state } = useLocation(); // Access the state passed via navigation
  const { id } = state || {}; // Extract the id
  const [PhotographyData, setPhotographyData] = useState(null);
  const navigate = useNavigate();
  const containerStyle = {
    width: "800px",
    height: "400px",
    margin: "0 auto"
  };

  useEffect(() => {
    if (id) {
      // Run the GET API using the id
      fetch(`https://mezbaan-db.vercel.app/photography/${id}`)
        .then((response) => response.json())
        .then((data) => setPhotographyData(data))
        .catch((error) => console.error("Error fetching photographer data:", error));
    }
  }, [id]);

  const handleEdit = () => {
    navigate('/addphotography', { state: { existingData: PhotographyData.data } });
  };

  if (!id) return <p>Invalid ID</p>;
  if (!PhotographyData) return <div className="text-center text-primary mt-4">Loading...</div>;

  const {
    name,
    description,
    cost,
    instaLink,
    facebookLink,
    email,
    contactNumber,
    images,
    ratings,
  } = PhotographyData.data;
  const { otherImages } = PhotographyData.data;

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
          textShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        Photographer Details
      </h1>
      <div>
      {/* Rest of the component */}
      <button onClick={handleEdit} className="btn btn-warning mb-3">
        Edit Service
      </button>
    </div>
      {/* Photographer Details */}
      <div
        className="card shadow-lg p-4 mb-4"
        style={{
          backgroundColor: "#FFF",
          border: "1px solid #FF5733",
          borderRadius: "15px",
        }}
      >
        <div className="row">
          {/* Photographer Info */}
          <div className="col-md-6">
            <h3 className="text-primary tclr">{name || "No Name Provided"}</h3>
            <p>
              <strong>Description:</strong> {description || "No Description"}
            </p>
            <p>
              <strong>Cost per Hour:</strong>{" "}
              <span className="text-success">{cost || "Not Provided"}</span>
            </p>
            <p>
              <FaPhoneAlt className="text-secondary" />{" "}
              <strong>Contact:</strong> {contactNumber || "No Contact"}
            </p>
          </div>
        </div>
      </div>
      {/* Socials Section */}
      <div className="row mt-4">
        {/* Instagram */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-3 text-center"
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFDED5",
              color: "#E4405F",
            }}
          >
            <FaInstagram size={40} />
            <p className="mt-2">
              <strong>Instagram</strong>
            </p>
            <a
              href={instaLink.startsWith('http') ? instaLink : `https://${instaLink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#E4405F" }}
            >
              {instaLink || "Not Provided"}
            </a>
          </div>
        </div>

        {/* Facebook */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-3 text-center"
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFDED5",
              color: "#1877F2",
            }}
          >
            <FaFacebook size={40} />
            <p className="mt-2">
              <strong>Facebook</strong>
            </p>
            <a
              href={facebookLink.startsWith('https') ? facebookLink : `https://${facebookLink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#1877F2" }}
            >
              {facebookLink || "Not Provided"}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-3 text-center"
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFDED5",
              color: "#EA4335",
            }}
          >
            <FaEnvelope size={40} />
            <p className="mt-2">
              <strong>Email</strong>
            </p>
            <a
              href={`mailto:${email}`}
              style={{ textDecoration: "none", color: "#EA4335" }}
            >
              {email || "Not Provided"}
            </a>
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
        <h2 className="text-purple text-center mb-3 tclr">Customer Reviews</h2>
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

export default PhotographyDetail;
