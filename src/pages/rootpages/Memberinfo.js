import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Memberinfo.css';

function Memberinfo() {
    let wordCut = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };
    const [userlist, setUserlist] = useState([]);
 
    useEffect(() => {
        axios.post('http://192.168.0.62:20000/userlist')
            .then(function(response) {
                setUserlist(response.data.result);
            })
            .catch(function(error) {
                console.log(error);
            });
    }, []);

    return (
        <div id="memlist">
            <div id='menu'>
                <ul>
                    <div>문의내역</div>
                    <li><a href='/root'>1대1 문의답변</a></li>
                </ul>
                <ul>
                    <div>회원정보</div>
                    <li><a href='/memlist'>회원정보보기</a></li>
                </ul>
            </div>
            <div id='content'>
                <div className="container">
                    <h1>회원 정보</h1>
                    <div id='name1' className="row header">
                        <div className="col col-lg-2 p-2">아이디</div>
                        <div className="col col-lg-2 p-2">이름</div>
                        <div className="col col-lg-2 p-2">닉네임</div>
                        <div className="col col-lg-2 p-2">이메일</div>
                        <div className="col col-lg-2 p-2">전화번호</div>
                        <div className="col col-lg-2 p-2">가입일</div>
                    </div>
                    {userlist.map((user) => (
                        <div className="row" key={user.userid}>
                            <div className="col col-lg-2 p-2">{user.userid}</div>
                            <div className="col col-lg-2 p-2">{user.username}</div>
                            <div className="col col-lg-2 p-2">{user.usernike}</div>
                            <div className="col col-lg-2 p-2" style={wordCut}>{user.useremail}</div>
                            <div className="col col-lg-2 p-2">{user.usertel}</div>
                            <div className="col col-lg-2 p-2">{user.registerdate}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Memberinfo;