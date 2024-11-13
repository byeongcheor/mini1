import React from 'react';
import '../App.css';
// import Videobackground from '../component/Videobackground';
import Navigationbar from '../component/NavigationBar';
import Footer from '../component/Footer';
// import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Outlet, Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';

function Layout() {
  return (
      <div>
        <Navigationbar/>
        <Outlet/>
        <Footer/>
      </div>

  );
}

export default Layout;