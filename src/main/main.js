/* eslint-disable */
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
//import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, { useState, useEffect, useRef, useCallback } from 'react';
//import dummy from "./cache.json"
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Spinner from 'react-bootstrap/Spinner';
import { useInView } from "react-intersection-observer"
import './main.css';

//const list = dummy.reverse();

function Main() {
    //require("./main.css"); // here
    window.history.pushState(null, null, `/main`); // /main 안쳐도 주소창에 /main 생김

    const [itemIndex, setItemIndex] = useState(0);
    const [result, setResult] = useState([]);

    const [show, setShow] = useState(false);

    const [sid, setSID] = useState(0);

    const [limitBreak, setLimitBreak] = useState(5);

    const [member_m_id, setMemberId] = useState(0);

    const [cardRarity, setCardRarity] = useState(0);

    const [cardName, setCardName] = useState("");

    const [awakenCardName, setAwakenCardName] = useState("");

    const [group, setGroup] = useState(0);

    const [grade, setGrade] = useState(0);

    const [unit, setUnit] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        result.map((data) => {
            if (id === data.id) {
                setMemberId(data.member_m_id);
                setCardRarity(data.card_rarity_type);
                setCardName(data.card_name);
                setAwakenCardName(data.card_name_awaken);
                setGroup(data.member_group);
                setGrade(data.school_grade);
                setUnit(data.member_unit);
            }
        });
        setSID(id);
        setShow(true);
    }

    /*useEffect(() => {
        setResult(result.concat(list.slice(itemIndex, itemIndex + 30)));
    }, []);

    const _infiniteScroll = useCallback(() => {
        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        let clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight === scrollHeight) {
            setItemIndex(itemIndex + 15);
            setResult(result.concat(list.slice(itemIndex + 15, itemIndex + 30)));
        }
    }, [itemIndex, result]);*/

    useEffect(() => {
        getFetchData();
    }, [itemIndex]);

    const [ref, inView] = useInView();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
        if (inView && !loading) {
            setItemIndex(itemIndex + 15);
            console.log('index->' + itemIndex);
        }
    }, [inView, loading])



    /*const _infiniteScroll = useCallback(() => {
        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        let clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight === scrollHeight) {
            setItemIndex(itemIndex + 15);
            //setResult(result.concat(list.slice(itemIndex + 30, itemIndex + 60)));
        }
    }, [itemIndex, result]);*/

    const getFetchData = async () => {
        setLoading(true);
        await axios.post("http://localhost:8080/api/main?page=" + itemIndex, {
            username: "abc",
            password: "123"
        }).then((res) => {
            setResult(result.concat(res.data));
        }).catch(error => {
            alert("오류가 발생했습니다.");
            setLoading(false);
            return Promise.reject(error);
        });
        setTimeout(()=>{
            setLoading(false);
        }, 500);
    }

    /*useEffect(() => {
        window.addEventListener('scroll', _infiniteScroll, true);
        return () => window.removeEventListener('scroll', _infiniteScroll, true);
    }, [_infiniteScroll]);*/

    function member_name(member_m_id) {
        switch (member_m_id) {
            case 1:
                return "코사카 호노카";
            case 2:
                return "아야세 에리";
            case 3:
                return "미나미 코토리";
            case 4:
                return "소노다 우미";
            case 5:
                return "호시조라 린";
            case 6:
                return "니시키노 마키";
            case 7:
                return "토죠 노조미";
            case 8:
                return "코이즈미 하나요";
            case 9:
                return "야자와 니코";
            case 101:
                return "타카미 치카";
            case 102:
                return "사쿠라우치 리코";
            case 103:
                return "마츠우라 카난";
            case 104:
                return "쿠로사와 다이아";
            case 105:
                return "와타나베 요우";
            case 106:
                return "츠시마 요시코";
            case 107:
                return "쿠니키다 하나마루";
            case 108:
                return "오하라 마리";
            case 109:
                return "쿠로사와 루비";
            case 201:
                return "우에하라 아유무";
            case 202:
                return "나카스 카스미";
            case 203:
                return "오사카 시즈쿠";
            case 204:
                return "아사카 카린";
            case 205:
                return "미야시타 아이";
            case 206:
                return "코노에 카나타";
            case 207:
                return "유키 세츠나";
            case 208:
                return "엠마 베르데";
            case 209:
                return "텐노지 리나";
            case 210:
                return "미후네 시오리코";
            case 211:
                return "미아 테일러";
            case 212:
                return "쇼우 란쥬";
            default:
                return "???";
        }
    }

    const [arr, setArr] = useState([]);
    function stars() {
        var array = [];
        if (arr.length === 0) {
            for (var i = 0; i < 30; i++) {
                array.push(<p className={"l-bg_item l-bg_item--" + (Math.floor(Math.random() * 5) + 1) + " l-bg_item--move" + (Math.floor(Math.random() * 16))} style={{ left: Math.floor(Math.random() * 100 + 1) + "%" }} key={i}>
                    <span></span>
                </p>);
            }
            setArr(array);
        }
        return arr;
    }

    function limitBreakButton() {
        var array = [];
        for (var i = 0; i < 5; ++i) {
            let a = i + 1;
            if (i + 1 === limitBreak) {
                a = 0;
            }
            array.push(<img className="limitbreak_icon" onClick={() => setLimitBreak(a)} src={process.env.PUBLIC_URL + '/image/limitbreak/' + (i < limitBreak ? 1 : 2) + '.png'} alt="limitbreak" key={'lb' + i}></img>);
        }
        return array;
    }

    function idolLevel() {
        if (cardRarity == 10) {
            return 40;
        } else if (cardRarity == 20) {
            return 60;
        } else if (cardRarity == 30) {
            return 80;
        }
        return 0;
    }

    return (
        <>
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand href="#">SIFAS Model Viewer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >

                            <Nav.Link href="#action1">Menu1</Nav.Link>
                            <Nav.Link href="#action2">Menu2</Nav.Link>
                            <NavDropdown title="Menu3" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">Sub Menu1</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">
                                    Sub Menu2
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action5">
                                    Sub Menu3
                                </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                        {/*<Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">검색</Button>
                </Form>*/}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <div className="content">
                    <div className="l-bg">
                        {stars()}
                    </div>
                    <h3 className="page">School Idol / List</h3>
                    <Row>
                        {result.map((data) => (
                            <div className="col-md-4" key={data.id} ref={ref}>
                                <div className="text-center top-item" type="button" onClick={() => handleShow(data.id)}>
                                    <img src={`http://localhost:8080/image/card/${data.id}.jpg`} alt="card_image"></img>
                                    <img src={`http://localhost:8080/image/card/${data.id}_awaken.jpg`} alt="awaken_card_image"></img>
                                    <h3 className="allstars/card-name">
                                        <img className="rarity" src={require("/public/image/card_rarity/ui_card_icon_rarity_" + (data.card_rarity_type / 10) + ".png")} alt="Ultra rare" height="30"></img>
                                        <span>{member_name(data.member_m_id)}</span>
                                        <img className="attribute" src={require(`/public/image/card_attribute/ui_card_icon_attribute_${data.card_attribute}.png`)} alt="Natural" height="30"></img>
                                        <img className="role" src={require(`/public/image/role/ui_card_icon_role_${data.role}.png`)} alt="Guard" height="30"></img>
                                        <br></br>
                                        <small className="text-muted">{data.card_name}</small>
                                        <br></br>
                                        <small className="text-muted">{data.card_name_awaken}</small>
                                    </h3>
                                </div>
                            </div>
                        ))}

                    </Row>
                    <Modal className="modal-lg" show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="text-center w-100">스쿨 아이돌 간단 정보</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <div className="col">
                                    <div className="idol-header">
                                        <table className="idol_table">
                                            <tbody>
                                                <tr>
                                                    <td className="idol_icons">
                                                        <img className="idol_icon" src={'http://localhost:8080/image/cardIcon/' + sid + '.png'} alt="icon"></img>
                                                        <img className="idol_icon awaken" src={'http://localhost:8080/image/cardIcon/' + sid + '_awaken.png'} alt="icon"></img>
                                                    </td>
                                                    <td className="header-info">
                                                        <div className="group">
                                                            <img className="group_icon" src={process.env.PUBLIC_URL + '/image/member_group/' + group + '.png'} alt="group_icon"></img>
                                                            <span className="vertical_dashed"></span>
                                                            <img className="unit_icon" src={process.env.PUBLIC_URL + '/image/member_unit/' + unit + '.png'} alt="unit_icon"></img>
                                                            <span className="vertical_dashed"></span>
                                                            <img className="grade_icon" src={process.env.PUBLIC_URL + '/image/member_grade/' + grade + '.png'} alt="grade_icon"></img>
                                                        </div>
                                                        <span className="idolName">
                                                            <h4 className="card_name">{cardName}</h4>
                                                            <h4 className="card_name_awaken">{awakenCardName}</h4>
                                                            <h5 className="idol_Name">{member_name(member_m_id)}</h5>
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div></Row>
                            <hr></hr>
                            <div className="idol-illust">
                                <Row>
                                    <div className="col">
                                        <img className="card_image" src={'http://localhost:8080/image/card/' + sid + '.jpg'} alt="card_image"></img>
                                        <h6>{cardName}</h6>
                                    </div>
                                    <div className="col">
                                        <img className="card_image_awaken" src={'http://localhost:8080/image/card/' + sid + '_awaken.jpg'} alt="card_image_awaken"></img>
                                        <h6>{awakenCardName}</h6>
                                    </div>
                                </Row>
                            </div>
                            {/*<hr></hr>*/}
                            <div className="idol-detail">
                                <Row>
                                    <div className="col">
                                        <table className="stats">
                                            <tbody>
                                                <tr>
                                                    <td className="stat-item level">레벨</td>
                                                    <td className="stat-item value">
                                                        <span>{idolLevel()}</span>
                                                        <span>/</span>
                                                        <span>{idolLevel()}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="stat-item limitbreak">한계 돌파</td>
                                                    <td className="stat-item value">
                                                        {limitBreakButton()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="stat-item appeal">
                                                        <img className="appeal_icon" src={process.env.PUBLIC_URL + '/image/stats/appeal.png'} alt="appeal_icon"></img>
                                                        <span>어필</span>
                                                    </td>
                                                    <td className="stat-item value">
                                                        <span>15000</span>
                                                    </td>
                                                    <td className="stat-item bonus">
                                                        <span>(+780)</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="stat-item stamina">
                                                        <img className="stamina_icon" src={process.env.PUBLIC_URL + '/image/stats/stamina.png'} alt="stamina_icon"></img>
                                                        체력
                                                    </td>
                                                    <td className="stat-item value">
                                                        <span>1000</span>
                                                    </td>
                                                    <td className="stat-item bonus">
                                                        <span>(+26)</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="stat-item technique">
                                                        <img className="technique_icon" src={process.env.PUBLIC_URL + '/image/stats/technique.png'} alt="technique_icon"></img>
                                                        테크닉
                                                    </td>
                                                    <td className="stat-item value">
                                                        <span>18000</span>
                                                    </td>
                                                    <td className="stat-item bonus">
                                                        <span>_</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="skill_name">
                                            <img className="basic_skill_icon" src={process.env.PUBLIC_URL + '/image/stats/skill.png'} alt="skill_icon"></img>
                                            <span>특기</span>
                                        </div>
                                        <table className="skill">
                                            <tbody>
                                                <tr>
                                                    <td className="skill_icon">
                                                        <img src={process.env.PUBLIC_URL + '/image/skill/voltage.png'} alt="skill"></img>
                                                    </td>
                                                    <td className="skill_desc">
                                                        <span>하나, 둘, 점프!</span>
                                                        <span className="lv">발동 확률 33% / Lv.5/5</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="skill_effect" colSpan="2">
                                                        <span>자기 어필의 42%만큼 볼티지 획득</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col">
                                        <div className="ability_name">
                                            <img className="basic_ability_icon" src={process.env.PUBLIC_URL + '/image/stats/ability.png'} alt="ability_icon"></img>
                                            <span>개성</span>
                                        </div>
                                        <table className="ability">
                                            <tbody>
                                                <tr>
                                                    <td className="ability_icon">
                                                        <img src={process.env.PUBLIC_URL + '/image/ability/ap+st.png'} alt="passive_ability"></img>
                                                    </td>
                                                    <td className="ability_desc">
                                                        <span>어필&체력++ :전원</span>
                                                        <span className="lv">Lv.7/7</span>
                                                    </td>
                                                    <td className="ability_about">
                                                        <OverlayTrigger
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}>
                                                                    기본 어필 5.2% 증가
                                                                    <br></br>
                                                                    기본 체력 2.6% 증가
                                                                    <br></br>
                                                                    대상: 모두
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <img src={process.env.PUBLIC_URL + '/image/ui/about.png'} alt="about_btn"></img>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="ability_icon">
                                                        <img src={process.env.PUBLIC_URL + '/image/ability/appeal.png'} alt="live_ability"></img>
                                                    </td>
                                                    <td className="ability_desc">
                                                        <span>어필 UP EX :AC 성공 시/전원</span>
                                                        <span className="lv">Lv.1/1</span>
                                                    </td>
                                                    <td className="ability_about">
                                                        <OverlayTrigger
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}>
                                                                    5노트 동안 어필 5% 증가(특수)
                                                                    <br></br>
                                                                    조건: 어필 찬스(AC) 성공 시, 확률: 100%
                                                                    <br></br>
                                                                    대상: 모두
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <img src={process.env.PUBLIC_URL + '/image/ui/about.png'} alt="about_btn"></img>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="etc">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <img className="suit_icon" onClick={() => { window.open('/view/' + sid) }} src={'http://localhost:8080/image/suit/' + sid + '.png'} alt="suit_icon" style={{ cursor: 'pointer' }}></img>
                                                        <span>
                                                            뭐넣지
                                                        </span>
                                                    </td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Row>
                            </div>
                            <hr></hr>
                        </Modal.Body>
                    </Modal>
                    {loading ?
                        <Spinner animation="border" role="status" className="d-flex" style={{ margin: 'auto' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        :
                        <></>
                    }
                </div>
            </Container>
        </>
    );
}

export default Main;