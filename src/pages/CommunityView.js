import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/community.css';
import '../css/communityForm.css';
import ScrollToTopButton from './../ScrollToTopButton';
import backImg from '../img/communityView-bg.jpg';
import Write from '../img/pencil.png';
import Delete from '../img/delete.png';
import like from '../img/like.png';
import like_c from '../img/likecheck.png';
import Bookmark from '../img/bookmark.png';
import Bookmark_c from '../img/bookmarkcheck.png';
import { FaChevronLeft } from "react-icons/fa";
import User from '../img/user.png';

const publicUrl = process.env.PUBLIC_URL + '/img/';

function CommunityView() {
    const loginid = localStorage.getItem('userid');
    const { post_index } = useParams(); // 레코드 번호가 담긴다.
    const ismounted = useRef(false);

    const [communityView, setCommunityView] = useState({});
    const [communityContent, setCommunityContent] = useState([]);
    const [like_cnt, setLike] = useState({});
    const [scrap_cnt, setScrap] = useState({});
    const [userinfo, setUserInfo] = useState({});
    const [likeImg, setLikeImg] = useState(false);
    const [scrapImg, setScrapImg] = useState(false);
    const [reply, setReply] = useState('');
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        const height = document.querySelector('.community-user-wrap').offsetHeight;
        console.log(height);
        let timer = setTimeout(() => {
            window.scrollTo({
                top: height,
                behavior: 'smooth',
            });
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!ismounted.current) {
            ismounted.current = true;
            getCommunityView();
            getReplies();
        }
    }, []);

    function getCommunityView() {
        axios.get(`http://localhost:20000/communityView?post_index=${post_index}&userid=${loginid}`)
            .then(function (response) {
                console.log(response.data);
                setCommunityView(response.data.record);
                setCommunityContent(response.data.records);
                setLike(response.data.like);
                setScrap(response.data.scrap);
                setUserInfo(response.data.userinfo);
                setLikeImg(response.data.likeStatus === 0); // 좋아요 상태 설정
                setScrapImg(response.data.scrapStatus === 0); // 스크랩 상태 설정
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function delCheck() {
        var result = window.confirm("삭제하시겠습니까?");
        if (result) {
            axios.post('http://localhost:20000/communityDel', {
                post_index: post_index
            })
                .then(function (response) {
                    if (response.data.result === 1) {
                        alert("글이 삭제되었습니다.");
                        window.location.href = '/community';
                    }
                })
                .catch(function (error) {
                    alert("글 삭제에 실패하였습니다.");
                });
        } else {
            alert("삭제를 취소합니다.");
        }
    }

    useEffect(() => {}, [likeImg]);

    function handleLikeClick() {
        axios.post('http://localhost:20000/likeclick', {
            userid: loginid,
            post_index: post_index
        })
            .then(function(response) {
                console.log(response);
                if (response.data.result === 1) {
                    setLikeImg(true);
                    setLike((prev) => ({ ...prev, like: prev.like + 1 }));
                } else if (response.data.result === 2) {
                    setLikeImg(false);
                    setLike((prev) => ({ ...prev, like: prev.like - 1 }));
                }
            })
            .catch(function(error) {
                console.log(error);
                alert("로그인이 필요합니다");
                window.location.href = '/login';
                
            });
    }

    function handleScrapClick() {
        axios.post('http://localhost:20000/scrapclick', {
            userid: loginid,
            post_index: post_index
        })
            .then(function(response) {
                console.log(response);
                if (response.data.result === 1) {
                    setScrapImg(true);
                    setScrap((prev) => ({ ...prev, scrap: prev.scrap + 1 }));
                } else if (response.data.result === 2) {
                    setScrapImg(false);
                    setScrap((prev) => ({ ...prev, scrap: prev.scrap - 1 }));
                }
            })
            .catch(function(error) {
                console.log(error);
                alert("로그인이 필요합니다");
                window.location.href = '/login';
            });
    }

    function getReplies() {
        axios.get(`http://localhost:20000/postReplies?post_index=${post_index}`)
            .then(function (response) {
                setReplies(response.data.record);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function handleReplySubmit(e) {
        e.preventDefault();

        if (reply.trim() === '') {
            alert('댓글을 입력하세요.');
            return;
        }

        axios.post(`http://localhost:20000/addComment`, {
            post_index: post_index,
            content: reply,
            userid: loginid
        })
        .then(function (response) {
            setReply('');
            getReplies();
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    function gologin(){
        alert("로그인이 필요합니다");
        window.location.href = '/login';
    };
    return (
        <div className='community'>
            <div className="community-user-wrap">
                <img className="community-user-wrap-img" decoding="async" src={backImg} />
                <div className="coumminty-inside-comment">
                    <h1>커뮤니티</h1>
                </div>
            </div>
            <div className="floating-links--wrap">
                {loginid && loginid === communityView.userid && (
                    <span>
                        <div className="item">
                            <div className="button"><a href={`/CommunityEdit/${communityView.post_index}`}><img src={Write} className="floating-button" /></a></div>
                            <p>글 수정</p>
                        </div>
                        <div className="item">
                            <div className="button"><a onClick={delCheck}><img src={Delete} className="floating-button" /></a></div>
                            <p>글 삭제</p>
                        </div>
                    </span>
                )}
                <div className="item">
                    <div className="button"><a onClick={handleLikeClick}><img src={likeImg ? like_c : like} className="floating-button" /></a></div>
                    <p>좋아요</p>
                </div>
                <div className="item">
                    <div className="button"><a onClick={handleScrapClick}><img src={scrapImg ? Bookmark_c : Bookmark} className="floating-button" /></a></div>
                    <p>스크랩</p>
                </div>
            </div>
            <div className='communityEdit-News-form-center'>
                <div className="communityEdit-back-link">
                    <a href='/community'>
                        <FaChevronLeft />목록으로
                    </a>
                </div>
                <div className="text-center">
                    <div className="rich-text-media--container">
                        <div className="rich-text-media--content">
                            <div className="rich-text-media--subheading subheading subheading-center">
                                <h2>{communityView.subject}</h2>
                                <div>
                                    <span className="text-light">좋아요</span> <span className="text-dark">{like_cnt.like}</span>
                                    <span className="text-light ml-3">스크랩</span> <span className="text-dark">{scrap_cnt.scrap}</span>
                                    <span className="text-light ml-3">조회수</span> <span className="text-dark">{communityView.hit}</span>
                                </div>
                                <br />
                                <div className="profile-avatar my-3 mx-auto">
                                    <img src={`http://localhost:20000${userinfo.profileImageUrl}`} className="profile-avatar my-3 mx-auto" />
                                </div>
                                <br />
                                <div className="text-center">
                                    <h5 className="text-dark font-bold mb-1">{userinfo.usernike}</h5>
                                    <p>{communityView.writedate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {communityContent.map((records) => {
                        return (
                            <div key={records.id} className="" data-id="5981">
                                <div className='blank'></div>
                                <img className="output-image" src={`${publicUrl}${records.img}`} />
                                <br /><br />
                                <div className="inspiration-tabs--room">{records.content}</div>
                                <div className='blank'></div>
                            </div>
                        )
                    })}
                </div>
                <div className="" id="comment">
                    <div className="community-review--container">
                        <div className="full flex-fill">
                            <div className="section-title">댓글
                                <span className="text-primary">{replies.length}</span>
                            </div>
                            <ul className="community-review--list">
                                <li>
                                    <form onSubmit={handleReplySubmit}>
                                        <input type="hidden" name="" value="" />
                                        <input type="hidden" name="community" value="89" />
                                        <div className="review-writer">
                                            <div className="review-write">
                                                <div><img src={User} className="avatar avatar-sm" /></div>
                                            </div>
                                            <textarea value={reply} name="content" className="community-form-textarea" onChange={(e) => setReply(e.target.value)} rows="1" placeholder="댓글을 남겨보세요" required=""></textarea>
                                            {loginid &&
                                                <button type="submit" className="review-write-botton">입력</button>
                                            } 

                                        </div>
                                    </form>
                                   
                                </li>
                            </ul>
                            {replies.map((reply, index) => (
                                <ul key={index} className="community-review--list mt-8">
                                    <li data-id="6">
                                        <div className="review-writer">
                                        { console.log( `http://localhost:20000${reply.profileImageUrl}`)}
                                            <div><img src={`http://localhost:20000${reply.profileImageUrl}`} className="avatar avatar-sm" /></div>
                                            <div className="flex-fill">
                                                <p>{reply.usernike}</p>
                                                <span>{reply.writedate}</span>
                                            </div>
                                        </div>
                                        <div className="review-content">{reply.content}</div>
                                    </li>
                                </ul>
                            ))}
                        </div>
                    </div>  
                </div>
            </div>
            <ScrollToTopButton />
        </div>
    );
}

export default CommunityView;
