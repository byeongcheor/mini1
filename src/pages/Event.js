import React,{useEffect,useRef} from 'react';
import event1 from '../img/event1.png';
import event2 from '../img/event2.png';
import event3 from '../img/event3.png';
import event4 from '../img/event4.png';
import event5 from '../img/event5.png';
import eventimg1 from '../img/eventimg1.jpg';
import '../css/Event.css';

function Event() {
   
        const topboxRef= useRef(null);
        useEffect(() => {
            if (topboxRef.current) {
              setTimeout(() => {
                const height = topboxRef.current.offsetHeight;
                window.scrollTo({
                  top: height,
                  behavior: 'smooth',
                });
              }, 700); // 0.8초 후에 스크롤 실행
            }
          }, []);
      
         const handleClick = (eventTitle, url = '') => {
        if (url) {
            window.location.href = url;
        } else {
            alert(eventTitle);
        }
    };

    return (
        <div className="All">
            <div className="topbox" ref={topboxRef}>
                <img src={eventimg1} alt="eventimg1.jpg" />
                <div className="evtimg">
                    
                    <h1>Event</h1>
                    <h3>매월 새로운 이벤트를 확인하세요</h3>
                </div>
            </div>

           



            <div className="EvtOn">
                <div className="imgsize">
                    <img src={event1} alt="8월 예정 이벤트" onClick={() => handleClick('8월 이벤트는 8월5일부터 열립니다.')} />
                    <h2 onClick={() => handleClick('8월 이벤트는 8월5일부터 열립니다.')}>8월 예정 이벤트</h2>
                </div>
                <div className="imgsize">
                    <img src={event2} alt="7월 진행 중 이벤트" onClick={() => handleClick('', './eventdetail')} />
                    <h2 onClick={() => handleClick('', './eventdetail')}>7월 진행 중 이벤트</h2>
                </div>
            </div>

            <div className="LstEvt">
                <div className="imgsize">
                    <img src={event3} className="Elo4" alt="6월 종료된 이벤트" />
                    <h2 onClick={() => handleClick('6월 종료된 이벤트입니다.')}>6월 종료된 이벤트</h2>
                    <div className="Gre" onClick={() => handleClick('6월 종료된 이벤트입니다.')}></div>
                </div>
                <div className="imgsize">
                    <img src={event4} className="Elo3" alt="3월 종료된 이벤트" />
                    <h2 onClick={() => handleClick('3월 종료된 이벤트입니다.')}>3월 종료된 이벤트</h2>
                    <div className="Gre" onClick={() => handleClick('3월 종료된 이벤트입니다.')}></div>
                </div>
                <div className="imgsize">
                    <img src={event5} className="Elo2" alt="1월 종료된 이벤트" onClick={() => handleClick('1월 종료된 이벤트입니다.')} />
                    <h2 onClick={() => handleClick('1월 종료된 이벤트입니다.')}>1월 종료된 이벤트</h2>
                    <div className="Gre" onClick={() => handleClick('1월 종료된 이벤트입니다.')}></div>
                </div>
            </div>
        </div>
    );
}

export default Event;
