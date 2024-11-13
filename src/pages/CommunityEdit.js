import React, { useState, useEffect, useRef } from 'react';
import { redirect, useParams } from "react-router-dom";
import '../css/communityForm.css';
import axios from 'axios';
import { FaChevronLeft } from "react-icons/fa";
import Uploader2, { filesName } from "./Uploader2.js";
import { RiDeleteBinLine } from "react-icons/ri";

const publicUrl = process.env.PUBLIC_URL + '/img/';
const userid=localStorage.getItem('userid');
let contentsValue = [];
let contentsImg = [];
let num = 0;

function CommunityEdit() {
    const [communityView, setCommunityView] = useState({});
    const [communityContent, setCommunityContent] = useState([]);
    const [formData, setFormData] = useState({}); 
    const { post_index } = useParams(); 
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            getCommunityView();
        }
    }, []);

    const setCommunityFormData = (event) => {
        let idField = event.target.name;
        let idValue = event.target.value;

        setFormData(prevData => ({
            ...prevData,
            [idField]: idValue
        }));

        console.log(formData);
    };

    const handleFilesChange = (files) => {
        files.forEach(file => contentsImg.push(file));
        setFormData(prevData => ({ ...prevData, files }));
    };

    const deleteImage = (index) => {
        // Update communityContent by filtering out the deleted index
        const updatedContent = communityContent.filter((item, idx) => idx !== index);
        setCommunityContent(updatedContent);
    
        // Create a new formData object
        const updatedFormData = { ...formData };
        
        // Remove the item from formData
        Object.keys(updatedFormData).forEach((key) => {
            if (key.startsWith('contents_') && parseInt(key.split('_')[1]) === index) {
                delete updatedFormData[key];
            } else if (key.startsWith('contents_')) {
                // Adjust keys for remaining items
                const currentIndex = parseInt(key.split('_')[1]);
                if (currentIndex > index) {
                    const newKey = `contents_${currentIndex - 1}`;
                    updatedFormData[newKey] = updatedFormData[key];
                    delete updatedFormData[key];
                }
            }
        });
    
        // Update contentsImg by removing the deleted index
        contentsImg.splice(index, 1);
        
        // Set the updated formData and contentsImg
        setFormData(updatedFormData);
    };

    function getCommunityView() {
        axios.get(`http://localhost:20000/communityView?post_index=${post_index}`)
            .then(function (response) {
                console.log(response.data);
                setCommunityView(response.data.record);
                setCommunityContent(response.data.records);
                initializeFormData(response.data.records);

                num = response.data.records.length;
                let records = response.data.records;
                for (let i in records) {
                    contentsValue.push(records[i].content);
                    contentsImg.push(records[i].img);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const initializeFormData = (records) => {
        const initialData = {};
        records.forEach((item, index) => {
            initialData[`contents_${index}`] = item.content;
        });
        setFormData(initialData);
    };

    function CommunityFormCheck(event) {
        event.preventDefault();
        var keys = Object.keys(formData);
        contentsValue = [];
        setCommunityContent(contentsValue);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.indexOf('contents') !== -1) {
                contentsValue.push(formData[key]);
            }
        }
        for (let i in filesName) {
            contentsImg.push(filesName[i]);
        }
        console.log(contentsImg);
        console.log(contentsValue);
        axios.post('http://localhost:20000/communityEditOk', {
            post_index: post_index,
            subject: communityView.subject,
            content: contentsValue,
            img: contentsImg
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.result === 1) {
                    window.location.href = '/community';
                } else {
                    alert("뉴스등록실패하였습니다.");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className='communityEdit-News-form-center'>
            <div className="communityEdit-back-link">
                <a href='/'>
                    <span className=""></span><FaChevronLeft />목록으로
                </a>
            </div>
            <form onSubmit={CommunityFormCheck}>
                <div className="communityEdit-mb-3 mt-3">
                    <input type="text" className="community-edit-input" id="subject"
                        placeholder="제목을 입력하세요" name="subject"
                        value={communityView.subject || ''}
                        onChange={setCommunityFormData}
                    />
                </div>

                <div className="content-update">
                    {communityContent?.map((item, index) => (
                        <div className="community-section mb-8" data-id="5981" key={index}>
                            <button type="button" className="community-edit-delete" onClick={() => { deleteImage(index) }}>
                                <span>< RiDeleteBinLine size='25' /></span>
                            </button>
                            <img className="output-image" id={`img_${index}`} src={publicUrl + `${item.img}`} alt="content" />
                            <div className="inspiration-tabs--room">
                                <textarea id={`contents_${index}`} name={`contents_${index}`} className="community-form-textarea" rows="5"
                                    placeholder="+ 내용을 입력하세요." value={formData[`contents_${index}`] || ''}
                                    onChange={setCommunityFormData} required>
                                </textarea>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="communityform-update" id="content_0" name="content_0" value={formData.content || ''}
                    onChange={setCommunityFormData} >
                    <Uploader2 onFilesChange={handleFilesChange} />
                </div>

                <div className="community-edit-toolbar" >
                    <button className="community-edit-upload-button" id="submit" type="submit">작성완료</button>
                </div>
            </form>

        </div>
    );
}
export { num };
export default CommunityEdit;
