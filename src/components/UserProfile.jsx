import React, { useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const username = user?.name || "Guest";
  const email = user?.email || "Not provided";
  const phone = user?.phone || "Not provided";
  const [profilePic, setProfilePic] = useState(user?.image || "/default-profile.png");
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (previewPic) {
      setLoading(true);
      try {
        const fileInput = document.getElementById("profile-pic-input");
        const file = fileInput.files[0];
  
        const formData = new FormData();
        formData.append("image", file);
  
        const token = sessionStorage.getItem("authToken");
  
        const url = "https://mezbaan-db.vercel.app/upload-profile-picture";
        const method = "POST";
  
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          setProfilePic(data.imageUrl);
          setPreviewPic(null);
  
          // Optionally save the updated profile picture in sessionStorage
          sessionStorage.setItem(
            "user",
            JSON.stringify({ ...user, image: data.imageUrl })
          );
  
          alert("Profile picture updated successfully!");
        } else {
          alert("Failed to upload profile picture.");
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("An error occurred while uploading the picture.");
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0">
        <div className="card-body text-center">
          <div className="display-check mb-4">
            <img
              src={profilePic}
              alt="Profile"
              className="rounded-circle border border-primary"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <label htmlFor="profile-pic-input" className="mt-3 pbtn">
              Change Picture
            </label>
            <input
              id="profile-pic-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
          {previewPic && (
            <div className="preview-container mb-3">
              <img
                src={previewPic}
                alt="Preview"
                className="rounded-circle border"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <button
                onClick={handleImageUpload}
                className="btn btn-success btn-sm mt-2"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Picture"}
              </button>
            </div>
          )}
          <h3 className="card-title text-primary tclr">{username}</h3>
          <p className="card-text text-secondary">
            <strong>Email:</strong> {email}
          </p>
          <p className="card-text text-secondary">
            <strong>Phone:</strong> {phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
