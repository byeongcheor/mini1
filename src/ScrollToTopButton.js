import React, { useState, useEffect } from 'react';
import './css/ScrollToTopButton.css';
import upArrow from './img/up.png'; // 이미지 파일을 import 합니다.

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트를 감지하여 버튼의 표시 여부를 결정하는 함수
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 컴포넌트가 마운트 될 때 한 번만 실행되는 useEffect를 사용하여 스크롤 이벤트 리스너를 추가합니다.
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // 컴포넌트가 언마운트 될 때 스크롤 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정합니다.

  // 페이지를 일정 거리만큼 스크롤하는 함수
  const scrollToTop = () => {
    const currentPosition = window.pageYOffset;
    const increment = 100000; // 한 번에 스크롤할 거리

    // 목표 위치 계산
    const targetPosition = currentPosition - increment;

    // 일정 거리만큼 스크롤합니다.
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  };

  // 스크롤 버튼을 렌더링합니다.
  return (
    <div className="scroll-to-top">
      {isVisible && (
        <img
          src={upArrow}
          onClick={scrollToTop}
          className="scroll-to-top-button"
          alt="위로"
        />
      )}
    </div>
  );
};

export default ScrollToTopButton;