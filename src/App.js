import React from 'react';
// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './pages/Layout'
import Home from './pages/Home'
import About_us from './pages/About_us';
import Event from'./pages/Event';
import EventDetail from './pages/EventDetail';

import Plant from './pages/Plantstart'
import Plantcare from './pages/Plantcare';

import Community from './pages/Community';
import CommunityView from './pages/CommunityView';
import CommunityForm from './pages/CommunityForm';
import CommunityEdit from './pages/CommunityEdit';

import Login from './pages/Login';
import FindId from './pages/FindId';
import FindPwd from './pages/FindPwd';
import Member from './pages/Member';
import Inquiry from './pages/mypages/Inquiry';
import Profile from './pages/mypages/Profile';
import Changeform from './pages/mypages/Changeform';
import Inquirydetails from './pages/mypages/Inquirydetails';
import InquirydetailsList from './pages/mypages/InquirydetailsList';
import Likelist from './pages/mypages/Likelist';
import Modifypwd from './pages/mypages/Modifypwd';
import Scrap from './pages/mypages/Scrap';
import Mycommunitylist from './pages/mypages/Mycommunitylist';
import Root from './pages/rootpages/Root';
import Memberinfo from './pages/rootpages/Memberinfo';




import Search from './pages/Search';
import SearchResult from './pages/SearchResult';


import PrivateRoute from './pages/PrivateRoute';


function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout/>}>
            <Route path='/' element={<Home/>}></Route>
            <Route path="/about" element={<About_us/>}></Route>          
            <Route path="/event" element={<Event/>}></Route>
            <Route path="/eventdetail" element={<EventDetail/>}></Route>
            
            <Route path='/plant' element={<Plant/>}></Route>
            <Route path='/plantcare/:plant_index' element={<Plantcare/>}></Route>


            <Route path="/community" element={<Community/>}></Route>
            <Route path = "/communityView/:post_index" element={<CommunityView/>}></Route>
            <Route path = "/communityEdit/:post_index" element={<CommunityEdit/>}></Route>

            <Route path="/login" element={<Login/>}></Route>
            <Route path = "/findid" element={<FindId/>}></Route>
            <Route path = "/findpwd" element={<FindPwd/>}></Route>
            <Route path = "/join" element={<Member/>}></Route>
            <Route path = "/profile" element={<Profile/>}></Route>
            <Route path = "/inquiry" element={<Inquiry/>}></Route>
            <Route path = "/changeform" element={<Changeform/>}></Route>
            <Route path="/inquiryDetails/:Inquiry_index" element={<Inquirydetails/>}></Route>
            <Route path = "/inquirydetailslist" element={<InquirydetailsList/>}></Route>
            <Route path = "/likelist" element={<Likelist/>}></Route>
            <Route path = "/modifypwd" element={<Modifypwd/>}></Route>
            <Route path = "/scrap" element={<Scrap/>}></Route>
            <Route path = "/mycommunitylist" element={<Mycommunitylist/>}></Route>
            <Route path = "/root" element = {<Root/>}></Route>
            <Route path = "/memlist" element = {<Memberinfo/>}></Route>


            <Route path ='/search' element={<Search/>}></Route>
            <Route path="/searchresult/:search" element={<SearchResult />}></Route>

            <Route element={<PrivateRoute />}>
              <Route path = "/communityform" element={<CommunityForm/>}></Route>   
            </Route>            
        </Route>
    </Routes>
</BrowserRouter>
    

  );
}

export default App;
