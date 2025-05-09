import { useContext } from "react";
import { AppContext } from "../store/ServiceOrderProvider";
import BookingCard from "./BookingCard";

const BookingList = ({ max_arr }) => {
  const { bookings } = useContext(AppContext);

  // Filter out rejected bookings
  const filteredBookings = bookings.filter((booking) => booking.status !== "CANCELLED");

  // Group bookings by status
  const groupedBookings = filteredBookings.reduce((groups, booking) => {
    const { status } = booking;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(booking);
    return groups;
  }, {});
  
  return (
    <>
      {filteredBookings.length === 0 && (
        <div className="d-flex justify-content-center w-100">
          <h3>No service booked currently</h3>
        </div>
      )}
      {max_arr === 3
        ? filteredBookings.slice(0, 3).map((booking) => (
            <BookingCard key={`${booking.bookingId}_${booking.type}`} booking={booking} />
          ))
        : Object.keys(groupedBookings).map((status) => (
            <div key={status} className="w-100">
              <h4 className="service-text">{status}</h4>
              <div className="d-flex flex-wrap gap-5 border-div">
                {groupedBookings[status].map((booking) => (
                  <BookingCard key={`${booking.bookingId}_${booking.type}`} booking={booking} />
                ))}
              </div>
            </div>
          ))}
    </>
  );
};

//key={`${rservice.id}_${rservice.type}`}

export default BookingList;
