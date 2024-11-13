// import '../App.css';
import { useState } from 'react';
import '../css/Search.css';
import img from "../img/search.png";
import axios from 'axios';


function Search() {
    var [formData, setFormData] = useState({});
    var [inputErrorMessage, setInputErrorMessage] = useState('');

    const setSearchFormData = (event) => {
        setInputErrorMessage('');

        let inputfield = event.target.name;
        let inputvalue = event.target.value;

        setFormData(p => { return { ...p, [inputfield]: inputvalue } });

        console.log(formData);
    }

    function searchContents(event) {
        event.preventDefault();
        if (formData.search == null || formData.search == '') {
            setInputErrorMessage('검색어를 입력하세요.');
            return false;
        }

        window.location.href = '/searchresult/'+ formData.search;

    }
    return (
        <div className="Click_search">
            <form onSubmit={searchContents}>
                <div className="SearchBox">
                    <div className='Close'>
                        {/* <input type = "button" value = 'x'  ></input> */}
                    </div>
                    <h2 className='searchH2'>Search</h2>
                    <div className="SearchContent">
                        <input type="text" placeholder='검색어를 입력하세요' id="search"
                            name="search" value={formData.search || ''} onChange={setSearchFormData} />
                        <button type = "submit" className="SearchBtn"><img src={img} alt="검색" /></button>
                    </div>
                    <div className='Error-message'>{inputErrorMessage}</div>
                </div>
            </form>

        </div>
    );
}

export default Search;
