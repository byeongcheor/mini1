import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import User3 from '../img/User3.png';
import logo from '../img/logo.png';
import './css/navigationbar.css';
import img from "../img/search.png";

const NavigationBar = () => {
  const [logState, setLogState] = useState(localStorage.getItem('logState'));
  const [userid, setUserid] = useState(localStorage.getItem('userid'));
  const [searchVisible, setSearchVisible] = useState(false); // 검색창 보이기 여부 상태

  const logout = () => {
    axios
      .get('http://192.168.0.62:20000/logout')
      .then(function (response) {
        localStorage.setItem('logState', 'N');
        setLogState('N');
        localStorage.removeItem('userid');
        window.location.href = '/';
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [formData, setFormData] = useState({ search: '' });
  const [inputErrorMessage, setInputErrorMessage] = useState('');

  const setSearchFormData = (event) => {
    setInputErrorMessage('');
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const searchContents = () => {
    if (!formData.search.trim()) {
      setInputErrorMessage('검색어를 입력하세요.');
      return;
    }
    window.location.href = `/searchresult/${formData.search}`;
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchContents();
    }
  };

  const toggleSearchBox = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <div>
      <nav className="nav-bar">
        <div className="nav1">
          <Link to="/">
            <img src={logo} alt="company Logo" className="Logo" />
          </Link>
        </div>

        <div className="nav2">
          <ul>
            <li>
              <a href="/">HOME</a>
            </li>
            <li>
              <a href="/about">ABOUT</a>
            </li>
            <li>
              <a href="/plant">PLANT</a>
            </li>
            <li>
              <a href="/community">COMMUNITY</a>
            </li>
            <li>
              <a href="/event">EVENT</a>
            </li>
          </ul>
        </div>

        <div className="nav3">
          {logState !== 'Y' && <Link to="/login" className="auth-button">LOGIN</Link>}
          {logState === 'Y' && <Link onClick={logout} className="auth-button">LOGOUT</Link>}
          {logState !== 'Y' && <Link to="/join" className="auth-button">JOIN</Link>}
          {logState === 'Y' && <Link to="/profile" className="auth-button"><img src={User3} className="nv-user" alt="User Profile" /></Link>}
          {logState === 'Y' && userid === 'flower1234' && <Link to="/root" className="auth-button">회원관리</Link>}

          <button className="search-icon-button"onClick={toggleSearchBox}>
            <FaSearch className="search-icon" />
          </button>
        </div>
      </nav>

      {searchVisible && (
          <div className="SearchBox">
            <div className="Close">
              {/* <input type="button" value="x" /> */}
            </div>
            <h2 className="searchH2">Search</h2>
            <div className="SearchContent">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                id="search"
                name="search"
                value={formData.search || ''}
                onChange={setSearchFormData}
                onKeyPress={handleKeyPress}
              />
              <button type="button" className="SearchBtn" onClick={searchContents}>
                <img src={img} alt="검색" />
              </button>
            </div>
            <div className="ErrorM">{inputErrorMessage}</div>
          </div>
        )}
    </div>
  );
};

export default NavigationBar;