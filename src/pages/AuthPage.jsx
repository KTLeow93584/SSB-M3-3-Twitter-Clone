// =========================================
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';

import { updateSessionToken } from "../apis/authApi.jsx";

import SessionTimeoutModal from '../components/SessionTimeoutModal.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
import { errorNoAuthEventName } from '../data/error-loggers.js';
import { login, register } from '../feature/activeUser/activeUserSlice.jsx';
// =========================================
export default function AuthPage() {
    // ====================
    const loginImage = "https://sig1.co/img-twitter-1";
    // ====================
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = getAuth();
    // ====================
    // Possible values: null (no modals to show), "Login", "Sign Up".
    const [authModalShow, setAuthModalShow] = useState(null);
    const onShowRegistrationModal = () => {
        setActionCompletedMessage("");
        setAuthModalShow("Register");
    };
    const onShowLoginModal = () => {
        setActionCompletedMessage("");
        setAuthModalShow("Login");
    };
    // ====================
    // Possible values: null (no modals to show), "Login", "Sign Up".
    const [timeoutModalShow, setTimeoutModalShow] = useState(false);

    const onHideTimeoutModal = () => setTimeoutModalShow(false);

    // Verify Access Token at the beginning of the app.
    useEffect(() => {
        const onShowTimeoutModal = () => setTimeoutModalShow(true);

        window.addEventListener(errorNoAuthEventName, onShowTimeoutModal);

        return (() => {
            window.removeEventListener(errorNoAuthEventName, onShowTimeoutModal);
        });
    }, [navigate]);
    // ====================
    const [error, setError] = useState(null);
    const [actionCompletedMessage, setActionCompletedMessage] = useState("");

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
    // ====================
    // Registration
    const onRegister = async (event) => {
        event.preventDefault();
        setError(null);
        onLoadingStart("Global");

        // Debug
        //console.log("Sign Up Event");
        dispatch(register({ email, password, first_name: firstName, last_name: lastName })).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[On Registration Failed] Payload.", action.payload);

                    setError({
                        name: action.payload.code,
                        code: action.payload.status
                    });
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    //console.log("[On Registration Successful] Payload.", action.payload);

                    onLoadingEnd("Global");
                    setError(null);
                    setAuthModalShow(null);
                    setActionCompletedMessage("Successfully Registered. You can now log in!");
                }
            }
        );
    }
    // ====================
    // Login
    const onLogin = async (event) => {
        event.preventDefault();
        setError(null);
        onLoadingStart("Global");

        // Debug
        //console.log("Login Event");
        dispatch(login({ email, password })).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Login Failed] Payload.", action.payload)

                    setError({
                        name: action.payload.code,
                        code: action.payload.status
                    });
                }
                // On Promise Fulfilled
                else {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Login Successful] Payload.", action.payload);

                    updateSessionToken(action.payload.client_data.token);
                    onUserSuccessfullyLoggedIn(action.payload.client_data.token);

                    navigate(`/profile/${action.payload.client_data.user.user_id}`);
                }
            }
        );
    }

    const googleProvider = new GoogleAuthProvider();
    const onLoginGoogle = async (event) => {
        event.preventDefault();
        setError(null);
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;

        // Debug
        //console.log("[On Google Login Successful] User.", user);
        onLoadingStart("Global");

        updateSessionToken(user.accessToken);
        onUserSuccessfullyLoggedIn(user.accessToken);

        dispatch(login({
            email: user.email,
            social_name: user.displayName,
            social_provider: res.providerId,
            social_uid: user.uid,
            social_profile_image: user.photoURL
        })).then((action) => {
            // On Promise Rejected/Failed, Error Exception.
            if (action.error) {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Login Failed] Payload - Google.", action.payload)

                setError({
                    name: action.payload.code,
                    code: action.payload.status
                });
            }
            // On Promise Fulfilled
            else {
                // Debug
                //console.log("[Login Successful - Google] Payload.", action.payload);

                navigate(`/profile/${action.payload.client_data.user.user_id}`);
            }
        });
    }
    // ====================
    const facebookProvider = new FacebookAuthProvider();
    const onLoginFacebook = async (event) => {
        event.preventDefault();
        setError(null);
        const res = await signInWithPopup(auth, facebookProvider);
        const user = res.user;

        // Debug
        //console.log("[On Facebook Login Successful] User.", user);
        onLoadingStart("Global");

        updateSessionToken(user.accessToken);
        onUserSuccessfullyLoggedIn(user.accessToken);

        dispatch(login({
            email: user.email,
            social_name: user.displayName,
            social_provider: res.providerId,
            social_profile_image: user.photoURL
        })).then((action) => {
            // On Promise Rejected/Failed, Error Exception.
            if (action.error) {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Login Failed - Facebook] Payload.", action.payload)

                setError({
                    name: action.payload.code,
                    code: action.payload.status
                });
            }
            // On Promise Fulfilled
            else {
                // Debug
                //console.log("[Login Successful - Facebook] Payload.", action.payload);

                navigate(`/profile/${action.payload.client_data.user.user_id}`);
            }
        });
    }
    // ====================
    const onUserSuccessfullyLoggedIn = (token) => {
        localStorage.setItem("session-id", token);
    };
    // ====================
    const onCloseModal = () => {
        setAuthModalShow(null);
        setPasswordComplexityLevel(0);
        setError(null);
    };

    return (
        <>
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
                        <Button className="rounded-pill" variant="outline-dark" onClick={onLoginGoogle}>
                            <i className="bi bi-google"></i> Sign up with Google
                        </Button>
                        <Button className="rounded-pill" variant="outline-dark" onClick={onLoginFacebook}>
                            <i className="bi bi-facebook"></i> Sign up with Facebook
                        </Button>
                        <p style={{ textAlign: "center" }}>or</p>
                        <Button className="rounded-pill" onClick={onShowRegistrationModal}>
                            Create an account
                        </Button>
                        <p style={{ fontSize: "0.7em" }}>
                            By signing up, you agree to the Terms of Services and Privacy Policy including Cookie Use.
                        </p>
                        {
                            actionCompletedMessage ? (
                                <div className="rounded" style={{ border: "2px #777777 solid", backgroundColor: "#bbbbbb" }}>
                                    <p className="fw-bold text-center m-0 py-2 px-3" style={{ fontSize: "0.8em" }}>{actionCompletedMessage}</p>
                                </div>
                            ) : null
                        }

                        <p className="mt-2" style={{ fontWeight: "bold" }}>
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
                    show={authModalShow !== null}
                    onHide={onCloseModal}
                    animation={false} centered>
                    <Modal.Body>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            Create your account
                        </h2>
                        <Form
                            className="d-grid gap-2 px-5"
                            onSubmit={authModalShow === "Register" ? onRegister : onLogin}>
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

                                        if (authModalShow === "Register")
                                            checkPasswordComplexity(newPassword);
                                    }}
                                    autoComplete="on"
                                    type="password"
                                    placeholder="Enter password" />
                                {
                                    (authModalShow === "Register") ? (
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
                                (authModalShow === "Register") ? (
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
                                By {authModalShow === "Register" ? "registering" : "logging in"}, you agree to the Terms of Services and Privacy Policy, including Cookie Use.
                                <span> </span>
                                SigmaTweets may use your contact information, including your email address and phone number for purposes
                                <span> </span>
                                outlined in our Privacy Policy, like keeping your account secure and personalising our services, including ads.
                                <span> </span>
                                Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.
                            </p>

                            <Button className="rounded-pill" type="submit">
                                {authModalShow === "Register" ? "Register" : "Log in"}
                            </Button>
                            {/* Error Message Highlight */}
                            {
                                error ? (
                                    <p className="fs-6 text-danger">
                                        Something went wrong with the {authModalShow === "Register" ? "registration" : "login"} process. (Error: {error.name}, Code: {error.code})
                                    </p>
                                ) : null
                            }
                        </Form>
                    </Modal.Body>
                    {/* ------------------------------ */}
                </Modal>
            </Row>
            <SessionTimeoutModal show={timeoutModalShow} onCloseModalCallback={onHideTimeoutModal} />
        </>
    );
}
// =========================================