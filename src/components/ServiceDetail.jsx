import { AppContext } from "../store/ServiceOrderProvider";
import { useContext } from "react";
import Sidebar from "./sidebar";

const ServiceDetail = ({ serviceId, currentPage, setPage }) => {
    const { services } = useContext(AppContext);
    const service = services.find((s) => s.id === serviceId);
    if (!service) return <p>Service not found.</p>;

    return (
        <div className="services-main-container">
        <div className="side-div">
            <Sidebar currentPage={currentPage} setPage={setPage} />
        </div>
        <div className="services-list-container">
            <div className="service-detail">
                <h2>{service.name}</h2>
                <div className="scard-img">
                    <img src={service.image} alt={service.name} />
                </div>
                <p>Category: {service.category}</p>
                <p>{service.description}</p>
                <p>Price: {service.price}</p>
        
                <h3>Booked Dates:</h3>
                <div>
                    {Object.keys(service.calendar).length > 0 ? (
                        Object.keys(service.calendar).map((date, index) => (
                            service.calendar[date] && <p key={index}>{date}</p>
                        ))
                    ) : (
                        <p>No dates are currently booked.</p>
                    )}
                </div>
            </div>
        </div>
    </div>    
    );
};

export default ServiceDetail;
