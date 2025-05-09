import Header from "./Header";
import ServiceList from "./ServiceList";
import { useEffect, useState } from "react";
import { AppContext } from "../store/ServiceOrderProvider";
import { useContext} from "react";

const Services = ({currentPage, setPage, onServiceClick, setSuccessfulLogin})=>{
    const { services, fetchServices, loading } = useContext(AppContext);
    const [deleteService, setDelete] = useState(false);
    useEffect(() => {
        fetchServices();
        setDelete(false);
      }, [deleteService]);
    const max_arr = -1;
    return (
        <div className="">
            <Header className="db-nav" currentPage={currentPage} setPage={setPage} setSuccessfulLogin={setSuccessfulLogin}></Header>
            <div className="services-list-container">
                {loading ? (
                    <div className="d-flex justify-content-center align-self-center spinner">
                        <div className="spinner-border text-primary spin2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ):(
                    <div className="services-flex">
                        <ServiceList
                            max_arr={max_arr}
                            currentPage={currentPage}
                            setPage={setPage}
                            onServiceClick={onServiceClick}
                            setDelete={setDelete}>   
                        </ServiceList>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Services;