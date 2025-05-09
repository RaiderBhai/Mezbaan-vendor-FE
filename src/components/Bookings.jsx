import Header from "./Header";
import { useEffect } from "react";
import { AppContext } from "../store/ServiceOrderProvider";
import { useContext } from "react";
import BookingList from "./BookingList";

const Bookings = ({currentPage, setPage, onBookingclick, setSuccessfulLogin})=>{
    const { services, fetchBookings, loadingBookings } = useContext(AppContext);
    useEffect(() => {
        fetchBookings();
      }, []);
      const max_arr = -1;
    return (
        <div className="">
            <Header className="db-nav" currentPage={currentPage} setPage={setPage} setSuccessfulLogin={setSuccessfulLogin}></Header>
            <div className="bookings-list-container">
            {loadingBookings ? (
                    <div className="d-flex justify-content-center spinner">
                        <div className="spinner-border text-primary spin2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ):(
                    <div className="bookings-flex">
                        <BookingList max_arr={max_arr}></BookingList>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Bookings;