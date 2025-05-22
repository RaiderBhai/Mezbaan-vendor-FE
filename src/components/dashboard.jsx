import Header from "./Header";
import ServiceList from "./ServiceList";
import BookingList from "./BookingList";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../store/ServiceOrderProvider";
import { useContext, useEffect } from "react";

const Dashboard = ({currentPage, setPage, setSuccessfulLogin})=>{
    const { services, fetchServices, loading, fetchBookings, loadingBookings} = useContext(AppContext);
    useEffect(() => {
        fetchServices();
        fetchBookings();
      }, []);

    const navigate = useNavigate();

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

      const onBookingClick = (type, id) => {
        switch (type) {
          case "venue":
            navigate("/venueBook", { state: { id } });
            break;
          case "decorationService":
            navigate("/decorationBook", { state: { id } });
            break;
          case "cateringService":
            navigate("/cateringBook", { state: { id } });
            break;
          case "photography":
            navigate("/photographyBook", { state: { id } });
            break;
          case "otherService":
            navigate("/otherBook", { state: { id } });
            break;
          default:
            console.error("Invalid type");
        }
      };

    const handleNavigation = (page) => {
        setPage(page);
        navigate(`/${page.toLowerCase()}`);
    };
    const max_arr=3;
    return (
        <div className="db-page">
            <Header className="db-nav" currentPage={currentPage} setPage={setPage} setSuccessfulLogin={setSuccessfulLogin}></Header>
            <div className="db-second-container">
                <div className="db-texts">
                    <h4 className="db-heading">Services Listed</h4>
                    <h6 className="db-heading crsr" onClick={()=>handleNavigation("Services")}>See All</h6>
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center">
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
                            onServiceClick={onServiceClick}>   
                        </ServiceList>
                    </div>
                )}
                <div className="db-texts">
                    <h4 className="db-heading">Current Bookings</h4>
                    <h6 className="db-heading crsr" onClick={()=>handleNavigation("Bookings")}>See All</h6>
                </div>
                {loadingBookings ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary spin2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    ):(
                    <div className="services-flex">
                        <BookingList max_arr={max_arr}></BookingList>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;