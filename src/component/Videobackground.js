import React from 'react';
import './css/videobackground.css';
const userid=localStorage.getItem('userid');
const Videobackground =()=>{
    const videoroot = process.env.PUBLIC_URL;
    return(
        <div className="video-background">
            <video autoPlay loop muted>
                {/* <source src="/main_video.mp4" type="video/mp4"/> */}
                <source src={`${videoroot}/main_video.mp4`} type="video/mp4"/>
            </video>

            <div className="overlay">
                <h1>FOREDIUM</h1> 
                <h2>당신의 일상과 자연을 연결하는 공간</h2>
                {!userid&&<div id='button10'>
                <h4>'connect'를 클릭해서 당신의 힐링공간을 만들어보세요</h4>
              
                <button className="start-button"><a href='/login'>CONNECT</a></button></div>
                }
            </div>

        </div>

    );

};

export default Videobackground;