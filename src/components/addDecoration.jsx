import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../store/ServiceOrderProvider';
import { useLocation } from 'react-router-dom';

const AddDecorationService = ({ setPage, existingData }) => {
  const navigate = useNavigate();
  const { addService } = useContext(AppContext);
  const { state } = useLocation();
  const decorationData = state?.existingData || existingData;

  const [name, setName] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [description, setDescription] = useState('');
  const [managerDetails, setManagerDetails] = useState({
    name: '',
    contact: '',
  });
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState({ amenity: '', cost: '' });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (decorationData) {
      setName(decorationData.name);
      setDescription(decorationData.description);
      setManagerDetails({
        name: decorationData.managerName,
        contact: decorationData.managerNumber,
      });
      setAmenities(decorationData.amenities || []);
      setCoverPhoto(decorationData.coverPhoto || '');
      setImages(decorationData.images || []);
    }
  }, [decorationData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!decorationData && amenities.length === 0) {
      alert('Please provide at least one amenity.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('managerName', managerDetails.name);
    formData.append('managerNumber', managerDetails.contact);
    {!decorationData && formData.append('amenities', JSON.stringify(amenities))};

    if (coverPhoto) formData.append('decorationCover', coverPhoto);
    images.forEach((image, index) => formData.append('decorationOther', image));

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in session storage');
      setLoading(false);
      return;
    }

    const url = decorationData
      ? `https://mezbaan-db.vercel.app/decorationServices/${decorationData.id}`
      : 'https://mezbaan-db.vercel.app/add-decorationService';
    const method = decorationData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        addService(result);
        setPage('Services');
        navigate('/services');
      } else {
        console.error('Failed to process the service');
      }
    } catch (error) {
      console.error('Error processing the service:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle amenities addition
  const handleAddAmenity = () => {
    if (!newAmenity.amenity.trim()) {
      alert('Amenity name cannot be empty.');
      return;
    }
    if (!newAmenity.cost || parseFloat(newAmenity.cost) <= 0) {
      alert('Amenity cost must be greater than 0.');
      return;
    }
  
    setAmenities((prevAmenities) => [...prevAmenities, newAmenity]);
    setNewAmenity({ amenity: '', cost: '' });
  };
  

  const removeAmenity = (index) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle manager details change
  const handleManagerChange = (e) => {
    const { name, value } = e.target;
    setManagerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
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

  return (
    <div className="main ven-div bg-check">
      <div className="card center-div" style={{ width: '18rem' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-white fs-1 mt-4">
            {decorationData ? 'Edit Decoration Service' : 'Add Decoration Service'}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Provider Name */}
            <div className="form-group mb-3">
              <label htmlFor="name">Decorators Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control input-bg text-black"
                placeholder="e.g Sajawat"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group mb-3">
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

            {/* Cover Photo */}
            <div className="form-group mb-3">
              <label htmlFor="coverPhoto">Add Cover Photo</label>
              <input
                id="coverPhoto"
                type="file"
                onChange={(e) => setCoverPhoto(e.target.files[0])}
                className="form-control input-bg text-black"
                required={!decorationData} // Make it required only if it's a new service
              />
            </div>

            {/* Manager Details */}
            <div className="form-group row mb-3">
              <div className="col">
                <label htmlFor="mname">Manager Name</label>
                <input
                  id="mname"
                  type="text"
                  name="name"
                  value={managerDetails.name}
                  onChange={handleManagerChange}
                  className="form-control input-bg text-black"
                  placeholder="e.g Ashfaq Ahmed"
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="mnum">Manager Contact</label>
                <input
                  id="mnum"
                  type="number"
                  name="contact"
                  value={managerDetails.contact}
                  onChange={handleManagerChange}
                  className="form-control input-bg text-black"
                  placeholder="e.g 03435678123"
                  required
                />
              </div>
            </div>

            {/* Sample Images */}
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

            {/* Add Amenity */}
            {!decorationData && <div className="form-group mb-3">
              <label htmlFor="aname">Add Amenity</label>
              <div className="row">
                <div className="col">
                  <input
                    id="aname"
                    type="text"
                    value={newAmenity.amenity}
                    onChange={(e) =>
                      setNewAmenity({ ...newAmenity, amenity: e.target.value })
                    }
                    className="form-control input-bg text-black"
                    placeholder="e.g Tent"
                  />
                </div>
                <div className="col">
                  <input
                    id="aprice"
                    type="number"
                    value={newAmenity.cost}
                    onChange={(e) =>
                      setNewAmenity({ ...newAmenity, cost: e.target.value })
                    }
                    className="form-control input-bg text-black"
                    placeholder="e.g 10000"
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="btn btn-outline-secondary text-white amenity-btn"
                  >
                    Add Amenity
                  </button>
                </div>
              </div>
              <div>
                {amenities.map((a, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <p className="text-black">{a.amenity}</p>
                    <p className="text-black ms-2">{a.cost}</p>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="btn btn-danger btn-sm ms-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>}

            {/* Submit */}
            <div className="form-group text-center mt-4">
              <button type="submit" className="btn sbmt-btn btn-success text-white" disabled={loading}>
                {loading ? 'Submitting...' : decorationData ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDecorationService;
