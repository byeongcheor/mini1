import plant from './../img/plantTop.png';
import search from './../img/search.png';
import styles from '../css/Plantstart.css';
import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import ScrollToTopButton from '../ScrollToTopButton';
import axios from 'axios';

function Plantstart() {
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [plantList, setPlantList] = useState([]);
    const [searchResult, setSearchResult] = useState('');
    const [InputValue, setInputValue] = useState('');
    const [selectedPlants, setSelectedPlants] = useState([]);
    const [plantData, setPlantData] = useState([]);
    const [plants, setPlants] = useState([]);
    const [sortMethod, setSortMethod] = useState('name');
    const [Checked, setChecked] = useState([]);
    const [Filters, setFilters] = useState({
        plantOptions: [],
    });

    useEffect(() => {
        const height = document.querySelector('.topImg').offsetHeight;
        // console.log(height);
        let timer = setTimeout(() => {
            window.scrollTo({
                top: height,
                behavior: 'smooth',
            });
        },700);
    });


    const ismounted = useRef(false);
    useEffect(() => {
        if (!ismounted.current) {
            ismounted.current = true;
        } else {
            getPlantList();
        }
    }, []);
    const getPlantList = () => {
        axios.get('http://localhost:20000/plant')
            .then(response => {
                console.log(response.data);
                setPlantList(response.data.result);
                setFilteredResults(response.data.result);
            })
            .catch(error => {
                console.log(error);
            });
    };
    /////검색//////////////////////////
    useEffect(() => {
        if (searchInput !== '') {
            const filteredData = plantList.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase());
            });
            setFilteredResults(filteredData);
        } else {
            setFilteredResults(plantList);
        }
    }, [searchInput, plantList]);


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    };
    const performSearch = () => {
        if (searchInput) {
            setSearchResult(`${searchInput} 에 대한 검색 결과입니다.`);
        } else {
            setSearchResult('');
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        performSearch();
    };
    useEffect(() => {
        performSearch();
    }, [searchInput]);


    // 정렬 옵션이 변경될 때마다 식물 데이터를 가져오는 함수
    useEffect(() => {
        fetchPlants();
    }, [sortMethod]);

    // 백엔드 API에서 식물 데이터를 가져오는 함수
    const fetchPlants = async () => {
        try {
            const response = await axios.get(`http://localhost:20000/plant?sort=/${sortMethod}`);
            // console.log('API Response:', response.data); // 응답 데이터 확인
            if (Array.isArray(response.data.result)) {
                setPlants(response.data.result);
                // console.log("plants는", plants);
            } else {
                console.error('API response is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching plants:', error);
        }
    };

    // 정렬 옵션 변경 핸들러
    const handleSortChange = (event) => {
        setSortMethod(event.target.value);
    };
    //////////////////////////////////////////////////


    //////////////////////////////
    // 기능
    ////////////////////////////////

      
        // 체크박스를 토글하는 함수
        const handleToggle = (value) => {
            const currentIndex = Checked.indexOf(value);
            const newChecked = [...Checked];
    
            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }
    
            setChecked(newChecked);
            handleFilters(newChecked, "plantOptions");
        };
    
        const handleFilters = (filters, category) => {
            const newFilters = { ...Filters };
    
            newFilters[category] = filters;
            showFilteredResults(newFilters);
            setFilters(newFilters);
        };
    
        const plantOptions = [
            { planttype: 'AIR_PLANT', name: '공기정화' },
            { planttype: 'FOLIAGE', name: '관엽' },
            { planttype: 'GARDENS', name: '원예' },
            { planttype: 'SUCCULENTS', name: '다육' },
            { planttype: 'TRAILING_FOLIAGE', name: '행잉플랜트' },
            { planttype: 'TREE', name: '나무' },
            { planttype: 'ETC', name: '기타' }
        ];


        const showFilteredResults = (filters) => {
            axios.post('http://localhost:20000/plant',{
                filters : filters
            })
            .then(function(response){
                if (Array.isArray(response.data.result)) {
                    setPlants(response.data.result);
                    // console.log("plants는", plants);
                }
            })
            .catch(function(error){
                console.log(error);
            })
            
            console.log(filters);
        };
        useEffect(() => {

        }, [showFilteredResults]);
        

    
    /////////////////////////////////////////////


    return (
        <div className="Plant">

            <div className="page">
                <div className="pageTop">
                    <div className="topImg">
                        <img src={plant} alt="plantTop.png" />
                        <div className="pageTopText">
                            <h1>플랜트 케어</h1>
                            <p className="topText">
                                식물은 자연스러운 인테리어를 위해 빠질 수 없는 최고의 친구입니다.<br />
                                건강하고 멋진 식물을 위해 식물 관리 방법에 대해 알아볼까요?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <form id="list" className="pageMiddle" onSubmit={handleSubmit}>
                <div id="filter" className="pageFilter">
                    <div className="search">
                        <div className='search2' >
                            <img src={search} alt="search.png" />
                            <input
                                type="text"
                                name="searchInput"
                                id="searchInput"
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="검색어를 입력하세요"
                                minLength="1"
                                maxLength="20"
                                value={searchInput}
                            />

                        </div>
                        <div className='searchCheck'>
                            <div className='searchCheck2'>
                                <div className='filterTitle'>식물종류</div>
                            </div>
                            <div className='plantType'>
                                <ul>
                                    {plantOptions.map((plant) => (
                                        <li key={plant.id}>
                                            <div className='checkBox'>
                                                <input
                                                    type="checkbox"
                                                    name="planttype"
                                                    value={plant.planttype}
                                                    id={plant.planttype}
                                                    onChange={() => handleToggle(plant.planttype)}
                                                    checked={Checked.indexOf(plant.planttype) !== -1}
                                                />
                                                <label htmlFor={plant.planttype}>{plant.name}</label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='middleTop'>
                    <div className='filterResult'>
                        <div>
                        </div>
                        <div className='product_order'>
                            <span className='text-dark'>정렬</span>
                            <select id="sortSelect" value={sortMethod} onChange={handleSortChange}>
                                <option value="name">가나다순</option>
                                <option value="difficulty">난이도순</option>
                            </select>
                        </div>
                    </div>
                    <div className='plantCareWrap'>
                        <div className='plantWrap'>
                            {searchInput.length > 0 ? (
                                filteredResults.map((result) => (
                                    <div className='plantCnt' key={result.plant_index}>
                                        <div className='plantimg'>
                                            <a href={`/plantcare/${result.plant_index}`}>
                                                <img src={process.env.PUBLIC_URL + `${result.img}`} alt={result.plantkor} />
                                            </a>
                                        </div>
                                        <div className='plantTitle'>
                                            <h3 className='plantName1'>{result.plantkor}</h3>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                Array.isArray(plants) ? (
                                    plants.map((result) => (
                                        <div className='plantCnt' key={result.plant_index}>
                                            <div className='plantimg'>
                                                <a href={`/plantcare/${result.plant_index}`}>
                                                    <img src={process.env.PUBLIC_URL + `${result.img}`} alt={result.plantkor} />
                                                </a>
                                            </div>
                                            <div className='plantTitle'>
                                                <h3 className='plantName1'>{result.plantkor}</h3>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p></p>
                                )
                            )}
                        </div>
                    </div>
                </div>
                <ScrollToTopButton />
            </form>
        </div>

    );
}

export default Plantstart;


