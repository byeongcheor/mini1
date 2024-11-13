import React from 'react';
import poster from '../img/poster.jpg';
import '../css/EventDetail.css';

function EventDetail() {
    return (
        <div className="poster">
            <img src={poster} alt="Event poster"/>
            <h1>7월 Event Oneday Class 진행</h1>
            <h3>7월 여름날 감각적인 인테리어를 원하시는 분들께 원데이 클래스를 진행합니다.</h3>
            <h4>날짜: 7월 13일,27일</h4>
            <h4>장소 : 본사 3층</h4>
            <h4>인원 : 20명</h4>
            <h4>신청방법 : 카카오톡 'foredium' 채널 등록 후 이메일 신청</h4>
            <h4>E-mail주소 : foredium@frdm.com</h4>

        </div>
       
    );
  }
  
  export default EventDetail;
  