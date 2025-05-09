import { useContext } from "react";
import { AppContext } from "../store/ServiceOrderProvider";
import ServiceCard from "./ServiceCard";

const ServiceList = ({ max_arr, currentPage, setPage, onServiceClick, setDelete }) => {
  const { services } = useContext(AppContext);
  const reduced_services = services.slice(0, 3);

  // Mapping of service types to custom strings
  const serviceTypeLabels = {
    VENUESERVICE: "Venues",
    PHOTOGRAPHYSERVICE: "Photography",
    CATERINGSERVICE: "Catering",
    DECORATIONSERVICE: "Decorators",
    OTHERSERVICE: "Other-services",
  };

  const groupedServices = services.reduce((groups, service) => {
    const { type } = service;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(service);
    return groups;
  }, {});

  return (
    <>
      {services.length === 0 && (
        <div className="d-flex justify-content-center w-100">
          <h3>No service added currently</h3>
        </div>
      )}
      {max_arr === 3
        ? reduced_services.map((rservice) => (
            <ServiceCard
              key={`${rservice.id}_${rservice.type}`}
              service={rservice}
              currentPage={currentPage}
              setPage={setPage}
              onServiceClick={onServiceClick}
              setDelete={setDelete}
            />
          ))
        : Object.keys(groupedServices).map((type) => (
              <>
              <div className="w-100">
                <h3 className="service-text">{serviceTypeLabels[type] || type}</h3>
              </div>
              <div className="d-flex flex-wrap gap-5 border-div">
                {groupedServices[type].map((service) => (
                  <ServiceCard
                    key={`${service.id}_${service.type}`}
                    service={service}
                    currentPage={currentPage}
                    setPage={setPage}
                    onServiceClick={onServiceClick}
                    setDelete={setDelete}
                  />
                ))}
              </div>
            </>
          ))}
    </>
  );
};

export default ServiceList;
