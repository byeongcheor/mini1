import React, { useState } from 'react';
import '../../css/Modifypwd.css';

import axios from 'axios';
function Modifypwd() {
    const [formData,setFormData] = useState({});
    const [pwdErrorMessage, setPwdErrorMessage] = useState('');
    const [pwd2ErrorMessage, setPwd2ErrorMessage] = useState('');
    const userid = localStorage.getItem('userid');
   
        const setModifyPwdData = (event) => {
            setPwdErrorMessage('');
            setPwd2ErrorMessage('');

            let idField = event.target.name;
            let idValue = event.target.value;
            setFormData(p => { return { ...p, [idField]: idValue } });
        }


        function modifypwdcheck(event){
            event.preventDefault();
            if (formData.userpwd == null || formData.userpwd == '') {
                setPwdErrorMessage('비밀번호를 입력하세요.');
                return false;
            }
            if (formData.userpwd2 != formData.userpwd) {
                setPwd2ErrorMessage('비밀번호가 다릅니다.');
                return false;
            }
            axios.post('http://192.168.0.62:20000/findPwd2', {
                userid: userid,
                userpwd: formData.userpwd
            }).then(function (response) {
                if (response.data.result == 1) {
                    alert('비밀번호가 변경되었습니다.');
                    window.location.href = '/profile';
                } else {
                    alert('변경을 실패하였습니다.');
                }
            }).catch(function (error) {
                console.log(error);
            });


        }
        return (
            <div id="changepwd">
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
                        <li><a href='/changeform'>회원정보변경</a></li>
                        <li><a href='/modifypwd' id='oppg'>비밀번호변경</a></li>
                    </ul>
                </div>
                <div id='content'>
                    <div >
                        <p>비밀번호변경</p>
                        <form onSubmit={modifypwdcheck}>
                            <div >
                                
                                <input type="password" className="form-control"  id="userpwd"
                                    name="userpwd" placeholder="새 비밀번호(비밀번호는 대소문자영문,숫자,특수문자는 _ . , !만 사용 가능합니다.)"
                                    value={formData.userpwd || ''} onChange={setModifyPwdData} 
                                />
                                   <div className='Error-message'>{pwdErrorMessage}</div>
                                <div className='Error-message'></div>
                            </div>
                            <div>
                                
                                <input type="password" className="form-control" id="userpwd2"
                                    name="userpwd2" placeholder="새 비밀번호 확익(비밀번호는 대소문자영문,숫자,특수문자는 _ . , !만 사용 가능합니다.)"
                                    value={formData.userpwd2 || ''} onChange={setModifyPwdData}  />
                                <div className='Error-message'>{pwd2ErrorMessage}</div>
                            </div>
                            <div className='button'>
                                <button type="submit" className="btn btn">비밀번호 변경</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    
    export default Modifypwd;