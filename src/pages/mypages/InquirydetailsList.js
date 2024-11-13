import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../css/InquirydetailsList.css';

function Inquirydetailslist() {
    let wordCut = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };
    const userid = localStorage.getItem('userid');
    const [inquiryDetailsList, setInquiryDetailsList] = useState([]);
    const [answerIndex, setAnswerIndex] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedByAnswer, setSortedByAnswer] = useState(false); // 정렬 상태 추가
    const [sortedByDate, setSortedByDate] = useState(false); // 날짜 정렬 상태 추가
    const itemsPerPage = 15; // 페이지당 항목 수

    const ismounted = useRef(false);
    useEffect(() => {
        if (!ismounted.current) {
            ismounted.current = true;
            getInquirylist();
        }
    }, [currentPage]);

    function getInquirylist() {
        axios.get('http://192.168.0.62:20000/inquirydetailslist', {
            params: { userid: userid }
        })
            .then(function (response) {
                console.log(response.data);
                setInquiryDetailsList(response.data.result);
                setAnswerIndex(response.data.answerindex.map(item => item.Inquiry_index));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function delCheck(Inquiry_index) {
        if (window.confirm("삭제하시겠습니까?")) {
            axios.get(`http://192.168.0.62:20000/listDel?Inquiry_index=${Inquiry_index}`)
                .then(function (response) {
                    if (response.data.result === 1) { // 삭제됨 --> 목록 갱신
                        getInquirylist();
                    } else { // 삭제 실패
                        alert("글삭제 실패하였습니다.");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
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
    const currentItems = inquiryDetailsList.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(inquiryDetailsList.length / itemsPerPage);

    // 정렬 핸들러
    const handleSortByAnswer = () => {
        const sortedList = [...inquiryDetailsList].sort((a, b) => {
            const aAnswered = answerIndex.includes(a.Inquiry_index);
            const bAnswered = answerIndex.includes(b.Inquiry_index);
            if (sortedByAnswer) {
                return aAnswered === bAnswered ? 0 : aAnswered ? 1 : -1;
            } else {
                return aAnswered === bAnswered ? 0 : aAnswered ? -1 : 1;
            }
        });
        setInquiryDetailsList(sortedList);
        setSortedByAnswer(!sortedByAnswer);
    };

    const handleSortByDate = () => {
        const sortedList = [...inquiryDetailsList].sort((a, b) => {
            const dateA = new Date(a.writedate);
            const dateB = new Date(b.writedate);
            if (sortedByDate) {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
        setInquiryDetailsList(sortedList);
        setSortedByDate(!sortedByDate);
    };

    return (
        <div className='inquiryList'>
            <div id='inquirylist'>
                <div id='menu'>
                    <ul>
                        <div>마이페이지</div>
                        <li><a href='/profile'>프로필</a></li>
                        <li><a href='/mycommunitylist'>나의 커뮤니티</a></li>
                        <li><a href='/inquiry'>1대1 문의하기</a></li>
                        <li><a href='/inquirydetailslist' id='oppg'>1대1 문의내역</a></li>
                    </ul>
                    <ul>
                        <div>회원정보</div>
                        <li><a href='/changeform'>회원정보변경</a></li>
                        <li><a href='/modifypwd'>비밀번호변경</a></li>
                    </ul>
                </div>
                <div id='content'>
                    <div className="container">
                       
                        <div id='sorted'>
                        <button onClick={handleSortByAnswer}>정렬: {sortedByAnswer ? '접수중' : '답변완료'}</button>
                        <button onClick={handleSortByDate}>날짜순 정렬: {sortedByDate ? '오래된 순' : '최신 순'}</button>
                        </div>
                        <div id='name1' className="row">
                            <div className="col col-lg-2 p-2">번호</div>
                            <div className="col col-lg-6 p-2">제목</div>
                            <div className="col col-lg-2 p-2">문의상태</div>
                            <div className="col col-lg-2 p-2">등록일</div>
                        </div>
                        {
                            currentItems.map((record) => (
                                <div className="row" style={{ borderBottom: '1px solid #ccc' }} key={record.Inquiry_index}>
                                    <div className="col col-lg-2 p-2">{record.Inquiry_index}</div>
                                    <div className="col col-lg-6 p-2" style={wordCut}>
                                        <a id='sub' href={`/inquiryDetails/${record.Inquiry_index}`}>{record.subject}</a>
                                    </div>
                                    {answerIndex.includes(record.Inquiry_index) ? (
                                        <div className="col col-lg-2 p-2">답변완료</div>
                                    ) : (
                                        <div className="col col-lg-2 p-2">접수중</div>
                                    )}
                                    <div className="col col-lg-2 p-2">{record.writedate}</div>
                                </div>
                            ))
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
        </div>
        );
    }
    
    export default Inquirydetailslist;