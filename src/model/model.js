/* eslint-disable */
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, { useState, useEffect, useCallback } from 'react';
import dummy from "./cache.json"
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';

const list = dummy.reverse();

function Main() {

    const [itemIndex, setItemIndex] = useState(0);
    const [result, setResult] = useState([]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        setResult(result.concat(list.slice(itemIndex, itemIndex + 30)));
    }, []);

    const _infiniteScroll = useCallback(() => {
        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        let clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight === scrollHeight) {
            //setItemIndex(itemIndex + 15);
            setResult(result.concat(list.slice(itemIndex + 30, itemIndex + 60)));
        }
    }, [itemIndex, result]);

    useEffect(() => {
        window.addEventListener('scroll', _infiniteScroll, true);
        return () => window.removeEventListener('scroll', _infiniteScroll, true);
    }, [_infiniteScroll]);

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

    return (
        <>
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand href="#">사이트 이름</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >

                            <Nav.Link href="#action1">메뉴1</Nav.Link>
                            <Nav.Link href="#action2">메뉴2</Nav.Link>
                            <NavDropdown title="메뉴3" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">서브 메뉴1</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">
                                    서브 메뉴2
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action5">
                                    서브 메뉴3
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
            <main>
                <Container>
                    <div className="content-wrap">
                        <h3 className="title">미리 보기 / 통상</h3>
                        <Row>
                            {result.map((data) => (
                                <div className="col-md-4" key={data.id}>
                                    <div className="text-center top-item" type="button" onClick={() => { window.open('/view/' + data.id) }}>
                                        <img src={require(`/public/image/suit/${data.id}.png`)} alt="suit"></img>
                                        <h3 className="allstars/card-name">
                                            <img className="rarity" src={require("/public/image/card_rarity/ui_card_icon_rarity_" + (data.card_rarity_type / 10) + ".png")} alt="Ultra rare" height="30"></img>
                                            {member_name(data.member_m_id)}
                                            <img className="attribute" src={require(`/public/image/card_attribute/ui_card_icon_attribute_${data.card_attribute}.png`)} alt="Natural" height="30"></img>
                                            <img className="role" src={require(`/public/image/role/ui_card_icon_role_${data.role}.png`)} alt="Guard" height="30"></img>
                                            <br></br>
                                            <small className="text-muted">{data.card_name_awaken}</small>
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </Row>
                        <Modal className="modal-xl" show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>제목</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>내용</Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleClose}>
                                    닫기
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </Container>
            </main>
        </>
    );
}

export default Main;