import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../store/ServiceOrderProvider";

const AddCateringService = ({ setPage }) => {
  const navigate = useNavigate();
  const { addService } = useContext(AppContext);
  const { state } = useLocation();
  const existingData = state?.existingData; // Data for editing

  // State Definitions
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", type: "", cost: "" });
  const [newPackage, setNewPackage] = useState({ name: "", price: "", menuItems: [] });
  const [loading, setLoading] = useState(false);

  // Pre-fill form if editing existing service
  useEffect(() => {
    if (existingData) {
      setName(existingData.name || "");
      setAddress(existingData.address || "");
      setMenuItems(existingData.menuItems || []);
      setPackages(existingData.packages || []);
    }
  }, [existingData]);

  const handleAddMenuItem = () => setShowMenuItemForm(true);

  const handleMenuItemChange = (field, value) => {
    setNewMenuItem({ ...newMenuItem, [field]: value });
  };

  const handleSaveMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.type || !newMenuItem.cost) {
      alert('Please fill all menu item fields.');
      return;
    }
    if (isNaN(newMenuItem.cost) || parseFloat(newMenuItem.cost) <= 0) {
      alert('Cost per head must be a number greater than 0.');
      return;
    }
    setMenuItems([...menuItems, newMenuItem]);
    setNewMenuItem({ name: '', type: '', cost: '' });
    setShowMenuItemForm(false);
  };
  
  const handleSavePackage = () => {
    if (!newPackage.name || !newPackage.price || !newPackage.menuItems.length) {
      alert('Please complete all package fields.');
      return;
    }
    if (isNaN(newPackage.price) || parseFloat(newPackage.price) <= 0) {
      alert('Price per head must be a number greater than 0.');
      return;
    }
    setPackages([...packages, newPackage]);
    setNewPackage({ name: '', price: '', menuItems: [] });
    setShowPackageForm(false);
  };
  

  const handleRemoveMenuItem = (index) => {
    const updatedMenuItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(updatedMenuItems);
  };

  // Handlers for Packages
  const handleAddPackage = () => setShowPackageForm(true);

  const handlePackageChange = (field, value) => {
    setNewPackage({ ...newPackage, [field]: value });
  };

  const handleAddPackageItem = () => {
    setNewPackage({
      ...newPackage,
      menuItems: [...newPackage.menuItems, { name: "", type: "" }],
    });
  };

  const handlePackageItemChange = (index, field, value) => {
    const updatedItems = [...newPackage.menuItems];
    updatedItems[index][field] = value;
    setNewPackage({ ...newPackage, menuItems: updatedItems });
  };

  const handleRemovePackageItem = (itemIndex) => {
    const updatedItems = newPackage.menuItems.filter((_, i) => i !== itemIndex);
    setNewPackage({ ...newPackage, menuItems: updatedItems });
  };

  const handleRemovePackage = (index) => {
    const updatedPackages = packages.filter((_, i) => i !== index);
    setPackages(updatedPackages);
  };

  const handleCoverChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(existingData)
      {
        if (!name || !address) {
          alert("Please fill all required fields.");
          setLoading(false);
          return;
        }
      } else {
        if (!name || !address || !image) {
          alert("Please fill all required fields.");
          setLoading(false);
          return;
        }
      }
      setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    if (image) formData.append("cateringCover", image);
    formData.append("menuItems", JSON.stringify(menuItems));
    formData.append("packages", JSON.stringify(packages));

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.error("No token found in session storage");
      setLoading(false);
      return;
    }

    const url = existingData
      ? `https://mezbaan-db.vercel.app/cateringServices/${existingData.id}`
      : "https://mezbaan-db.vercel.app/add-cateringService";
    const method = existingData ? "PUT" : "POST";

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
        if (!existingData) addService(result);
        setPage("Services");
        navigate("/services");
      } else {
        console.error("Failed to submit service:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-check ven-div">
      <div className="container-fluid d-flex justify-content-center align-items-center main py-5">
        <div className="card shadow-lg center-div" style={{ maxWidth: "750px", overflowY: "auto", maxHeight: "90vh" }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4 text-white fs-1 mt-2">
              {existingData ? "Edit Catering Service" : "Add Catering Service"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Service Info */}
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control mb-3 input-bg text-black"
                  placeholder="Catering Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control mb-3 input-bg text-black"
                  placeholder="Catering Address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Add Cover Photo:</label>
                <input type="file" onChange={handleCoverChange} className="form-control mb-3 input-bg text-black" />
              </div>

              {/* Menu Items */}
              <h5 className="text-black">Menu Items</h5>
              {menuItems.map((item, index) => (
                <p key={index}>
                  {item.name} - {item.type} - {item.cost}{' '}
                  <button
                    type="button"
                    className="btn btn-warning btn-sm ms-2"
                    onClick={() => handleRemoveMenuItem(index)}
                  >
                    Remove
                  </button>
                </p>
              ))}
              <button type="button" onClick={handleAddMenuItem} className="btn btn-secondary btn-sm mb-4">
                Add Menu Item
              </button>
              {showMenuItemForm && (
                <div className="border rounded p-3 mb-3">
                  <input
                    type="text"
                    value={newMenuItem.name}
                    onChange={(e) => handleMenuItemChange('name', e.target.value)}
                    className="form-control mb-2 input-bg text-black"
                    placeholder="Item Name"
                  />
                  <select
                    value={newMenuItem.type}
                    onChange={(e) => handleMenuItemChange('type', e.target.value)}
                    className="form-control mb-2 input-bg text-black"
                  >
                    <option value="">Select Type</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drink">Drink</option>
                  </select>
                  <input
                    type="text"
                    value={newMenuItem.cost}
                    onChange={(e) => handleMenuItemChange('cost', e.target.value)}
                    className="form-control mb-2 input-bg text-black"
                    placeholder="Cost Per Head"
                  />
                  <button type="button" onClick={handleSaveMenuItem} className="btn btn-primary btn-sm mt-2">
                    Save Item
                  </button>
                </div>
              )}

              {/* Packages */}
              <h5 className="text-black">Packages</h5>
              {packages.map((pkg, index) => (
                <p key={index}>
                  {pkg.name} - {pkg.price}{' '}
                  <button
                    type="button"
                    className="btn btn-warning btn-sm ms-2"
                    onClick={() => handleRemovePackage(index)}
                  >
                    Remove
                  </button>
                </p>
              ))}
              <button type="button" onClick={handleAddPackage} className="btn btn-secondary btn-sm mb-4">
                Add Package
              </button>
              {showPackageForm && (
                <div className="border rounded p-3 mb-3">
                  <input
                    type="text"
                    value={newPackage.name}
                    onChange={(e) => handlePackageChange('name', e.target.value)}
                    className="form-control mb-2 input-bg text-black"
                    placeholder="Package Name"
                  />
                  <input
                    type="text"
                    value={newPackage.price}
                    onChange={(e) => handlePackageChange('price', e.target.value)}
                    className="form-control mb-2 input-bg text-black"
                    placeholder="Price Per Head"
                  />
                  <h6 className="mt-3 text-black">Package Items</h6>
                  {newPackage.menuItems.map((item, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handlePackageItemChange(index, 'name', e.target.value)}
                        className="form-control mb-2 input-bg text-black"
                        placeholder="Item Name"
                      />
                      <select
                        value={item.type}
                        onChange={(e) => handlePackageItemChange(index, 'type', e.target.value)}
                        className="form-control mb-2 input-bg text-black"
                      >
                        <option value="">Select Type</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Drink">Drink</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => handleRemovePackageItem(index)}
                      >
                        Remove Item
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddPackageItem} className="btn btn-secondary btn-sm mt-2">
                    Add Item
                  </button>
                  <div>
                  <button type="button" onClick={handleSavePackage} className="btn btn-primary btn-sm mt-3">
                    Save Package
                  </button>
                  </div>
                </div>
              )}

              <div>
              <button
                type="submit"
                className="btn btn-primary mt-3 sbmt-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : existingData ? "Update Service" : "Add Service"}
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCateringService;
