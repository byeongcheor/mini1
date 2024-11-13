import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../css/Profile.css';

function Profile() {
  const defaultImgUrl = "https://via.placeholder.com/250"; // 디폴트 사진 URL을 여기에 넣으세요
  const [uploadImgUrl, setUploadImgUrl] = useState(defaultImgUrl);
  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState('');
  const [usernike, setUsernike] = useState(''); // 사용자 이름을 저장할 상태
  const userid = localStorage.getItem('userid'); // 로컬 스토리지에서 userid 값 가져오기
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedImageUrl = localStorage.getItem('profileImageUrl');

    if (savedImageUrl) {
      setUploadImgUrl(`http://192.168.0.62:20000${savedImageUrl}`);
    }

    if (userid) {
      // 서버에 요청을 보내서 사용자 이름을 가져옴
      axios.get(`http://192.168.0.62:20000/getUsername?userid=${userid}`)
        .then(response => {
          setUsername(response.data.username);
          setUsernike(response.data.usernike);
          if (response.data.profileImageUrl) {
            setUploadImgUrl(`http://192.168.0.62:20000${response.data.profileImageUrl}`);
          }
        })
        .catch(error => {
          console.error('Error fetching username:', error);
        });
    }
  }, [userid]);

  const onchangeImageUpload = (e) => {
    const { files } = e.target;
    const uploadFile = files[0];

    // 파일 선택이 취소된 경우
    if (!uploadFile) {
      const savedImageUrl = localStorage.getItem('profileImageUrl');
      if (savedImageUrl) {
        setUploadImgUrl(`http://192.168.0.62:20000${savedImageUrl}`);
      } else {
        setUploadImgUrl(defaultImgUrl);
      }
      return;
    }

    setSelectedFile(uploadFile);

    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onloadend = () => {
      setUploadImgUrl(reader.result);
    };
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profileImage', selectedFile);
    formData.append('userid', userid);

    try {
      const response = await axios.post('http://192.168.0.62:20000/uploadProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = response.data.profileImageUrl;
      setUploadImgUrl(`http://192.168.0.62:20000${imageUrl}`);
      localStorage.setItem('profileImageUrl', imageUrl);
      alert('프로필을 변경하였습니다');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('프로필 변경을 실패하였습니다');
    }
  };

  return (
    <div id='pfcontent'>
      <div id='menu'>
        <ul>
          <div>마이페이지</div>
          <li><a href='/profile' id='oppg'>프로필</a></li>
          <li><a href='/mycommunitylist'>나의 커뮤니티</a></li>
          <li><a href='/inquiry'>1대1 문의하기</a></li>
          <li><a href='/inquirydetailslist'>1대1 문의내역</a></li>
        </ul>
        <ul>
          <div>회원정보</div>
          <li><a href='/changeform'>회원정보변경</a></li>
          <li><a href='/modifypwd'>비밀번호변경</a></li>
        </ul>
      </div>
      <div id='test'>
        <div id='profile' className='profile-container'>
          <p className='profileP'>{username}님 환영합니다!</p> {/* 서버에서 가져온 사용자 이름 표시 */}
          <img src={uploadImgUrl} alt="Profile" className="profile-image" />
          <input
            type="file"
            accept="image/*"
            onChange={onchangeImageUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <div>
            <button onClick={handleSave} className="save-button">사진변경</button>
          </div>
           <button
            className="changeimg"
            onClick={() => fileInputRef.current.click()}>
            사진선택
          </button>
          <div id='nike'>{usernike}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;