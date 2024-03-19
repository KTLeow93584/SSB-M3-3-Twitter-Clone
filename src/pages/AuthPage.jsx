// =========================================
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';

import { login, register, getUserInfo } from '../feature/activeUser/activeUserSlice.jsx';
import { callServerAPI } from '../apis/authApi.jsx';
// =========================================
export default function AuthPage() {
    const loginImage = "https://sig1.co/img-twitter-1";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Possible values: null (no modals to show), "Login", "Sign Up".
    const [modalShow, setModalShow] = useState(null);
    const onShowRegistrationModal = () => setModalShow("Register");
    const onShowLoginModal = () => setModalShow("Login");

    const [error, setError] = useState(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [passwordComplexityLevel, setPasswordComplexityLevel] = useState(0);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    function checkPasswordComplexity(passwordInput) {
        const regexUpperLetters = /[A-Z]/;
        const regexLowerLetters = /[a-z]/;
        const regexNumbers = /[0-9]/;
        const regexSymbols = /[^a-zA-z0-9]/;

        let passwordComplexityLevel = 0;

        passwordComplexityLevel += passwordInput.length >= 8 ? 1 : 0;
        passwordComplexityLevel += regexUpperLetters.test(passwordInput) ? 1 : 0;
        passwordComplexityLevel += regexLowerLetters.test(passwordInput) ? 1 : 0;

        passwordComplexityLevel += regexNumbers.test(passwordInput) ? 1 : 0;
        passwordComplexityLevel += regexSymbols.test(passwordInput) ? 1 : 0;

        setPasswordComplexityLevel(passwordComplexityLevel);
    }

    let passwordComplexityColor = "black";
    let passwordComplexityDesc = "Weak";
    switch (passwordComplexityLevel) {
        case 0:
            passwordComplexityColor = "red";
            passwordComplexityDesc = "Weak";
            break;
        case 1:
        case 2:
            passwordComplexityColor = "orange";
            passwordComplexityDesc = "Average";
            break;
        case 3:
        case 4:
            passwordComplexityColor = "lightblue";
            passwordComplexityDesc = "Strong";
            break;
        case 5:
            passwordComplexityColor = "green";
            passwordComplexityDesc = "Very Strong";
            break;
    }

    const onRegister = async (event) => {
        event.preventDefault();

        // Debug
        //console.log("Sign Up Event");
        dispatch(register({ email, password, first_name: firstName, last_name: lastName })).then(
            // On Promise Fulfilled
            () => {
                // Debug
                console.log("[On Registration Successful]");

                setError(null);
                setModalShow(null);
                alert("Successfully Registered!");
            },
            // On Promise Rejected/Failed
            (error) => {
                setError({
                    name: error.code,
                    code: error.request.status
                });
            }
        );
    }

    const onLogin = async (event) => {
        event.preventDefault();

        // Debug
        //console.log("Login Event");

        dispatch(login({ email, password })).then(
            // On Promise Fulfilled
            () => {
                // Debug
                console.log("Login was successful, token saved");

                onFetchUserProfileInfo();
            },
            // On Promise Rejected/Failed
            (error) => {
                // Debug
                console.log("Login Failed.", error);

                setError({
                    name: error.code,
                    code: error.request.status
                });
            }
        );
    }

    const onFetchUserProfileInfo = async () => {
        // Debug
        //console.log("Get User Profile Event");

        dispatch(getUserInfo()).then(
            // On Promise Fulfilled
            () => {
                // Debug
                //console.log("User Profile Obtained.");

                navigate("/profile");
            },
            // On Promise Rejected/Failed
            (error) => {
                console.log("Error.", error);
                setError({
                    name: error.code,
                    code: error.request.status
                });
            }
        );
    };

    const onCloseModal = () => {
        setModalShow(null);
        setPasswordComplexityLevel(0);
    };

    return (
        <Row>
            {/* ------------------------------ */}
            <Col className="col-sm-6 col-12">
                <Image src={loginImage} style={{ backgroundSize: "cover", width: "100%", height: "auto" }} fluid />
            </Col>
            {/* ------------------------------ */}
            <Col className="col-sm-6 col-12">
                <i className="bi bi-twitter" style={{ fontSize: 50, color: "dodgerblue" }}></i>

                <p className="mt-5" style={{ fontSize: 64 }}>Happening Now</p>
                <h2 className="my-5" style={{ fontSize: 31 }}>Join Twitter Today.</h2>

                <Col className="col-sm-5 d-grid gap-2">
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-google"></i> Sign up with Google
                    </Button>
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-apple"></i> Sign up with Apple
                    </Button>
                    <p style={{ textAlign: "center" }}>or</p>
                    <Button className="rounded-pill" onClick={onShowRegistrationModal}>
                        Create an account
                    </Button>
                    <p style={{ fontSize: "12px" }}>
                        By signing up, you agree to the Terms of Services and Privacy Policy including Cookie Use.
                    </p>

                    <p className="mt-5" style={{ fontWeight: "bold" }}>
                        Already have an account?
                    </p>
                    <Button
                        className="rounded-pill"
                        variant="outline-primary"
                        onClick={onShowLoginModal}>
                        Sign In
                    </Button>
                </Col>
            </Col>
            {/* ------------------------------ */}
            {/* Authentication Modal */}
            <Modal size="lg"
                show={modalShow !== null}
                onHide={onCloseModal}
                animation={false} centered>
                <Modal.Body>
                    <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                        Create your account
                    </h2>
                    <Form
                        className="d-grid gap-2 px-5"
                        onSubmit={modalShow === "Register" ? onRegister : onLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                required
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="on"
                                type="email"
                                placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                required
                                onChange={(event) => {
                                    const newPassword = event.target.value;

                                    setPassword(newPassword);

                                    if (modalShow === "Register")
                                        checkPasswordComplexity(newPassword);
                                }}
                                autoComplete="on"
                                type="password"
                                placeholder="Enter password" />
                            {
                                (modalShow === "Register") ? (
                                    <div className="d-flex align-items-center mt-2">
                                        <Form.Text className="ms-1 me-2">Password Strength: </Form.Text>
                                        {
                                            Array.from({ length: passwordComplexityLevel }).map((element, index) =>
                                            (<i key={`protection-level-${index}`}
                                                className="fs-6 bi bi-circle-fill me-2" style={{ color: passwordComplexityColor }}></i>)
                                            )
                                        }
                                        <span>{passwordComplexityLevel > 0 ? (`(${passwordComplexityDesc})`) : "N/A"}</span>
                                    </div>
                                ) : null
                            }
                        </Form.Group>
                        {
                            (modalShow === "Register") ? (
                                <>
                                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                                        <Form.Control
                                            required
                                            onChange={(event) => setFirstName(event.target.value)}
                                            type="text"
                                            placeholder="Enter first name" />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicLastName">
                                        <Form.Control
                                            required
                                            onChange={(event) => setLastName(event.target.value)}
                                            type="text"
                                            placeholder="Enter last name" />
                                    </Form.Group>
                                </>
                            ) : null
                        }
                        <p style={{ fontSize: "12px" }}>
                            By {modalShow === "Register" ? "registering" : "logging in"}, you agree to the Terms of Services and Privacy Policy, including Cookie Use.
                            <span> </span>
                            SigmaTweets may use your contact information, including your email address and phone number for purposes
                            <span> </span>
                            outlined in our Privacy Policy, like keeping your account secure and personalising our services, including ads.
                            <span> </span>
                            Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.
                        </p>

                        <Button className="rounded-pill" type="submit">
                            {modalShow === "Register" ? "Register" : "Log in"}
                        </Button>
                        {
                            error ? (
                                <p className="fs-6 text-danger">
                                    Something went wrong with the {modalShow === "Register" ? "registration" : "login"} process. (Error: {error.name}, Code: {error.code})
                                </p>
                            ) : null
                        }
                    </Form>
                </Modal.Body>
                {/* ------------------------------ */}
            </Modal>
        </Row>
    );
}
// =========================================