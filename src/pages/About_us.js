import React from 'react';
import '../css/About_us.css';
import ImageSlider from './ImageSlider';
import GoogleMapComponent from '../component/GoogleMapComponent';




function About_us() {
    return (
        <div className='Fbg'>
            <div className='Fbp'>
                <p>We connected lifes with nature</p><br/>
                <p>우리는 당신의 일상과 자연을 '연결'합니다</p>               
            </div>
           
             <ImageSlider />
             <div className="map-container-1">
                <div className="map-container-2">
                    <h2>오시는길</h2>
                    <h3>서울시 성동구 아차산로 113 2층 (성수역2번출구)</h3>
                    <GoogleMapComponent className="map-container-3"/>

                </div>

            </div>
        </div>



    );
}

export default About_us;