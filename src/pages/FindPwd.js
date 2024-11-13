import React,{useState} from 'react';
import axios from 'axios';
import './../css/LoginStyle.css';
import './../css/findpwd.css';
import loginimg from '../img/login.jpg';


function FindPwd(){
    const [formData, setFormData] = useState({});
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [usertelErrorMessage, setUsertelErrorMessage] = useState('');
    const [useridErrorMessage, setUseridErrorMessage] = useState('');
    const [pwdErrorMessage, setPwdErrorMessage] = useState('');
    const [pwd2ErrorMessage, setPwd2ErrorMessage] = useState('');
    const [pwd, setPwd] = useState(0);

    const setFindPwdData = (event) => {
        setUseridErrorMessage('');
        setUsernameErrorMessage('');
        setUsertelErrorMessage('');
        setPwdErrorMessage('');
        setPwd2ErrorMessage('');
        let idField = event.target.name;
        let idValue = event.target.value;
        setFormData(p => { return { ...p, [idField]: idValue } });
    }

    function findPwdcheck(event) {
        event.preventDefault();

        if (formData.userid == null || formData.userid == '') {
            setUseridErrorMessage('아이디을 입력하세요.');
            return false;
        }

        axios.post('http://localhost:20000/findPwd', {
            userid: formData.userid
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.result == formData.userid) {
                setPwd(1);
                ///  /id
                console.log(pwd);
            } else {
                alert("일치하는 회원정보가 없습니다.");
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    function findPwdcheck2(event) {
        event.preventDefault();

        if (formData.username == null || formData.username == '') {
            setUsernameErrorMessage('이름을 입력하세요.');
            return false;
        }
        if (formData.usertel == null || formData.usertel == '') {
            setUsertelErrorMessage('휴대전화번호를 입력하세요.');
            return false;
        }
        
        axios.post('http://localhost:20000/findId', {
            username: formData.username,
            usertel: formData.usertel
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.result && response.data.result.length !== 0) {
                setPwd(2);
            } else {
                alert("회원정보가 잘못되었습니다.");
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    function findPwdcheck3(event) {
        event.preventDefault();
        if (formData.userpwd == null || formData.userpwd == '') {
            setPwdErrorMessage('비밀번호를 입력하세요.');
            return false;
        }
        if (formData.userpwd2 != formData.userpwd) {
            setPwd2ErrorMessage('비밀번호가 다릅니다.');
            return false;
        }
        
        axios.post('http://localhost:20000/findPwd2', {
            userid: formData.userid,
            userpwd: formData.userpwd
        }).then(function (response) {
            if (response.data.result == 1) {
                alert('비밀번호가 변경되었습니다.');
                window.location.href = '/login';
            } else {
                alert('변경을 실패하였습니다.');
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div id='findpwdbody'>
            <div className='findImg'>
                <img src={loginimg} alt="login.jpg" />
                <div className='findMain'>
                <nav >{pwd == 0 && (
                    <div className='Login-form-center Fpwd1'>
                        <div id='menu'><a href='/login'>돌아가기</a><p>비밀번호찾기</p></div>

                        <form onSubmit={findPwdcheck}>
                            <div className="mb-3 mt-5">

                                <input type="text" className="form-control" id="userid" name="userid"
                                    value={formData.userid || ''} onChange={setFindPwdData} placeholder="찾을 아이디" />
                                <div className='Error-message'>{useridErrorMessage}</div>
                            </div>
                            <div className='button'>
                                <button type="submit" className="btn btn-dark">다음</button>
                            </div>
                        </form>
                    </div>)}
                    {pwd == 1 && <div className='Login-form-center Fpwd2'>
                        <div className='menu1'><a href='/login'>돌아가기</a><p>비밀번호찾기</p></div>

                        <form onSubmit={findPwdcheck2}>
                            <div className="mb-3 mt-5" id='idinput'>

                                <input type="text" className="form-control" id="username" name="username"
                                    placeholder="이름:"
                                    value={formData.username || ''} onChange={setFindPwdData} />
                                <div className='Error-message'>{usernameErrorMessage}</div>
                            </div>
                            <div className="mb-3">

                                <input type="text" className="form-control" id="usertel" name="usertel"
                                    placeholder="휴대전화"
                                    value={formData.usertel || ''} onChange={setFindPwdData} />
                                <div className='Error-message'>{usertelErrorMessage}</div>
                            </div>
                            <div className='button'>
                                <button type="submit" className="btn btn-dark">다음</button>
                            </div>
                        </form>
                    </div>}
                    {pwd == 2 && (
                        <div className='Login-form-center Fpwd2'>
                            <div className='menu1'><a href='/login'>돌아가기</a><p>비밀번호변경</p></div>

                            <form onSubmit={findPwdcheck3}>
                                <div className="mb-3">

                                    <input type="password" className="form-control" id="userpwd"
                                        placeholder="새 비밀번호:"
                                        name="userpwd"
                                        value={formData.userpwd || ''} onChange={setFindPwdData} />
                                    <div className='Error-message'>{pwdErrorMessage}</div>
                                </div>
                                <div className="mb-3">

                                    <input type="password" className="form-control" id="userpwd2"
                                        placeholder="새 비밀번호 확인:"
                                        name="userpwd2"
                                        value={formData.userpwd2 || ''} onChange={setFindPwdData} />
                                    <div className='Error-message'>{pwd2ErrorMessage}</div>
                                </div>
                                <div className='button'>
                                    <button type="submit" className="btn btn-dark">비밀번호 변경</button>
                                </div>
                            </form>
                        </div>
                    )}
                </nav>
                </div>
            </div>
        </div>
    )
}
export default FindPwd;