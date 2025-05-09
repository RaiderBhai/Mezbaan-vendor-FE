import Header from "./Header";
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../store/ServiceOrderProvider';

const AddService = ({currentPage, setPage, setSuccessfulLogin})=> {
  const {addService} = useContext(AppContext);
  const [category, setCategory] = useState('catering');
  const [page, setNavPage] = useState("addcatering");
  const [image, setPictures] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e,pageVal)=>{
    setCategory(e.target.value);
    setNavPage(pageVal);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(category);
    navigate(`/${page}`);
  };


  return (
    <>
      <div className='main'>
      <Header className="db-nav" currentPage={currentPage} setPage={setPage} setSuccessfulLogin={setSuccessfulLogin}></Header>
      <div className="card center-div" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title text-center fs-2">Select service you want to add</h5>
          <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className=''>Service Type:</label>
          <div>
            <label className='radio-label text-black'>
              <input
                className='radio-single'
                type="radio"
                value="catering"
                checked={category === 'catering'}
                onChange={(e) =>handleChange(e,"addcatering")}
              />
              Catering
            </label>
            <label className='radio-label text-black'>
              <input
                className='radio-single'
                type="radio"
                value="venue"
                checked={category === 'venue'}
                onChange={(e) =>handleChange(e,"addvenue")}
              />
              Venue
            </label>
            <label className='radio-label text-black'>
              <input
                className='radio-single'
                type="radio"
                value="decoration"
                checked={category === 'decoration'}
                onChange={(e) =>handleChange(e,"adddecoration")}
              />
              Decoration
            </label>
            <label className='radio-label text-black'>
              <input
                className='radio-single'
                type="radio"
                value="photography"
                checked={category === 'photography'}
                onChange={(e) =>handleChange(e,"addphotography")}
              />
              Photography
            </label>
            <label className='radio-label text-black'>
              <input
                className='radio-single'
                type="radio"
                value="Other"
                checked={category === 'Other'}
                onChange={(e) =>handleChange(e,"addother")}
              />
              Other
            </label>
          </div>
        </div>
        <div className='sbmt-div'><button type="submit" className="sbmt-btn btn btn-primary">Next</button></div>
      </form>
        </div>
      </div>
      </div>
    </>
  );
}

export default AddService;
