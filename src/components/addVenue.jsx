import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../store/ServiceOrderProvider";
import { useNavigate, useLocation } from "react-router-dom";


const AddVenue = ({ setPage, existingData }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [NightPrice, setNightPrice] = useState();
  const [DayPrice, setDayPrice] = useState("");
  const [OffPrice, setOffPrice] = useState("");
  const [baseGuests, setBaseGuests] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [incrementStep, setGuestCount] = useState("");
  const [incrementPrice, setGuestPrice] = useState("");
  const [address, setAddress] = useState("");
  const [managerDetails, setManagerDetails] = useState({ manName: "", manNumber: "" });
  const [newAmmenity, setNewAmmenity] = useState("");
  const [amenities, setAmmenities] = useState([]);
  const [map, setMap] = useState("");
  const [venueType, setType] = useState("");
  const [images, setImages] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { addService } = useContext(AppContext);

  const { state } = useLocation();
  const venueData = state?.existingData || existingData;

  useEffect(() => {
    if (venueData) {
      setName(venueData.name);
      setType(venueData.venueType);
      setDescription(venueData.description);
      setDayPrice(venueData.priceDay);
      setNightPrice(venueData.priceNight);
      setOffPrice(venueData.priceOff);
      setBaseGuests(venueData.baseGuestCount);
      setMaxCapacity(venueData.capacity);
      setGuestCount(venueData.incrementStep);
      setGuestPrice(venueData.incrementPrice);
      setAddress(venueData.address);
      setManagerDetails({
        manName: venueData.managerName,
        manNumber: venueData.managerNumber,
      });
      setAmmenities(venueData.amenities || []);
      setCoverPhoto(venueData.coverPhoto || '');
    }
  }, [venueData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input
    if (amenities.length === 0) {
      alert("Please provide at least one amenity.");
      return;
    }
  
    if (!coverPhoto && !venueData) {
      alert("Please add a cover photo.");
      return;
    }
  
    if (
      DayPrice <= 0 ||
      NightPrice <= 0 ||
      OffPrice <= 0 ||
      maxCapacity <= 0 ||
      baseGuests <= 0
    ) {
      alert("Prices and guest capacities must be greater than 0.");
      return;
    }
  
    if (Number(baseGuests) > Number(maxCapacity)) {
      alert("Minimum guests should not exceed maximum guests.");
      return;
    }
  
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("capacity", maxCapacity.toString());
      formData.append("venueType", venueType);
      formData.append("priceDay", DayPrice.toString());
      formData.append("priceNight", NightPrice.toString());
      formData.append("priceOff", OffPrice.toString());
  
      if (incrementStep) {
        formData.append("incrementStep", incrementStep.toString());
      }
  
      if (incrementPrice) {
        formData.append("incrementPrice", incrementPrice.toString());
      }
  
      if (map) {
        formData.append("locationLink", map);
      }
  
      formData.append("managerName", managerDetails.manName);
      formData.append("managerNumber", managerDetails.manNumber);
      formData.append("baseGuestCount", baseGuests.toString());
      formData.append("amenities", JSON.stringify(amenities));
  
      // Only append new cover photo if added
      if (coverPhoto) {
        formData.append("venueCover", coverPhoto);
      }
  
      // Append multiple images (venueOther[])
      images.forEach((image) => {
        formData.append("venueOther[]", image);
      });
  
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.error("No token found in session storage");
        setLoading(false);
        return;
      }
  
      const url = venueData
        ? `https://mezbaan-db.vercel.app/venues/${venueData.id}`
        : "https://mezbaan-db.vercel.app/add-venue";
      const method = venueData ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        addService(result);
        setPage("Services");
        navigate("/services");
      } else {
        const errorData = await response.json();
        console.error("Failed to process the service:", errorData);
        alert("Error: " + (errorData.message || "Something went wrong."));
      }
    } catch (error) {
      console.error("Error processing the service:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const openMap = () => {
    const selectedLocation = prompt("Select location on the map and provide the link:");
    if (selectedLocation) setMap(selectedLocation);
  };

  const handleManagerChange = (e) => {
    const { name, value } = e.target;
    setManagerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAmmenity = () => {
    if (newAmmenity) {
      setAmmenities([...amenities, newAmmenity]);
      setNewAmmenity("");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 3) {
      alert('You can only upload up to 3 images.');
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAmenity = (index) => {
    setAmmenities((prev) => prev.filter((_, i) => i !== index));
  };
  

  return (
    <div className="bg-check ven-div">
      <div className="container py-5">
      <div className="card center-div shadow-lg p-4 mx-auto" style={{ maxWidth: "800px", overflowY: 'auto', maxHeight: '90vh' }}>
        <h2 className="card-title text-center mb-4 text-white fs-1">Add Venue Service</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
            <label htmlFor="name">Venue name</label>  
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g La Grande Marquee"
                required
              />
            </div>
            <div className="col-md-6">
            <label htmlFor="type">Venue type</label>
              <input
                type="text"
                id="type"
                value={venueType}
                onChange={(e) => setType(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g Banquet"
                required
              />
            </div>
          </div>
          <div className="mb-3">
          <label htmlFor="desc">Description</label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control input-bg text-black"
              rows="3"
              placeholder="Add Description..."
              required
            ></textarea>
          </div>
          <div className="form-group mb-3">
              <label htmlFor="coverPhoto">Add Cover Photo</label>
              <input
                id="coverPhoto"
                type="file"
                onChange={(e) => setCoverPhoto(e.target.files[0])}
                className="form-control input-bg text-black"
              />
            </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="dayprice">Price (daytime events)</label>
              <input
                id="dayprice"
                type="number"
                value={DayPrice}
                onChange={(e) => setDayPrice(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g 250000"
              />
            </div>
            <div className="col-md-4">
            <label htmlFor="nightprice">Price (night-time events)</label>
              <input
                id="nightprice"
                type="number"
                value={NightPrice}
                onChange={(e) => setNightPrice(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g 500000"
                required
              />
            </div>
            <div className="col-md-4">
            <label htmlFor="offprice">Price (off-time events)</label>
              <input
                id="offprice"
                type="number"
                value={OffPrice}
                onChange={(e) => setOffPrice(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g 50000"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
            <label htmlFor="baseguest">Minimum Guests</label>
              <input
                id="baseguest"
                type="number"
                value={baseGuests}
                onChange={(e) => setBaseGuests(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g 200"
                required
              />
            </div>
            <div className="col-md-6">
            <label htmlFor="maxguest">Maximum Guests</label>
              <input
                id="maxguest"
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g 1200"
                required
              />
            </div>
          </div>
          {Number(maxCapacity) > Number(baseGuests) && (
            <div className="row mb-3">
              <div className="col-md-6">
              <label htmlFor="incGuest">Additional Guests</label>
                <input
                  id="incGuest"
                  type="number"
                  value={incrementStep}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="form-control input-bg text-black"
                  placeholder="e.g 50"
                />
              </div>
              <div className="col-md-6">
              <label htmlFor="incPrice">Price for additional guests</label>
                <input
                  id="incPrice"
                  type="number"
                  value={incrementPrice}
                  onChange={(e) => setGuestPrice(e.target.value)}
                  className="form-control input-bg text-black"
                  placeholder="e.g 20000"
                />
              </div>
            </div>
          )}
          <div className="row mb-3">
            <div className="col-md-9">
            <label htmlFor="address">Venue address</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g W3QP+Q5Q, Federal B Area Block 21 Gulberg Town, Karachi"
                required
              />
            </div>
            <div className="col-md-3">
            <label htmlFor="map">Google Map link</label>
              <button id="map" type="button" onClick={openMap} className="btn btn-success w-100">
                📍 Map
              </button>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
            <label htmlFor="mname">Manager Name</label>
              <input
                id="mname"
                type="text"
                name="manName"
                value={managerDetails.manName}
                onChange={handleManagerChange}
                className="form-control input-bg text-black"
                placeholder="e.g Ashfaq Ahmad"
              />
            </div>
            <div className="col-md-6">
            <label htmlFor="mnum">Manager Number</label>
              <input
                id="mnum"
                type="number"
                name="manNumber"
                value={managerDetails.manNumber}
                onChange={handleManagerChange}
                className="form-control input-bg text-black"
                placeholder="e.g 03427590234"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="amenity">Add amenity</label>
            <div className="d-flex">
              <input
                id="amenity"
                type="text"
                value={newAmmenity}
                onChange={(e) => setNewAmmenity(e.target.value)}
                className="form-control me-2 input-bg text-black"
                placeholder="e.g Valet Parking"
              />
              <button type="button" onClick={handleAddAmmenity} className="btn btn-secondary">
                Add
              </button>
            </div>
            <ul className="mt-2">
              {amenities.map((amenity, index) => (
              <li key={index} className="d-flex align-items-center text-black">
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(index)}
                  className="btn btn-danger btn-sm ms-2"
                  >
                  Remove
                </button>
              </li>
                ))}
              </ul>
          </div>
          <div className="form-group mb-3">
              <label htmlFor="images">Add Sample Images (Maximum 3)</label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="form-control input-bg text-black"
              />
              <div className="mt-2">
                {images.map((img, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <p className="text-black">{img.name}</p>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn btn-danger btn-sm ms-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary sbmt-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : venueData ? 'Update Service' : 'Add Service'}
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
}

export default AddVenue;
