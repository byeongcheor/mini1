// src/components/Footer.js
import React from 'react';
import './css/Footer.css';
import {Link} from 'react-router-dom';


const Footer = () => {
    return (
        <footer className="footer">
            <nav className="footer-nav">
                <ul>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/plant">Plant</Link></li>
                    <li><Link to="/community">Community</Link></li>
                    <li><Link to="/event">Event</Link></li>
                </ul>
            </nav>
            <div className="footer-info">
                <p>이용약관 개인정보처리방침</p>
                <p>대표: Aiden CHOI 사업자 번호: 880-01-12345</p>
                <p>TEL: 02-416-9542 Mobile: 010-4440-9577</p>
                <p>E-mail: foredium@frdm.com</p>
                <p>전화문의: 02-586-9577</p>
                <p>사업자 소재지: 서울시 성동구 아차산로113 2층</p>
                <p>운영시간: 9:00 am - 6:00 pm</p>
                <p>Copyright © 2024 FOREDIUM All Rights Reserved.</p>
            </div>
    
        </footer>
          



    );





};

export default Footer;
