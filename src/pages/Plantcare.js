import plant0 from '../img/plantTop0.png';
import ScrollToTopButton from './../ScrollToTopButton';
import styles from '../css/Plantcare.css';
import Plantstart from './Plantstart';
import plant3 from '../img/plant3.png';
import plant2 from '../img/plant2.png';
import plant9 from '../img/plant9.png';
import symbol1 from './../img/symbol1.png';
import symbol2 from './../img/symbol2.png';
import symbol3 from './../img/symbol3.png';
import symbol4 from './../img/symbol4.png';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Plantcare() {

  useEffect(()=>{
    const height = document.querySelector('.topImg').offsetHeight;
    console.log(height);
    let timer = setTimeout(()=>{     
        window.scrollTo({
        top: height,
        behavior: 'smooth',
      }); }, 700);
  });

  var [plantcareview, setPlantCareView] = useState([]);

  const {plant_index} = useParams();

    const ismounted = useRef(false);
    useEffect(() => {
        if (!ismounted.current) {
            ismounted.current = true;
        } else {
            getPlantCareView();
        }
    }, []);

    function getPlantCareView() {
        axios.get(`http://localhost:20000/plantcare?plant_index=${plant_index}`)
            .then(function (response) {
                console.log(response.data);
                setPlantCareView(response.data.record);
            }).catch(function (error) {
                console.log(error);
            });
    }
  return (
      <div className="Plant">

        <div className="page">
          <div className="pageTop">
            <div className="topImg">
              <img src={plant0} alt="plantTop0.png" />
                <div className="pageTopText">
                  <h1>플랜트 케어</h1>
                  <p className="topText">
                    실내 식물은 어떤 집안 장식에 자연스러운 매력을 더해줍니다.실내 식물은 건강을 유지하기 위해 각기 다른 요구 사항을 가지고 있습니다.<br/>
                    고유한 생활 식물 디자인을 돌보는 방법에 대해 더 자세히 알아보세요.
                  </p>
                </div>
            </div>
          </div>
        </div>
        <div className='back'>
          <div><a href="/plant">◀ 목록으로</a></div>
        </div>
        <div className='pageMiddle2'>
          <div className='plantImage'><img src={process.env.PUBLIC_URL +`${plantcareview.img}`} alt={plantcareview.plantkor}/></div>
            <div className='plantIntro'>
              <div className='plantIntro2'>
                <h2>{plantcareview.plantkor}</h2>
                <ul className='plantName'>
                  <p className='title'>{plantcareview.planteng}</p>
                  <li className='titleName'>{plantcareview.plantkor}</li>
                </ul>
                <div className='plantDetail'>
                  <div className='plantContent'>
                  {plantcareview.content}
                  </div>
                </div>
                <div className='plantSimilar'>
                  <p className='title2'>SIMILAR IN PLANT CARE</p>
                  <ul className='plantSimilarItem'>
                    <li>
                    <img src={process.env.PUBLIC_URL + plant3} alt="plant3.png"/>
                      <div className='plantP'>고무나무- 인도(버건디)</div>
                      
                    </li>
                    <li>
                      <img src={plant2} alt="plant2.png" />
                      <div className='plantP'>고무나무 수채화</div>
                     
                    </li>
                    <li>
                      <img src={plant9} alt="plant9.png" />
                      <div className='plantP'>마란타-그린</div>
                      
                    </li>
                  </ul>
                </div>
              </div>
            </div>
        </div>
        <div className='plantCarePlus'>
          <div className='plantCareDet'>
            <h4 className='distH'>식물관리</h4>
            <ul className='care'>
              <li>
                <h6>물주기</h6>
                <span><img src={symbol1} alt="symbol1.png" /></span>
                <div className='careP'>{plantcareview.water}</div>
              </li>
              <li>
                <h6>햇빛</h6>
                <span><img src={symbol2} alt="symbol2.png" /></span>
                <div className='careP'>{plantcareview.sun}</div>
              </li>
              <li>
                <h6>습도</h6>
                <span><img src={symbol3} alt="symbol3.png" /></span>
                <div className='careP'>{plantcareview.humidity}</div>
              </li>
              <li>
                <h6>온도</h6>
                <span><img src={symbol4} alt="symbol4.png" /></span>
                <div className='careP'>{plantcareview.temp}</div>
              </li>
            </ul>
          </div>
        </div>  
        <div className='plantDistinct'>
          <div className='plantDist'>
            <h4 className='distH'>식물의 특징</h4>
            <p>
            {plantcareview.plantdistinct}</p>
          </div>
        </div>
      <ScrollToTopButton />
    </div>
      
  )
}

export default Plantcare;