import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from "../store/ServiceOrderProvider";

const AddOtherService = ({ setPage, existingData }) => {
  const { addService } = useContext(AppContext);
  const navigate = useNavigate();
  const [name, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [guestLimit, setGuestLimit] = useState("");
  const [id, setId] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState('');

  const { state } = useLocation();
  const otherData = state?.existingData || existingData;

  useEffect(() => {
    if (otherData) {
      setServiceName(otherData.name);
      setDescription(otherData.description);
      setCost(otherData.cost);
      setDuration(otherData.duration);
      setGuestLimit(otherData.guestLimit);
      setContact(otherData.contactNumber);
      setCoverPhoto(otherData.coverImages[0]);
      setImages(otherData.otherImages || []);
    }
  }, [otherData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!otherData)
      {
        if (!coverPhoto) {
          alert("Please add cover photo.");
          setLoading(false);
          return;
        }
      }
      
      if (
        price <= 0 ||
        duration <= 0 ||
        guestLimit <= 0
      ) {
        alert("Price, duration and guest limit must be greater than 0.");
        return;
      }
      setLoading(true);

    const formData =  new FormData();

    formData.append("name",name);
    formData.append("description",description);
    formData.append("cost",price);
    formData.append("guestLimit",guestLimit);
    formData.append("duration",duration);
    formData.append("contactNumber",contact.toString());
    images.forEach((image, index) => {
      formData.append("otherOther", image);
    });
    if (coverPhoto) formData.append('otherCover', coverPhoto);

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.error("No token found in session storage");
      setLoading(false);
      return;
    }
    
    const url = otherData
      ? `https://mezbaan-db.vercel.app/otherServices/${otherData.id}`
      : 'https://mezbaan-db.vercel.app/add-otherService';
    const method = otherData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, // Only include auth header, no Content-Type for FormData
        },
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        setId(result.id);
        addService(result);
        setPage("Services");
        navigate("/services");
      } else {
        console.error("Failed to add service:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
  
    if (files.length + images.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
  
    setImages((prev) => [...prev, ...files]); // Store File objects
  };
  
  
    const removeImage = (index) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
    };

  return (
    <div className="bg-check ven-div">
  <div
    className="card center-div"
    style={{ width: "40rem", overflowY: "auto", maxHeight: "80vh" }}
  >
    <div className="card-body">
      <h2 className="card-title text-center mb-4 text-white fs-1 mt-4">
        Add Other Service
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name and Contact in a single row */}
        <div className="form-group row mb-3">
          <div className="col-md-6">
            <label htmlFor="sname">Service Name</label>
            <input
              id="sname"
              type="text"
              value={name}
              onChange={(e) => setServiceName(e.target.value)}
              className="form-control input-bg"
              placeholder="e.g Jadoon Transport"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="contact">Service Contact</label>
            <input
              id="contact"
              type="number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="form-control input-bg"
              placeholder="e.g 03245435611"
              required
            />
          </div>
        </div>

        {/* Description in a full row */}
        <div className="form-group mb-3">
          <label htmlFor="sdesc">Service Description</label>
          <textarea
            id="sdesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control input-bg"
            placeholder="e.g Hiace available for pick and drop in events. 60 seater, air conditioned."
            required
          ></textarea>
        </div>

        {/* Cover Photo in a full row */}
        <div className="form-group mb-3">
          <label className="text-white">Add Cover Photo:</label>
          <input
            type="file"
            onChange={(e) => setCoverPhoto(e.target.files[0])}
            className="form-control"
          />
        </div>

        {/* Price, Duration, and Guest Limit in one row */}
        <div className="form-group row mb-3">
          <div className="col-md-4">
            <label htmlFor="sprice">Price (as per duration)</label>
            <input
              id="sprice"
              type="number"
              value={price}
              onChange={(e) => setCost(e.target.value)}
              className="form-control input-bg"
              placeholder="e.g 25000"
              step="0.01"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="sdur">Duration (minutes)</label>
            <input
              id="sdur"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="form-control input-bg"
              placeholder="e.g 240"
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="guest">Guest Limit</label>
            <input
              id="guest"
              type="number"
              value={guestLimit}
              onChange={(e) => setGuestLimit(e.target.value)}
              className="form-control input-bg"
              placeholder="e.g 60"
            />
          </div>
        </div>

        {/* Other Images in a full row */}
        <div className="form-group mb-3">
          <label htmlFor="images">Add Sample Images (Maximum 3)</label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="form-control input-bg"
          />
          <div className="mt-2">
          {images.map((img, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <span style={{ marginRight: '10px' }}>{img.name}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="sbmt-div">
          <button
            type="submit"
            className="btn btn-primary sbmt-btn"
            disabled={loading}
          >
            {loading ? "Adding Other Service..." : "Add Other Service"}
          </button>
        </div>
      </form>
    </div>
  </div>
  {loading && (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  )}
    </div>
  );
};

export default AddOtherService;