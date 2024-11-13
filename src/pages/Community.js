import '../css/community.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import backImg from '../img/community-bg.jpg';
import ScrollToTopButton from './../ScrollToTopButton';
import backImg2 from '../img/pencil.png';

const publicUrl = process.env.PUBLIC_URL + '/img/';

function Community() {
    var [communityList, setCommunityList] = useState([]);
    var [communityListTop, setCommunityListTop] = useState([]);

    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            getCommunityList();
        }
    }, []);

    useEffect(() => {
        const height = document.querySelector('.user-wrap').offsetHeight;
        console.log(height);
        let timer = setTimeout(() => {
            window.scrollTo({
                top: height,
                behavior: 'smooth',
            });
        }, 700);
    }, []);

    function getCommunityList() {
        axios.get('http://localhost:20000/community')
            .then(function (response) {
                console.log(response.data);
                setCommunityList(response.data.result);
                setCommunityListTop(response.data.topresult);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [sortMethod, setSortMethod] = useState('newest');
    useEffect(() => {
        fetchView();
    }, [sortMethod]);

    const fetchView = async () => {
        try {
            const response = await axios.get(`http://localhost:20000/community?sort=/${sortMethod}`);
            if (Array.isArray(response.data.result)) {
                setCommunityList(response.data.result);
            } else {
                console.error('API response is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching community data:', error);
        }
    };

    const handleSortChange = (event) => {
        setSortMethod(event.target.value);
    };

    return (
        <div className='community'>
            <div className="user-wrap">
                <img decoding="async" src={backImg} alt="Community Background" />
                <div className="coumminty-inside-comment">
                    <h1>커뮤니티</h1>
                    <p className="coumminty-topText">나만의 플랜테리어를 공유해요.</p>
                </div>
            </div>
            <div className="floating-links--wrap">
                <div className="item">
                    <div className="back-button">
                        <a href="/communityform"><img src={backImg2} className="floating-button" alt="Write" />
                        </a></div>
                    <p>글 작성</p>
                </div>
            </div>
            <div style={{ margin: '100px 0px' }}>
                <div className="middle-comment">
                    <h3>깔끔한 공간 분리가 돋보이는 플랜테리어</h3>
                </div>
                <div className="middle-comment">
                    <p>나만의 플랜테리어를 공유해보세요</p>
                </div>
            </div>
            <div className="hit-comment">
                <h3> 🌱 조회수 TOP2 게시글 🌱 </h3>
            </div>
            <div className="community-hit">
                <ul id="list" className="community-contents">
                    {communityListTop.map((record) => (
                        <li className="community-card--blog-featured" key={record.post_index}>
                            <a href={`/communityView/${record.post_index}`} tabIndex="-1">
                                <div className="card--img community-featured-topics--item--image">
                                    <img className="card--img community-featured-topics--item--image" src={publicUrl + record.img} width="100%" height="100%" alt="Community Top" />
                                </div>
                                <div className="community-card--blog-featured">
                                    <div className="community-card--title">
                                        {record.subject}
                                    </div>
                                    <div className="community-card--post-details">
                                        <div>{record.userid}</div>
                                        <div>
                                            <span>좋아요</span> <span>{record.likes}</span>
                                            <span>스크랩</span> <span>{record.scrap}</span>
                                            <span>조회수</span> <span>{record.hit}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="topics" style={{ display: 'flex', float: 'right', margin: '0px 50px' }}>
                <div id='sort123'>
                <div className="topics-name" >
                    <span>정렬 </span>
                    <select className="filter-dropdown" id="sort" name="sort" value={sortMethod} onChange={handleSortChange}>
                    <option value="newest">최신순</option>
                        <option value="hit">조회수순</option>
                        <option value="like">좋아요순</option>
                        <option value="scrap">스크랩순</option>
                        
                    </select>
                </div>
                </div>
            </div>
            <div className="community-fluid">
                <ul id="list" className="community-featured-topics--tab-content--list">
                    {Array.isArray(communityList) ? (
                        communityList.map((record) => (
                            <li className="community-card--blog-featured" key={record.post_index}>
                                <a href={`/communityView/${record.post_index}`} tabIndex="-1">
                                    <div className="card--img community-featured-topics--item--image">
                                        <img className="card--img community-featured-topics--item--image" src={publicUrl + record.img} width="100%" height="100%" alt="Community" />
                                    </div>
                                    <div className="community-card--blog-featured">
                                        <div className="community-card--title">
                                            {record.subject}
                                        </div>
                                        <div className="community-card--post-details">
                                            <div>{record.userid}</div>
                                            <div>
                                                <span>좋아요</span> <span>{record.likes}</span>
                                                <span>스크랩</span> <span>{record.scrap}</span>
                                                <span>조회수</span> <span>{record.hit}</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))
                    ) : (
                        <p>데이터가 없습니다.</p>
                    )}
                </ul>
            </div>
            <ScrollToTopButton />
        </div>
    );
}

export default Community;
