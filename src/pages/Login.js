import React, { useState } from 'react';
import loginlogo2 from '../img/loginLogo2.png';
import './../css/Login.css';
import axios from 'axios';
import loginimg from '../img/login.jpg';

function Login() {
    //아이디, 비밀번호를 보관할 useState훅 변수 선언
    const [formData, setFormData] = useState({}); //아이디, 비밀번호 {userid:'abcd', userpwd:'1234'}
    //아이디 에러메시지 변수
    const [idErrorMessage, setIdErrorMessage] = useState('');
    //비밀번호 에러메시지 변수
    const [pwdErrorMessage, setPwdErrorMessage] = useState('');

    //폼의 값이 변경되면  hook에 값을 변경하는 작업을 수행한다.
    const setLoginFormData = (event) => {
        //기존에러 메시지 초기화
        setIdErrorMessage('');
        setPwdErrorMessage('');

        //이벤트가 발생한 input에서 name과 value얻어오기
        let idField = event.target.name;
        let idValue = event.target.value;

        //   setFormData(p=>{...p, userid:'abcd'})
        //   setFormData(p=>{...p, userpwd:'1234'})

        setFormData(p => { return { ...p, [idField]: idValue } });

        console.log(formData);
    }
    //아이디, 비밀번호 입력유무 확인
    function loginFormCheck(event) {
        event.preventDefault();//기본 이벤트 제거

        //아이디 입력유무 확인
        if (formData.userid == null || formData.userid == '') {
            setIdErrorMessage('아이디를 입력하세요.');
            return false;
        }
        // //유효성검사
        // let regExp = /^[A-Za-z0-9_]{8,12}$/;
        // if(!regExp.test(formData.userid)){
        //     setIdErrorMessage("아이디는 영대소문자, 숫자, _만허용, 8~12자리까지입니다.");
        //     return false;
        // }

        //비밀번호 입력유무 확인
        if (formData.userpwd == null || formData.userpwd == '') {
            setPwdErrorMessage('비밀번호를 입력하세요.');
            return false;
        }
        // 비동기식으로 서버에서 로그인 정보를 가져온다.

        axios.post('http://localhost:20000/login', {
            userid: formData.userid,
            userpwd: formData.userpwd
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.logState == 'Y') {
                    localStorage.setItem('logState', 'Y');
                    localStorage.setItem('userid', response.data.userid);
                    if (response.data.userid == "flower1234") {
                        window.location.href = '/root';
                    } else {

                        window.location.href = '/';
                    }

                } else {
                    alert("로그인 실패하였습니다.")

                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <div id='loginbody'>
            <div className='loginImg'>
                <img src={loginimg} alt="login.jpg" />
                <div className='loginForm'>
                    <div id='logo'><a href='/login'><img src={loginlogo2} alt="loginLogo2.png" /> </a></div>
                    <div id='Login' className='Login-form-center'>
                        <p>로그인</p>
                        <form onSubmit={loginFormCheck}>
                            <div className="mb-3 mt-3">

                                <input type="text" className="form-control" id="userid"
                                    placeholder="아이디입력" name="userid"
                                    value={formData.userid || ''}
                                    onChange={setLoginFormData}
                                />
                                <div className='Error-message'>{idErrorMessage}</div>
                            </div>
                            <div className="mb-3">

                                <input type="password" className="form-control" id="userpwd"
                                    placeholder="비밀번호입력" name="userpwd"
                                    value={formData.userpwd || ''}
                                    onChange={setLoginFormData}
                                />
                                <div className='Error-message'>{pwdErrorMessage}</div>
                            </div>
                            <div className='button'>
                                <button type="submit" className="btn btn-dark">Login</button>
                            </div>
                        </form>
                        <div id='find'>
                            <a href='/findId'>아이디찾기</a>/<a href='/findPwd'>비밀번호찾기</a>/<a href='/join'>회원가입</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;