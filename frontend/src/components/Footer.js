// frontend/src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="footer-main">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Movie Site. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#about">About Us</a>
                    <a href="mailto:contact@moviesite.com">Contact</a>
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                </div>
                <p>Developed ❤️ by Iti Debnath</p>
            </div>
        </footer>
    );
};

export default Footer;
