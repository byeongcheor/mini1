import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/ImageSlider.css';
import tera1 from '../img/tera1.jpeg';
import tera2 from '../img/tera2.jpg'; 
import tera3 from '../img/tera3.png';
import tera4 from '../img/tera4.png';
import tera5 from '../img/tera5.png';
import tera6 from '../img/tera6.png';
import tera7 from '../img/tera7.png';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'gray', right: '60px', zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'gray', left: '40px', zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const ImageSlider = () => {
  const img = [tera1, tera2, tera3, tera4, tera5, tera6, tera7];

  const settings = {
    dots: true,
    infinite: true,
    speed: 8000, 
    slidesToShow: 10,
    slidesToScroll: 10,
    arrows: true,
    pauseOnHover: true, 
    nextArrow: <NextArrow />, 
    prevArrow: <PrevArrow />, 
    centerMode: true, 
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 1, 
    cssEase: 'linear', 
  
  };

  return (
    <div className="image-slider">
      <Slider {...settings}>
        {img.map((image, index) => (
          <div key={index} style={{ display: 'inline-block' }}>
            <img src={image} alt={`slide-${index}`} style={{ width: '350px', height: '450px' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;