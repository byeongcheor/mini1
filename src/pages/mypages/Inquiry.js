import '../../css/Inquiry.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
function Inquiry(){
    const [formData, setFormData] = useState({
        subject: '',
        content: ''
    }); //문의제목, 문의 내용
   const userid = localStorage.getItem('userid');
    const setInquiryFormData = (event)=>{
       
        //이벤트가 발생한 input에서 name과 value얻어오기
        let idField = event.target.name;
        let idValue = event.target.value;
       
        setFormData(p=>{return {...p, [idField]:idValue}});
        
        console.log(formData);
    }
    function newsFormCheck(event){
        event.preventDefault();//기본 이벤트 제거

        // 문의제목 입력유무 확인
        if(formData.subject==null || formData.subject==''){
            alert('제목을 입력하세요.');
            return false;
        }
       axios.post('http://192.168.0.62:20000/inquiry',{
        subject : formData.subject,
        content : formData.content ,
       userid: userid 
    })
    .then(function(response){
        console.log(response.data);
        if(response.data.result==1){
            //등록성공 -> 뉴스목록으로 이동
            window.location.href='/profile';
        }else{
            //등록실패
            alert("문의등록실패하였습니다.")
        }
    })
    .catch(function(error){
        console.log(error);
    });
    

    
    }
    return(
       
        <div id='inquiry'>
            <div id='menu'>
                <ul>
                   <div>마이페이지</div>     
                    <li><a href='/profile'>프로필</a></li>
                    <li><a href='/mycommunitylist'>나의 커뮤니티</a></li>
                    <li><a href='/inquiry' id='oppg'>1대1 문의하기</a></li>
                    <li><a href='/inquirydetailslist'>1대1 문의내역</a></li>
                </ul>
                <ul>
                    <div>회원정보</div>
                    <li><a href='/changeform'>회원정보변경</a></li>
                    <li><a href='/modifypwd'>비밀번호변경</a></li>
                </ul>
            </div>
          
            <div id='content1'>
            
                <div id='main' >
                    <div className='contenT'>
                    <p id='iq1'>1:1문의하기</p>
                    
                    </div>
                    <form className='contentF' onSubmit={newsFormCheck}>
                        <div className="mb-3" id='subject'>
                        
                            <input type="text" className="form-control " id='subject'
                                placeholder="글제목입력" name="subject"
                                value={formData.subject || ''}
                                onChange={setInquiryFormData}/>
                        </div>
                        <div className="mb-3"id='content'>
                            <textarea  className="form-control " 
                                 name="content"  value={formData.content || ''}
                                onChange={setInquiryFormData}> 

                                </textarea>
                            
                        </div>
                        <div id='button3'>
                        <button type="submit" >문의등록</button>
                        </div>
                    </form>
                    
                    </div>

                </div>
        </div>
        

      
    );



}export default Inquiry;