import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import '../../css/test.css';

function Comment() {
  const userid = localStorage.getItem('userid');
  const post_index = 48;
  let [replies, setReplies] = useState([]);
  let [reply, setReply] = useState('');
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      getReplies();
    }
  }, []);

  function getReplies() {
    axios.get(`http://192.168.0.62:20000/postReplies?post_index=${post_index}`)
      .then(function (response) {
        setReplies(response.data.record);
      }).catch(function (error) {
        console.log(error);
      });
  }

  function handleReplySubmit(e) {
    e.preventDefault();
    axios.post(`http://192.168.0.62:20000/addComment`, {
      post_index: post_index,
      content: reply,
      userid: userid
    }).then(function (response) {
      setReply('');
      getReplies(); // 새로고침
    }).catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div id='test123'>
      {/* 댓글작성 */}
      <form onSubmit={handleReplySubmit}>
        <div className="form-group">
          <label htmlFor="reply">댓글작성</label>
          <textarea
            id="reply"
            className="form-control"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            required>
          </textarea>
        </div>
        <button type="submit" className="btn btn-primary">답변 제출</button>
      </form>
      {/* 댓글보기 */}
      <div>
        {replies.map((reply, index) => (
          <div key={index} className="reply">
            <div className="reply-header">
              <img src={reply.profileImageUrl} alt="Profile" className="profile-pic" />
              <div>{reply.userid}{reply.wri}</div>
            </div>
            <div className="reply-content">{reply.content}</div>
            <div className="reply-date">{reply.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;