import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../css/Root.css';

function Root() {
    const [root, setRoot] = useState([]);
    const [answerindex, setAnswerIndex] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedByAnswer, setSortedByAnswer] = useState(false); // 정렬 상태 추가
    const [sortedByDate, setSortedByDate] = useState(false); // 날짜 정렬 상태 추가
    const itemsPerPage = 15; // 페이지당 항목 수
    const ismounted = useRef(false);
    
    useEffect(() => {
        if (!ismounted.current) {
            ismounted.current = true;
            getRoot();
        }
    }, [currentPage]);

    function getRoot() {
        axios.post("http://192.168.0.62:20000/rootlist")
            .then(function (response) {
                console.log(response.data);
                setRoot(response.data.result);
                setAnswerIndex(response.data.answerindex.map(item => item.Inquiry_index));
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
    const currentItems = root.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(root.length / itemsPerPage);

    // 정렬 핸들러
    const handleSortByAnswer = () => {
        const sortedList = [...root].sort((a, b) => {
            const aAnswered = answerindex.includes(a.Inquiry_index);
            const bAnswered = answerindex.includes(b.Inquiry_index);
            if (sortedByAnswer) {
                return aAnswered === bAnswered ? 0 : aAnswered ? 1 : -1;
            } else {
                return aAnswered === bAnswered ? 0 : aAnswered ? -1 : 1;
            }
        });
        setRoot(sortedList);
        setSortedByAnswer(!sortedByAnswer);
    };

    const handleSortByDate = () => {
        const sortedList = [...root].sort((a, b) => {
            const dateA = new Date(a.writedate);
            const dateB = new Date(b.writedate);
            if (sortedByDate) {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
        setRoot(sortedList);
        setSortedByDate(!sortedByDate);
    };

    return (
        <div id="rootlist">
            <div id='menu'>
                <ul>
                    <div>문의내역</div>
                    <li><a href='/root'>1대1 문의답변</a></li>
                </ul>
                <ul>
                    <div>회원정보</div>
                    <li><a href='/memlist'>회원정보보기</a></li>
                </ul>
            </div>
            <div id='content'>
                <div className="container">
                    <h1>문의 내역</h1>
                    <div id='sorted'>
                        <button onClick={handleSortByAnswer}>정렬: {sortedByAnswer ? '접수중' : '답변완료'}</button>
                        <button onClick={handleSortByDate}>날짜순 정렬: {sortedByDate ? '오래된 순' : '최신 순'}</button>
                    </div>
                    <div id='name1' className="row">
                        <div className="col col-lg-2 p-2">번호</div>
                        <div className="col col-lg-4 p-2">제목</div>
                        <div className="col col-lg-2 p-2">아이디</div>
                        <div className="col col-lg-2 p-2">등록일</div>
                        <div className="col col-lg-2 p-2">답변여부</div>
                    </div>
                    {
                        currentItems.map((record) => {
                            return (
                                <div className="row" key={record.Inquiry_index}>
                                    <div className="col col-lg-2 p-2">{record.Inquiry_index}</div>
                                    <div className="col col-lg-4 p-2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <a id='sub' href={`/inquirydetails/${record.Inquiry_index}`}>{record.subject}</a>
                                    </div>
                                    <div className="col col-lg-2 p-2">{record.userid}</div>
                                    <div className="col col-lg-2 p-2">{record.writedate}</div>
                                    {answerindex.includes(record.Inquiry_index) ? (
                                        <div className="col col-lg-2 p-2">답변완료</div>
                                    ) : (
                                        <div className="col col-lg-2 p-2">접수중</div>
                                    )}
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

export default Root;