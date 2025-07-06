// frontend/src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} FilmFrenzy. All rights reserved.</p>
        <div className="footer-links">
          
          Contact details:
            <br/>
            Phone no:<a href="tel:6234156871">6234156871</a> <br/>
            Gmail:<a href="mailto:contact@filmfrenzy.com">contact@filmfrenzy.com</a>
          
          
          
        </div>
        <p>Developed with ❤️ by Iti</p>
      </div>
    </footer>
  );
};

export default Footer;
