import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import '../css/communityForm.css';
import axios from 'axios';

export const filesName = [];
export let num = 0;

const Uploader = ({ onFilesChange, setCommunityFormData }) => {
    const [fileList, setFileList] = useState([]);
    let inputRef;

    const saveImage = async (e) => {
        e.preventDefault();
        const tmpFileList = [];
        const files = e.target.files;

        if (files) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            try {
                const response = await axios.post('http://localhost:20000/uploadFilesToPublicImg', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const imageUrls = response.data.files.map(file => file.filePath);
                imageUrls.forEach(url => filesName.push(url));
                onFilesChange(filesName);

                for (let i = 0; i < files.length; i++) {
                    const preview_URL = URL.createObjectURL(files[i]);
                    const fileType = files[i].type.split("/")[0];
                    tmpFileList.push({
                        fileObject: files[i],
                        preview_URL: preview_URL,
                        type: fileType,
                    });
                }

                setFileList([...fileList, ...tmpFileList]); // 가장 최근 파일이 아래로 추가됨
            } catch (error) {
                console.error('파일 업로드 중 오류 발생:', error);
                alert('파일 업로드 실패');
            }
        }
    };

    const deleteImage = (index) => {
        const tmpFileList = [...fileList];
        filesName.splice(index, 1);
        tmpFileList.splice(index, 1);
        setFileList(tmpFileList);
        onFilesChange(filesName);
    }

    useEffect(() => {
        return () => {
            fileList?.forEach((item) => {
                URL.revokeObjectURL(item.preview_URL);
            })
        }
    }, [fileList]);

    const handleContentChange = (index, event) => {
        setCommunityFormData({
            target: {
                name: `contents_${index}`,
                value: event.target.value
            }
        });
    };

    return (
        <div className="uploader-wrapper">
            <input
                type="file" multiple={true} accept="video/*, image/*"
                onChange={saveImage}
                onClick={(e) => e.target.value = null}
                ref={refParam => inputRef = refParam}
                style={{display: "none"}}
            />
            <div className="community-edit">
                <div className="community-edit-upload">
                    <br />
                    <h4>커뮤니티 메인 화면에 보여질 대표 사진을 업로드하세요.</h4>
                    <input type="button" value="사진첨부" className="community-edit-upload-button" onClick={() => {inputRef.click();}} />
                    <br/>
                </div>
            </div>
            <div className="content-update">
                {fileList?.map((item, index) => (
                    <div className="community-section mb-8" key={index}>
                        <button type="button" className="community-edit-delete" onClick={() => deleteImage(index)}>
                            <span><RiDeleteBinLine size='25'/></span>
                        </button>
                        <img className="output-image" id={`img_${index}`} src={item.preview_URL} alt="preview"/>
                        <div className="inspiration-tabs--room">   
                            <textarea id={`contents_${index}`} name={`contents_${index}`} className="community-form-textarea" rows="5"
                                placeholder="+ 내용을 입력하세요." onChange={(e) => handleContentChange(index, e)} required>
                            </textarea>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Uploader;
