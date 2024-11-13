import React, { useState } from 'react';
import axios from 'axios';
import './../css/LoginStyle.css';
import './../css/findid.css';
import loginimg from '../img/login.jpg';
function FindId() {
    const [formData, setFormData] = useState({});
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [usertelErrorMessage, setUsertelErrorMessage] = useState('');

    const setFindIdData = (event) => {
        setUsernameErrorMessage('');
        setUsertelErrorMessage('');
        let idField = event.target.name;
        let idValue = event.target.value;
        setFormData(p => ({ ...p, [idField]: idValue }));
        console.log(formData);
    }

    const findIdcheck = (event) => {
        event.preventDefault();

        if (formData.username == null || formData.username === '') {
            setUsernameErrorMessage('이름을 입력하세요.');
            return false;
        }
        if (formData.usertel == null || formData.usertel === '') {
            setUsertelErrorMessage('휴대전화번호를 입력하세요.');
            return false;
        }

        axios.post('http://localhost:20000/findId', {
            username: formData.username,
            usertel: formData.usertel
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.result && response.data.result.length > 0) {
                alert(formData.username + "님의 아이디는 " + response.data.result + "입니다.");
                window.location.href = '/login'; 
                
            } else {
                alert("일치하는 회원정보가 없습니다.");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div id='findidbody'>
            <div className='findImg'>
                <img src={loginimg} alt="login.jpg" />
                <div className='findMain'>
                    <div id='Fid' className='Login-form-center'>

                        <div id='menu'><a href='/login'>돌아가기</a><p>아이디찾기</p></div>
                        <form onSubmit={findIdcheck}>
                            <div className="mb-3 mt-5">

                                <input type="text" className="form-control" id="username" name="username"
                                    value={formData.username || ''} onChange={setFindIdData} placeholder="이름" />
                                <div className='Error-message'>{usernameErrorMessage}</div>
                            </div>
                            <div className="mb-3">

                                <input type="text" className="form-control" id="usertel" name="usertel"
                                    placeholder="휴대전화"
                                    value={formData.usertel || ''} onChange={setFindIdData} />
                                <div className='Error-message'>{usertelErrorMessage}</div>
                            </div>
                            <div className='button'>
                                <button type="submit" className="btn btn-dark">다음</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default FindId;