import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../css/Likelist.css';

function Likelist() {
    let wordCut = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };
    const userid = localStorage.getItem('userid');

    const [likelist, setLikelist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // 페이지당 항목 수

    const ismounted = useRef(false);
    useEffect(() => {
        if (!ismounted.current) {
            ismounted.current = true;
            getLikelist();
        }
    }, [currentPage]);

    function getLikelist() {
        axios.post('http://192.168.0.62:20000/likelist',{
            userid:userid

        })
            .then(function (response) {
                console.log(response.data);
                setLikelist(response.data.result);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    
    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // 현재 페이지에 해당하는 항목들 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = likelist.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(likelist.length / itemsPerPage);

    return (
        <div id='likelist'>
            <div id='menu'>
                <ul>
                    <div>마이페이지</div>
                    <li><a href='/profile'>프로필</a></li>
                    <li><a href='/mycommunitylist' id='oppg'>나의 커뮤니티</a></li>
                    <li><a href='/inquiry'>1대1 문의하기</a></li>
                    <li><a href='/inquirydetailslist'>1대1 문의내역</a></li>
                </ul>
                <ul>
                    <div>회원정보</div>
                    <li><a href='/changeform'>회원정보변경</a></li>
                    <li><a href='/modifypwd'>비밀번호변경</a></li>
                </ul>
            </div>
            <div id='content'>
                <div className="container">
                    <div id="cnmenu">
                        <p><a href='/mycommunitylist'>내가 쓴 글</a></p>
                        <p><a href='/likelist'>좋아요한 글</a></p>
                        <p><a href='/scrap'>스크랩한 글</a></p>
                    </div>
                    <div id='name1' className="row">
                        <div className="col col-lg-2 p-2">번호</div>
                        <div className="col col-lg-5 p-2">제목</div>
                        <div className="col col-lg-2 p-2">글쓴이</div>
                        <div className="col col-lg-3 p-2">등록일</div>
                    </div>
                    {
                        currentItems.map((record) => {
                            return (
                                <div className="row" style={{ borderBottom: '1px solid #ccc' }} key={record.post_index}>
                                    <div className="col col-lg-2 p-2">{record.post_index}</div>
                                    <div className="col col-lg-5 p-2" style={wordCut}><a id='sub' href={`/communityView/${record.post_index}`}>{record.subject}</a></div>
                                    <div className="col col-lg-2 p-2">{record.userid}</div>
                                    <div className="col col-lg-3 p-2">{record.writedate}</div>
                                </div>
                            );
                        })
                    }
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            &lt;
                        </button>
                        <span>{currentPage} / {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Likelist;