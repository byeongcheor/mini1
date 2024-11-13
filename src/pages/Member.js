import React, { useState } from 'react';
import axios from 'axios';
import loginimg from '../img/login.jpg';
import './../css/Member.css';


function Member() {
    const [formData, setFormData] = useState({});
    const [preferData, setPreferData] = useState({});
    const [errorMessages, setErrorMessages] = useState({
        userid: '',
        userpwd: '',
        username: '',
        useremail: '',
        usernike: '',
        usertel: '',
        zipcode: '',
        useraddr: ''
    });

    const setMemberData = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrorMessages(prev => ({ ...prev, [name]: '' }));
    };

    const setPreferDataHandler = (event) => {
        const { name, checked, value } = event.target;
        setPreferData(prev => {
            if (checked) {
                return { ...prev, [name]: value };
            } else {
                const updatedData = { ...prev };
                delete updatedData[name];
                return updatedData;
            }
        });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};
        const regExpIdPwd = /^[A-Za-z0-9_]{8,20}$/;
        const regExpName = /^[가-힣A-Za-z]{2,16}$/;
        const regExpEmail = /^\w{4,12}[@][A-Za-z]{2,8}[.][A-Za-z]{2,3}([.][A-Za-z]{2,3})?$/;
        const regExpTel = /^\w{2,3}[-][0-9]{3,4}[-][0-9]{4}$/;

        if (!formData.userid || !regExpIdPwd.test(formData.userid)) {
            errors.userid = '아이디는 영대소문자, 숫자, _만 허용, 8~20자리까지입니다.';
            isValid = false;
        }

        if (!formData.userpwd || !regExpIdPwd.test(formData.userpwd)) {
            errors.userpwd = "비밀번호는 대소문자영문,숫자,특수문자는 _ . , !만 사용 가능합니다.";
            isValid = false;
        }

        if (!formData.username || !regExpName.test(formData.username)) {
            errors.username = "이름은 한글 또는 영문만 사용 가능, 2~16글자까지 허용";
            isValid = false;
        }

        if (!formData.useremail || !regExpEmail.test(formData.useremail)) {
            errors.useremail = "이메일 형식이 올바르지 않습니다";
            isValid = false;
        }

        if (!formData.usernike || !regExpName.test(formData.usernike)) {
            errors.usernike = "닉네임은 한글 또는 영문만 사용 가능, 2~16글자까지 허용";
            isValid = false;
        }

        if (!formData.usertel || !regExpTel.test(formData.usertel)) {
            errors.usertel = "전화번호 형식이 올바르지 않습니다 (예: 000-0000-0000)";
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    }

    const membercheck = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const preferValues = Object.values(preferData); // preferData에서 값만 추출

        const submissionData = {
            ...formData,
            prefer: preferValues // 서버로 전송할 데이터에 값만 포함
        };

        console.log("Submitting data:", submissionData); // 전송 데이터 확인

        axios.post("http://localhost:20000/join", submissionData)
            .then(response => {
                if (response.data.result === 1) {
                    window.location.href = '/login';
                } else {
                    alert("등록 실패하였습니다.");
                }
            })
            .catch(error => {
                console.error("Registration error:", error);
            });
    };
    return (
        <div id='memberbody'>
            <div className='memberImg'>
                <img src={loginimg} alt="login.jpg" />
                <div className='mainM'>
                <div className='mainForm'> 
                    <div id='Mem' >
                        <div id='memmenu'><a href='/login'>돌아가기</a> <p>회원가입</p></div>
                        <form onSubmit={membercheck} className='Login-form-center'>
                            <div className="mb-3 mt-5" >
                                
                                <input type="text" className="form-control" placeholder="아이디 입력"id="userid"
                                    name="userid"
                                    value={formData.userid || ''}
                                    onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.userid}</div>
                            </div>
                            <div className="mb-3">
                                
                                <input type="password" className="form-control"  placeholder="비밀번호 입력(영문,숫자,특수문자포함 8자리 이상)" id="userpwd"
                                    name="userpwd"
                                    value={formData.userpwd || ''} onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.userpwd}</div>
                            </div>
                            <div className="mb-3">
                                
                                <input type="text" className="form-control" placeholder="이름 입력"id="username"
                                    name="username"
                                    value={formData.username || ''} onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.username}</div>
                            </div>
                            <div className="mb-3">
                                
                                <input type="text" className="form-control"placeholder="이메일 입력" id="useremail"
                                    name="useremail"
                                    value={formData.useremail || ''} onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.useremail}</div>
                            </div>
                            <div className="mb-3">
                                
                                <input type="text" className="form-control"  placeholder="닉네임 입력" id="usernike"
                                    name="usernike"
                                    value={formData.usernike || ''} onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.usernike}</div>
                            </div>
                            <div className="mb-3">
                                
                                <input type="text" className="form-control"  placeholder="전화번호 입력" id="usertel"
                                    name="usertel"
                                    value={formData.usertel || ''} onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.usertel}</div>
                            </div>
                            <div className="mb-3">
                                
                                <input type="int" className="form-control"   placeholder="우편번호 입력" id="zipcode"
                                    name="zipcode"
                                    value={formData.zipcode || ''} onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.zipcode}</div>
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="주소 입력" id="useraddr"
                                    name="useraddr"
                                    value={formData.useraddr || ''} onChange={setMemberData} />
                                <div className='Error-message'>{errorMessages.useraddr}</div>
                            </div>
                            
                            <div className='button'>
                                <button type="submit" className="btn btn-dark">회원등록</button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Member;