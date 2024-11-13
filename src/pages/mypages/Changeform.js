import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Changeform.css';

function Changeform() {
    const [changeFm, setChangeFm] = useState({
        usernike: '',
        usertel: '',
        useremail: '',
        prefer: []
        
    });
    const [usernikeErrorMessage, setUsernikeErrorMessage] = useState('');
    const [usertelErrorMessage, setUsertelErrorMessage] = useState('');
    const [useremailErrorMessage, setUseremailErrorMessage] = useState('');
    const userid = localStorage.getItem('userid');

    useEffect(() => {
        if (userid) {
            axios.get(`http://192.168.0.62:20000/getUsername?userid=${userid}`)
                .then(response => {
                    setChangeFm({
                        usernike: response.data.usernike,
                        usertel: response.data.usertel,
                        useremail: response.data.useremail,
                        prefer: response.data.prefer || []
                    });
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userid]);

    const setChangeform = (event) => {
        setUsernikeErrorMessage('');
        setUsertelErrorMessage('');
        setUseremailErrorMessage('');

        let idField = event.target.name;
        let idValue = event.target.value;
        setChangeFm(prevState => ({ ...prevState, [idField]: idValue }));
    }

    const setPreferDataHandler = (event) => {
        const value = event.target.value;
        setChangeFm(prevState => {
            const prefer = prevState.prefer.includes(value)
                ? prevState.prefer.filter(item => item !== value)
                : [...prevState.prefer, value];
            return { ...prevState, prefer };
        });
    }

    const changeformcheck = (event) => {
        event.preventDefault();
        const regExpEmail = /^\w{4,12}[@][A-Za-z]{2,8}[.][A-Za-z]{2,3}([.][A-Za-z]{2,3})?$/;
        const regExpTel = /^\w{2,3}[-][0-9]{3,4}[-][0-9]{4}$/;
        const regExpNike = /^[가-힣A-Za-z0-9]{2,16}$/;
        if (!changeFm.usernike) {
            setUsernikeErrorMessage('닉네임을 입력하세요.');
            return false;
        }

        if (!changeFm.usertel) {
            setUsertelErrorMessage('전화번호를 입력해주세요.');
            return false;
        }

        if (!changeFm.useremail) {
            setUseremailErrorMessage('이메일을 입력해주세요.');
            return false;
        }
        if(!regExpEmail.test(changeFm.useremail)){
            setUseremailErrorMessage("이메일 형식이 올바르지 않습니다.");
            return false;
        }
        if(!regExpTel.test(changeFm.usertel)){
            setUsertelErrorMessage("전화번호 형식이 올바르지 않습니다 (예: 000-0000-0000)");
            return false;
        }
        if(!regExpNike.test(changeFm.usernike)){
            setUsernikeErrorMessage("닉네임은 한글 또는 영문 숫자만 사용 가능, 2~16글자까지 허용 ");
            return false;
        }
        axios.post('http://192.168.0.62:20000/changeform1', {
            userid: userid,
            usernike: changeFm.usernike,
            usertel: changeFm.usertel,
            useremail: changeFm.useremail,
            prefer: changeFm.prefer
        })
        .then(function (response) {
            if (response.data.result === 1) {
                alert('회원정보가 수정되었습니다');
                window.location.href = '/profile';
            } else {
                alert('회원정보 수정 실패하였습니다');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div id="changeform">
            <div id='menu'>
                <ul>
                    <div>마이페이지</div>
                    <li><a href='/profile'>프로필</a></li>
                    <li><a href='/mycommunitylist'>나의 커뮤니티</a></li>
                    <li><a href='/inquiry'>1대1 문의하기</a></li>
                    <li><a href='/inquirydetailslist'>1대1 문의내역</a></li>
                </ul>
                <ul>
                    <div>회원정보</div>
                    <li><a href='/changeform' id='oppg'>회원정보변경</a></li>
                    <li><a href='/modifypwd'>비밀번호변경</a></li>
                </ul>
            </div>
            <div id='content'>
                <div id='changefm'>
                    <p>회원정보 수정</p>
                    <form onSubmit={changeformcheck}>
                        <div >
                            
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder='닉네임' 
                                id="usernike"
                                name="usernike"
                                value={changeFm.usernike}  
                                onChange={setChangeform}
                            />
                            <div className='Error-message'>{usernikeErrorMessage}</div>
                        </div>
                        <div>
                            
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder='전화번호' 
                                id="usertel"
                                name="usertel"
                                value={changeFm.usertel} 
                                onChange={setChangeform}  
                            />
                            <div className='Error-message'>{usertelErrorMessage}</div>
                        </div>
                        <div>
                            
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder='이메일' 
                                id="useremail"
                                name="useremail"
                                value={changeFm.useremail} 
                                onChange={setChangeform}  
                            />
                            <div className='Error-message'>{useremailErrorMessage}</div>
                        </div>
                        <div className='bt'>
                            <button type="submit" className="btn btn-dark">회원정보 수정하기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Changeform;