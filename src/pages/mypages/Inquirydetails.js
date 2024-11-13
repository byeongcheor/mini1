import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/InquiryDetails.css';

function InquiryDetails() {
    let [inquiryDetails, setInquiryDetails] = useState({});
    let [reply, setReply] = useState('');
    let [result, setResult] = useState('');
    let [replies, setReplies] = useState([]);
    let [editingReply, setEditingReply] = useState(null);
    let [editingContent, setEditingContent] = useState('');
    const userid = localStorage.getItem('userid');
    const { Inquiry_index } = useParams();
  
    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            getInquiryDetails();
            getReplies();
        }
    }, []);
    
    function getInquiryDetails() {
        axios.get(`http://192.168.0.62:20000/inquiryDetails?Inquiry_index=${Inquiry_index}`)
            .then(function (response) {
                setInquiryDetails(response.data.record);
            }).catch(function (error) {
                console.log(error);
            });
    }

    function getReplies() {
        axios.get(`http://192.168.0.62:20000/inquiryReplies?Inquiry_index=${Inquiry_index}`)
            .then(function (response) {
                setReplies(response.data.record);
                setResult(response.data.on);
            }).catch(function (error) {
                console.log(error);
            });
    }

    function handleReplySubmit(e) {
        e.preventDefault();
        axios.post(`http://192.168.0.62:20000/inquiryReply`, {
            Inquiry_index: Inquiry_index,
            reply: reply,
            userid: userid
        }).then(function (response) {
            setReply('');
            getReplies(); // 새로고침
        }).catch(function (error) {
            console.log(error);
        });
    }

    function handleReplyEdit(e) {
        e.preventDefault();
        axios.post(`http://192.168.0.62:20000/editReply`, {
            Inquiry_index: Inquiry_index,
            reply_id: editingReply.id, 
            content: editingContent
        }).then(function (response) {
            setEditingReply(null);
            setEditingContent('');
            getReplies(); 
        }).catch(function (error) {
            console.log(error);
        });
    }

    function startEditing(reply) {
        setEditingReply(reply);
        setEditingContent(reply.content);
    }

    function cancelEditing() {
        setEditingReply(null);
        setEditingContent('');
    }

    return (
        <div id='inquirydetails'>
            { userid !== 'flower1234' &&
            <div id='menu'>
                <ul>
                    <div>마이페이지</div>
                    <li><a href='/profile'>프로필</a></li>
                    <li><a href='/mycommunitylist'>나의 커뮤니티</a></li>
                    <li><a href='/inquiry'>1대1 문의하기</a></li>
                    <li><a href='/inquirydetailslist' id='oppg'>1대1 문의내역</a></li>
                </ul>
                <ul>
                    <div>회원정보</div>
                    <li><a href='/changeform'>회원정보변경</a></li>
                    <li><a href='/modifypwd'>비밀번호변경</a></li>
                </ul>
            </div>}
            {userid === 'flower1234' &&
            <div id='menu'>
                <ul>
                    <div>문의내역</div>
                    <li><a href='/root'>1대1 문의답변</a></li>
                </ul>
                <ul>
                    <div>회원정보</div>
                    <li><a href='/memlist'>회원정보보기</a></li>
                </ul>
            </div>}
            <div id='content'>
                <div className='details-container'>
                    {userid !== 'flower1234' &&
                    <div className='returnlink'><a href='/inquirydetailslist'>돌아가기</a></div>}
                    {userid === 'flower1234' &&
                    <div className='returnlink'><a href='/root'>돌아가기</a></div>}
                    <h1>문의 내역</h1>
                    <div className="details-row">
                        <div className="col col-lg-2 p-3 bg-secondary text-white">번호:</div>
                        <div className="col col-lg-4 p-3">{inquiryDetails.Inquiry_index}</div>
                        <div className="col col-lg-2 p-3 bg-secondary text-white">작성자:</div>
                        <div className="col col-lg-4 p-3">{inquiryDetails.userid}</div>
                    </div>
                    
                    <div className="details-row">
                        <div className="col col-lg-2 p-3 bg-secondary text-white">등록일:</div>
                        <div className="col col-lg-10 p-3">{inquiryDetails.writedate}</div>
                    </div>
                  
                    <div className="details-row">
                        <div className="col col-lg-2 p-3 bg-secondary text-white">제목:</div>
                        <div className="col col-lg-10 p-3">{inquiryDetails.subject}</div>
                    </div>
                    <div className="details-row">
                        <div className="col col-lg-2 p-3 bg-secondary text-white">글내용:</div>
                        <div id='content2' className="col col-lg-10 p-3">{inquiryDetails.content}</div>
                    </div>
                  
                    { result === 1 && userid !== 'flower1234' &&
                    <span>
                        <h2>답변내용:</h2>
                        <div className="reply-container">
                            {replies.map((reply, index) => (
                                <div key={index} className="reply">
                                    <div className="reply-content">{reply.content}</div>
                                    <div className="reply-date">{reply.date}</div>
                                </div>
                            ))}
                        </div>
                    </span>}
                    
                    { result === 1 && userid === 'flower1234' &&
                    <span>
                        <h2>답변내용:</h2>
                        <div className="reply-container">
                            {replies.map((reply, index) => (
                                <div key={index} className="reply">
                                    <div className="reply-content">{reply.content}</div>
                                    <div className="reply-date">{reply.date}</div>
                                    <div><a onClick={() => startEditing(reply)}>수정하기</a></div>
                                </div>
                            ))}
                        </div>
                    </span>}
                    
                    {editingReply && 
                    <form onSubmit={handleReplyEdit}>
                        <div className="form-group">
                            <label htmlFor="editReply">답변 수정</label>
                            <textarea 
                                id="editReply" 
                                className="form-control" 
                                value={editingContent} 
                                onChange={(e) => setEditingContent(e.target.value)}
                                required>
                            </textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">수정 제출</button>
                        <button type="button" className="btn btn-secondary" onClick={cancelEditing}>취소</button>
                    </form>}
                    
                    {userid === 'flower1234' && result !== 1 &&
                    <form onSubmit={handleReplySubmit}>
                        <div className="form-group">
                            <label htmlFor="reply">답변 작성</label>
                            <textarea 
                                id="reply" 
                                className="form-control" 
                                value={reply} 
                                onChange={(e) => setReply(e.target.value)}
                                required>
                            </textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">답변 제출</button>
                    </form>}
                </div>
            </div>
        </div>
    );
}

export default InquiryDetails;