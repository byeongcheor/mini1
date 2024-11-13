import { redirect } from "react-router-dom";
import '../css/communityForm.css';
import '../css/community.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft } from "react-icons/fa";
import Uploader, { filesName } from "./Uploader.js";

let contentsValue = [];
let contentsLength = 0;

function CommunityForm(){
    const userid = localStorage.getItem('userid');
    const [formData, setFormData] = useState({});

    const setCommunityFormData = (event) => {
        let idField = event.target.name;
        let idValue = event.target.value;
        setFormData(p => ({ ...p, [idField]: idValue }));
        console.log(formData);
    }

    const handleFilesChange = (files) => {
        setFormData(p => ({ ...p, files }));
    }

    function CommunityFormCheck(event){
        event.preventDefault();
        if (formData.subject == null || formData.subject === '') {
            alert('제목을 입력하세요.');
            return false;
        }

        var keys = Object.keys(formData);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if(key.indexOf('contents') !== -1){
                contentsValue.push(formData[key]);
                contentsLength++;
            }
        }
        axios.post('http://localhost:20000/communityForm', {
            subject: formData.subject,
            img: filesName,
            content: contentsValue,
            userid: userid
        })
        .then(function(response){
            console.log(response.data);
            if(response.data.result === 1){
                window.location.href = '/community';
            } else {
                alert("뉴스 등록 실패하였습니다.");
            }
        })
        .catch(function(error){
            console.log(error);
        });
    }

    return (
        <div className='communityEdit-News-form-center'>
            <div className="communityEdit-back-link">
                <a href='/community'>
                    <FaChevronLeft/>목록으로
                </a>
            </div>
            <form onSubmit={CommunityFormCheck}>
                <div className="communityEdit-mb-3 mt-3">
                    <input type="text" className="community-edit-input" id="subject" placeholder="제목을 입력하세요" name="subject"
                        value={formData.subject || ''}
                        onChange={setCommunityFormData}
                    />
                </div>
                <Uploader onFilesChange={handleFilesChange} setCommunityFormData={setCommunityFormData} />
                <div className="community-edit-toolbar">
                    <button className="community-edit-upload-button" id="submit" type="submit">작성완료</button>
                </div>
            </form>
        </div>
    );
}
export default CommunityForm;
