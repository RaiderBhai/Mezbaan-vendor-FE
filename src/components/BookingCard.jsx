import { MdDeleteForever } from "react-icons/md";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

const BookingCard = ({ booking }) => {
    const formatDate = (isoDate) => {
      return isoDate.split("T")[0];
    };

    const navigate = useNavigate();

    const onBookingClick = (type, id) => {
        switch (type) {
          case "venue":
            navigate("/venueBook", { state: { type, id } });
            break;
          case "decorationService":
            navigate("/decorationBook", { state: { type,id } });
            break;
          case "cateringService":
            navigate("/cateringBook", { state: { type,id } });
            break;
          case "photography":
            navigate("/photographyBook", { state: { type,id } });
            break;
          case "otherService":
            navigate("/otherBook", { state: { type,id } });
            break;
          default:
            console.error("Invalid type");
        }
      };
  
    return (
      <div className="card card-hov" style={{ width: "18rem" }} onClick={()=>{onBookingClick(booking.type, booking.bookingId)}}>
        <div className="card-body">
          <h5 className="card-title">{booking.serviceName}</h5>
          <p className="card-text">Event date: {formatDate(booking.date)}</p>
          <p className="card-text">Service: {booking.type}</p>
          <p className="card-text">Bill: {booking.bill}</p>
          <p className="card-text">Status: {booking.status}</p>
        </div>
      </div>
    );
  };
  
  export default BookingCard;
  