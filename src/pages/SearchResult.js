import '../css/SearchResult.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { computeHeadingLevel } from '@testing-library/react';
import searchTop from '../img/searchTop.png';
import ScrollToTopButton from '../ScrollToTopButton';


function SearchResult() {

    useEffect(() => {
        const height = document.querySelector('.topImg').offsetHeight;
        let timer = setTimeout(() => {
            window.scrollTo({
                top: height,
                behavior: 'smooth',
            });
        }, 200);
    });
    



    const { search } = useParams();
    const [searchView, setSearchView] = useState({
        record: [],
        community_count: 0,
        plant_count: 0,
        event_count: 0
    });


    const ismounted = useRef(false);

    useEffect(() => {
        if (!ismounted.current) {
            ismounted.current = true;
        } else {
            gerSearchView();
        }
    }, [search]);

    function gerSearchView() {

        axios.get(`http://localhost:20000/searchresult?search=${search}`)
            .then(function (response) {
                console.log(response.data);
                // console.log(response.data.record);
                setSearchView(response.data);
                console.log((response.data.record).length);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    const lengthOfItems = searchView.length;



    return (
        <div className="Result_page">
           <div className="page">
                <div className="pageTop">
                    <div className="topImg">
                        <img src={searchTop} alt="searchTop.png" />
                        <div className="pageTopText">
                            <h1>검색결과</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className='Result'>
                <div>
                    <h2><span id="first">"{search}" </span>에 대한 검색 결과는 <span id="second">"{searchView.record.length}"</span>건 이 검색되었습니다.</h2>
                    {/* <div className='searchRPP'>
                        <div className="searchR">검색결과</div>
                        <div className="searchPP">커뮤니티 [{searchView.community_count}] 빌견</div>
                        <div className="searchPP">식물 [{searchView.plant_count}] 발견</div> 
                        <div className="searchPP">이벤트 [{searchView.event_count}] 발견</div>
                    </div> */}
                </div>
            </div>
            <div className='searchMain'>
                <div className='searchMM'>
                <div className="contentsM">
                    <div className="contents">
                        <h4>커뮤니티
                            <span className="rtxt">&nbsp;&nbsp;  총 </span>
                            <span className="nthsearch">{searchView.community_count}</span>
                            <span className="rtxt"> 건이 검색되었습니다.</span>
                        </h4>
                        <ul className='contentsA'>
                            {searchView.record.slice(0, Math.min(4, searchView.community_count)).map(record => (
                                <li key={record.id}><a href={`/communityView/${record.post_index}`}>
                                   
                                   
                                    <img src={process.env.PUBLIC_URL+'/img/'+`${record.img}`}/> {record.subject}</a>
                                </li>
                            ))}
                            {searchView.community_count > 4 && <div className="more_info"><a href='http://127.0.0.1:3000/SearchResult/community'className="search-link">검색 결과 더 보기</a></div>}
                        </ul>
                    </div>
                    <div className="contents">
                        <h4>식물
                            <span className="rtxt">&nbsp;&nbsp;  총 </span>
                            <span className="nthsearch">{searchView.plant_count}</span>
                            <span className="rtxt"> 건이 검색되었습니다.</span>
                        </h4>
                        <ul className='contentsA'>
                            {searchView.record.slice(searchView.community_count, Math.min(searchView.community_count + 4, searchView.community_count + searchView.plant_count)).map(record => (
                                <li key={record.id}>
                                    <a href={`/plantcare/${record.plant_index}`}>
                                    { console.log( 'Image path:', process.env.PUBLIC_URL + record.img)}
                                    <img src={process.env.PUBLIC_URL+`${record.img}`}/> {record.plantkor}
                                    </a>
                                </li>
                            ))}
                            {searchView.plant_count > 4 && <div className="more_info"><a href='http://127.0.0.1:3000/SearchResult/plant'>검색 결과 더 보기</a></div>}
                        </ul>
                    </div>
                    <div className="contents">
                        <h4>이벤트
                            <span className="rtxt">&nbsp;&nbsp;  총 </span>
                            <span className="nthsearch">{searchView.event_count}</span>
                            <span className="rtxt"> 건이 검색되었습니다.</span>
                        </h4>
                        <ul className='contentsA'>
                            {searchView.record.slice(searchView.community_count + searchView.plant_count, Math.min(searchView.community_count + searchView.plant_count + 4, searchView.community_count + searchView.plant_count + searchView.event_count)).map(record => (
                                <li key={record.id}>
                                    <a href='#'>
                                        {record.post_index}
                                    </a>
                                </li>
                            ))}
                            {searchView.event_count > 4 && <div className="more_info"><a href='http://127.0.0.1:3000/SearchResult/plant'>검색 결과 더 보기</a></div>}
                        </ul>
                    </div>
                </div>
                </div>
            </div>
            <ScrollToTopButton />
        </div>
       
    );
}

export default SearchResult;
