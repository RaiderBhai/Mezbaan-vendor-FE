import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CateringDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = state || {};
  const [cateringData, setCateringData] = useState(null);
  const [openPackages, setOpenPackages] = useState({});

const togglePackage = (index) => {
  setOpenPackages((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};


  useEffect(() => {
    if (id) {
      fetch(`https://mezbaan-db.vercel.app/cateringServices/${id}`)
        .then((response) => response.json())
        .then((data) => setCateringData(data))
        .catch((error) => console.error("Error fetching catering data:", error));
    }
  }, [id]);

  if (!id) return <div className="text-center text-danger mt-4">Invalid ID</div>;
  if (!cateringData) return <div className="text-center text-primary mt-4">Loading...</div>;

  const { name, address, menuItems, packages, images, averageRating,ratings } = cateringData.data;

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const category = item.type || "Other";
      acc[category] = acc[category] || [];
      acc[category].push(item);
      return acc;
    }, {});
  };

  const handleEdit = () => {
    navigate('/addcatering', { state: { existingData: cateringData.data } });
  };

  // Categorized menu items
  const categorizedMenuItems = menuItems ? groupByCategory(menuItems) : {};

  // Categorized package menu items
  const categorizePackageItems = (packageMenuItems) =>
    packageMenuItems ? groupByCategory(packageMenuItems) : {};

  return (
    <div className="ven-div bg-check ofy">
      <div
      className="container-fluid p-5"
    >
      {/* Page Title */}
      <h1
        className="text-center mb-4 text-white"
        style={{
          fontWeight: "bold",
          color: "#3B5998",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      >
        Catering Details
      </h1>
      <div>
      {/* Rest of the component */}
      <button onClick={handleEdit} className="btn btn-warning mb-2">
        Edit Service
      </button>
    </div>
      {/* Catering Overview */}
      <div
        className="card shadow-lg p-4 mb-4"
        style={{
          backgroundColor: "#f0f8ff",
          border: "1px solid #b8d6f5",
          borderRadius: "15px",
        }}
      >
        <div className="row">
          <div className="col-md-6">
            <h3 className="text-primary tclr">{name || "No Name Provided"}</h3>
            <p><strong>Address:</strong> {address || "No Address Provided"}</p>
            <p>
              <strong>Average Rating:</strong>{" "}
              <span className="badge bg-success">
                {averageRating || "Not Rated Yet"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div
        className="card shadow-lg p-4 mb-4"
        style={{
          backgroundColor: "#e8f5e9",
          border: "1px solid #a5d6a7",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-success tclr">Menu Items</h2>
        {menuItems?.length > 0 ? (
          Object.keys(categorizedMenuItems).map((category) => (
            <div key={category}>
              <h4 className="mt-3 rgclr">{category}</h4>
              <ul className="list-group">
                {categorizedMenuItems[category].map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{
                      backgroundColor: "#f1f8e9",
                      borderRadius: "10px",
                      transition: "background-color 0.3s ease, transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#dcedc8";
                      e.target.style.transform = "scale(1.02)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#f1f8e9";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    {item.name} - {item.cost || "Not Priced"}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </div>

      {/* Packages */}
      <div
        className="card shadow-lg p-4 mb-4"
        style={{
          backgroundColor: "#fff3e0",
          border: "1px solid #ffcc80",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-warning tclr">Packages</h2>
        {packages?.length > 0 ? (
  packages.map((packageItem, packageIndex) => {
    const categorizedPackageItems = categorizePackageItems(packageItem.menuItems);
    const isOpen = openPackages[packageIndex];

    return (
      <div
        key={packageIndex}
        className="border rounded p-3 mb-3"
        style={{
          backgroundColor: "#ffe0b2",
          borderRadius: "10px",
        }}
      >
        <h4
          style={{
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => togglePackage(packageIndex)}
        >
          {packageItem.name} - {packageItem.price}
          <span>{isOpen ? "▲" : "▼"}</span>
        </h4>

        {isOpen && Object.keys(categorizedPackageItems).map((category) => (
          <div key={category}>
            <h5 className="text-info mt-3">{category}</h5>
            <ul className="list-group">
              {categorizedPackageItems[category].map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{
                    backgroundColor: "#ffe0b2",
                    borderRadius: "10px",
                    transition: "background-color 0.3s ease, transform 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#B76E79";
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#ffe0b2";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  {item.name}{item.cost ? ` - ${item.cost}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  })
) : (
  <p>No packages available.</p>
)}
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

export default CateringDetail;
