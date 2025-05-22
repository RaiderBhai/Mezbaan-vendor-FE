import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../store/ServiceOrderProvider';

const AddPhotography = ({ setPage, existingData }) => {
  const navigate = useNavigate();
  const { addService } = useContext(AppContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [Price, setPrice] = useState('');
  const [insta, setInsta] = useState('');
  const [fb, setFb] = useState('');
  const [email, setEmail] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [Contact, setContact] = useState('');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const { state } = useLocation();
  const photographyData = state?.existingData || existingData;

  useEffect(() => {
    if (photographyData) {
      setName(photographyData.name);
      setDescription(photographyData.description);
      setPrice(photographyData.cost);
      setInsta(photographyData.instaLink);
      setFb(photographyData.facebookLink);
      setEmail(photographyData.email)
      setCoverPhoto(photographyData.coverImages[0]);
      setContact(photographyData.contactNumber);
      setImages(photographyData.otherImages || []);
    }
  }, [existingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!photographyData)
      {
        if (!coverPhoto) {
          alert("Please add cover photo.");
          setLoading(false);
          return;
        }
      }
      
      if (
        Price <= 0
      ) {
        alert("Prices must be greater than 0.");
        return;
      }
      setLoading(true);

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('cost', Price.toString());
    formData.append('instaLink', insta);
    formData.append('facebookLink', fb);
    formData.append('contactNumber', Contact.toString());
    formData.append('email', email);
    if (coverPhoto) formData.append('photographyCover', coverPhoto);
    images.forEach((image, index) => {
      formData.append('photographyOther', image);
    });

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in session storage');
      setLoading(false);
      return;
    }

    const url = photographyData
      ? `https://mezbaan-db.vercel.app/photography/${photographyData.id}`
      : 'https://mezbaan-db.vercel.app/add-photography';
    const method = photographyData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setId(result.id);
        addService(result);
        setPage('Services');
        navigate('/services');
      } else {
        console.error('Failed to add Photographer:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding Photographer:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="bg-check ven-div">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card center-div shadow-lg mx-auto"
          style={{maxWidth: "800px", overflowY: 'auto', maxHeight: '90vh'}}
        >
          <h2 className="card-title text-center mb-4 text-white fs-1 mt-4">
            Add Photography Service
          </h2>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control input-bg text-black"
                    placeholder="e.g Nasa studios"
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control input-bg text-black"
                    rows="3"
                    placeholder="Add a brief description of the service"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="Price" className="form-label">
                    Price per hour
                  </label>
                  <input
                    id="Price"
                    type='number'
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control input-bg text-black"
                    rows="3"
                    placeholder="e.g 30000"
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="insta" className="form-label">
                    Instagram ID
                  </label>
                  <input
                    id="insta"
                    type="text"
                    value={insta}
                    onChange={(e) => setInsta(e.target.value)}
                    className="form-control input-bg text-black"
                    placeholder="Enter Instagram profile link"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="fb" className="form-label">
                    Facebook Page
                  </label>
                  <input
                    id="fb"
                    type="text"
                    value={fb}
                    onChange={(e) => setFb(e.target.value)}
                    className="form-control input-bg text-black"
                    placeholder="Enter Facebook page link"
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control input-bg text-black"
                    placeholder="e.g nasa.studio@gmail.com"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="contact" className="form-label">
                    Contact
                  </label>
                  <input
                    id="contact"
                    type="number"
                    value={Contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="form-control input-bg text-black"
                    placeholder="e.g 03216754322"
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label className="form-label">Add Cover Photo:</label>
                  <input
                    type="file"
                    onChange={(e) => setCoverPhoto(e.target.files[0])}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="images">Add sample images (Maximum 3)</label>
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
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary sbmt-btn"
                  disabled={loading}
                >
                  {loading ? 'Adding Photography...' : 'Add Photography'}
                </button>
              </div>
            </form>
          </div>
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

export default AddPhotography;
