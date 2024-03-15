// ==============================================
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import { callServerAPI } from '../apis/authApi.jsx';
import { updateUserProfileData } from '../feature/activeUser/activeUserSlice.jsx';
import NavigationPanel from '../components/NavigationPanel.jsx';
// ==============================================
export default function EditProfile() {
    // ===========================
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let activeUserObj = useSelector((state) => state.activeUser);
    const user = activeUserObj.user;
    // ===================================================
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);

    const [image, setImage] = useState(user.image ? user.image : null);
    const [isCorrectImageFormat, setIsCorrectImageFormat] = useState(true);

    const updateProfilePicture = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setImage(null);
            return;
        }

        // Debug
        //console.log("[On Profile Picture Upload] Size.", file.size);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", () => {
            const url = fileReader.result;

            // Test for width and height
            const testImg = new window.Image();
            testImg.onload = () => {
                const width = testImg.width;
                const height = testImg.height;

                // Debug
                //console.log("[On Profile Picture Upload] Width: " + width + ", Height: " + height);

                const isValid = width === height & file.size <= 64000;
                setIsCorrectImageFormat(isValid);
                setImage(isValid ? url : null);
            }
            testImg.src = url;
        });
    }

    const onUpdateUserProfile = (event) => {
        event.preventDefault();

        const updatedUserData = {
            first_name: firstName,
            last_name: lastName,
            profile_image: image
        }

        callServerAPI("profile", "POST", updatedUserData,
            // On Successful Callback
            () => {
                // Debug
                //console.log("Successfully Updated User Profile.");

                dispatch(updateUserProfileData(updatedUserData));
                navigate("/profile");
            },
            // On Failed Callback
            (error) => {
                console.log("Failed to Update User Profile.", error);
            }
        );
    };
    // ===========================
    return (
        <>
            <NavigationPanel user={user} />
            <Container fluid
                className="d-flex flex-column primary-container m-0 p-0"
                style={{ flex: 1, overflowX: "hidden" }}>
                <Form className="mt-3 mx-3" onSubmit={onUpdateUserProfile}>
                    {/* -------------------------- */}
                    {/* First Name */}
                    <Row className="w-100 mb-3">
                        <Col className="col-12 d-flex align-items-center">
                            <Form.Label htmlFor="first-name"
                                className="text-non-links-primary fw-bold me-2 my-0 py-0">
                                First Name:<span> </span>
                            </Form.Label>
                            <Form.Control id="first-name" value={firstName} required
                                className="input-bar-no-shadow me-2"
                                style={{ width: "30%" }}
                                type="name" placeholder="First Name"
                                onChange={(event) => setFirstName(event.target.value)} />
                        </Col>
                    </Row>
                    {/* -------------------------- */}
                    {/* Last Name */}
                    <Row className="w-100 mb-3">
                        <Col className="col-12 d-flex align-items-center">
                            <Form.Label htmlFor="last-name"
                                className="text-non-links-primary fw-bold me-2 my-0 py-0">
                                Last Name:<span> </span>
                            </Form.Label>
                            <Form.Control id="last-name" value={lastName} required
                                className="input-bar-no-shadow me-2"
                                style={{ width: "30%" }}
                                type="name" placeholder="Last Name"
                                onChange={(event) => setLastName(event.target.value)} />
                        </Col>
                    </Row>
                    {/* -------------------------- */}
                    {/* Profile Picture/Image */}
                    <Row className="w-100 mb-3">
                        <Col className="col-12 d-flex align-items-center mb-3">
                            <Form.Label htmlFor="profile-picture"
                                className="text-non-links-primary fw-bold me-2 my-0 py-0">
                                Profile Picture:<span> </span>
                            </Form.Label>
                            <Form.Control id="profile-picture"
                                className={`text-non-links-primary login-text input-bar-no-shadow mb-2 ${isCorrectImageFormat ? "text-secondary" : "text-danger fw-bold"}`}
                                type="file" accept="image/png, image/jpg, image/jpeg, image/webp, image/svg"
                                style={{ width: "30%" }}
                                onChange={updateProfilePicture} />
                        </Col>
                        {/* ----------------------------- */}
                        {
                            image ? (
                                <Col className="col-12 d-flex align-items-center mb-3">
                                    <Image src={image} className="me-3"
                                        style={{ minWidth: "96px", minHeight: "96px", maxWidth: "128px", maxHeight: "128px", width: "100%", height: "auto" }} />
                                    <Image src={image} className="me-3"
                                        style={{ minWidth: "64px", minHeight: "64px", maxWidth: "96px", maxHeight: "96px", width: "100%", height: "auto" }} />
                                    <Image src={image}
                                        style={{ minWidth: "32px", minHeight: "32x", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto" }} />
                                </Col>
                            ) : null
                        }
                        {/* ----------------------------- */}
                        {/* Image Format */}
                        {
                            (!isCorrectImageFormat) ?
                                (<Form.Label className="login-text text-danger">{`The current profile picture does not meet the requirements.`}</Form.Label>) :
                                null
                        }
                        {/* ----------------------------- */}
                        <Col className="col-lg-4 col-md-5 col-sm-8 col-12 d-flex flex-column secondary-container primary-border rounded mb-2 px-2 py-1">
                            <Form.Text className="text-non-links-primary login-text fw-bold">Requirements for profile picture setup: </Form.Text>
                            <Form.Text className="text-non-links-primary login-text">1. Must not exceed 64kb. </Form.Text>
                            <Form.Text className="text-non-links-primary login-text">2. Equal Width and Height Dimensions. </Form.Text>
                        </Col>
                        {/* ----------------------------- */}
                        <div className="w-100 d-flex align-items-center justify-content-center">
                            <Button type="submit" variant="primary" style={{ width: "30%" }}>
                                Submit
                            </Button>
                        </div>
                    </Row>
                    {/* -------------------------- */}
                </Form>
            </Container>
        </>
    );
}