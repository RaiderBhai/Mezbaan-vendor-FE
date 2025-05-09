import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const BackgroundManager = ({ successfulLogin }) => {
  const location = useLocation();

  useEffect(() => {
    if (successfulLogin && location.pathname !== '/login' && location.pathname !== '/addpage' && location.pathname !== '/addcatering' && location.pathname !== '/signup' && location.pathname !== '/addvenue' && location.pathname !== '/adddecoration' && location.pathname !== '/addphotography' && location.pathname !== '/addother') {
      document.body.style.backgroundColor = "#F2F3F3";
      document.body.style.backgroundImage = "none";
    } else if (location.pathname === '/addPage') {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "url('your-image-url')";
    } else {
      document.body.style.backgroundColor = "transparent";
      document.body.style.backgroundImage = "";
    }

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundColor = "";
    };
  }, [successfulLogin, location.pathname]);

  return null;
};

export default BackgroundManager;