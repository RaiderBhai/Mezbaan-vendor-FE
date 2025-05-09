import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import * as React from 'react';

const ServiceCard = ({ service, currentPage, setPage, services, setServices, setDelete }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            let className = "star-icon";
            if (rating >= i) {
                stars.push(<FaStar key={i} className={className} />);
            } else if (rating > i - 1) {
                stars.push(<FaStarHalfAlt key={i} className={className} />);
            } else {
                stars.push(<FaRegStar key={i} className={className} />);
            }
        }
        return stars;
    };
    

    const onServiceClick = (type, id) => {
        switch (type) {
          case "VENUESERVICE":
            navigate("/venue", { state: { id } });
            break;
          case "DECORATIONSERVICE":
            navigate("/decoration", { state: { id } });
            break;
          case "CATERINGSERVICE":
            navigate("/catering", { state: { id } });
            break;
          case "PHOTOGRAPHYSERVICE":
            navigate("/photography", { state: { id } });
            break;
          case "OTHERSERVICE":
            navigate("/other", { state: { id } });
            break;
          default:
            console.error("Invalid type");
        }
    };

    const renderServiceDetails = (type) => {
        switch(type) {
            case 'VENUESERVICE':
                return <div><p><b>Type:</b> Venue</p></div>;
            case 'PHOTOGRAPHYSERVICE':
                return <div><p><b>Type:</b> Photography</p></div>;
            case 'DECORATIONSERVICE':
                return <div><p><b>Type:</b> Decoration</p></div>;
            case 'CATERINGSERVICE':
                return <div><p><b>Type:</b> Catering</p></div>;
            case 'OTHERSERVICE':
                return <div><p><b>Type:</b> Other-service</p></div>;
            default:
                return null;
        }
    };

    const deleteService = async (type, id) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete ${service.name}?`);

        if (!isConfirmed) {
            return;
        }

        setLoading(true);
        const token = sessionStorage.getItem("authToken");
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        let endpoint = "";
        switch (type) {
            case "VENUESERVICE":
                endpoint = `https://mezbaan-db.vercel.app/venues/${id}`;
                break;
            case "DECORATIONSERVICE":
                endpoint = `https://mezbaan-db.vercel.app/decorationServices/${id}`;
                break;
            case "CATERINGSERVICE":
                endpoint = `https://mezbaan-db.vercel.app/cateringServices/${id}`;
                break;
            case "PHOTOGRAPHYSERVICE":
                endpoint = `https://mezbaan-db.vercel.app/photography/${id}`;
                break;
            case "OTHERSERVICE":
                endpoint = `https://mezbaan-db.vercel.app/otherServices/${id}`;
                break;
            default:
                console.error("Invalid service type");
                return;
        }

        try {
            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });

            setLoading(false);

            if (response.ok) {
                setDelete(true);
            } else {
                alert("Cannot delete service, a booking for it exists");
                console.error("Failed to delete service");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error deleting service:", error);
        }
    };

    return (
        <div className="card card-hov" style={{ width: "18rem", height: "25rem" }} onClick={() => onServiceClick(service.type, service.id)}>
            <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                onClick={(e) => { e.stopPropagation(); deleteService(service.type, service.id); }}
            >
                <MdDeleteForever className="del-icon" />
            </span>
            <img src={service.image} className="card-img-top set-height" alt="..." />
            <div className="card-body">
                <h5 className="card-title">Title: {service.name}</h5>
                {service.type !=='VENUESERVICE' && service.description && <p className="card-text">Description: {service.description}</p>}
                {service.address && <p className="card-text">Address: {service.address}</p>}
                {renderServiceDetails(service.type)}
                <div className="rating-div">
                    <p><b>Rating: </b></p>
                    <div className="stars">{renderStars(service.averageRating || 0)}</div>	
                </div>
            </div>
            {loading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
