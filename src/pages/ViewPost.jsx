import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import ProfileSideBarLeft from '../components/Profile/ProfileSideBarLeft.jsx';
import PostMidBody from '../components/Posts/PostMidBody.jsx';
import ProfileSideBarRight from '../components/Profile/ProfileSideBarRight.jsx';

import { updateSessionToken } from '../apis/authApi.jsx';
import { logout } from '../feature/activeUser/activeUserSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
// =========================================
export default function ViewPost() {
    // ======================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ======================
    const onLogoutCallback = () => {
        onLoadingStart("Global");

        dispatch(logout()).then(
            (action) => {
                onLoadingEnd("Global");

                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    // Debug
                    //console.log("[On Logout Failed] Payload.", action.payload);
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    //console.log("[On Logout Successful] Payload.", action.payload);
                    updateSessionToken("");
                }
            }
        );
    };
    // ======================
    const onNavigateToUserProfilePage = (user_id) => navigate(`/profile/${user_id}`)
    // ======================
    const postIdParamRef = useParams().post_id;
    // ======================
    return (
        <>
            <Container fluid className="bg-light" style={{ flex: 1 }}>
                <Row className="d-flex justify-content-center">
                    <ProfileSideBarLeft onLogoutCallback={onLogoutCallback} />
                    <PostMidBody postId={parseInt(postIdParamRef)} />
                    <ProfileSideBarRight onNavigateToUserProfilePageCallback={onNavigateToUserProfilePage} />
                </Row>
            </Container>
        </>
    );
}
// =========================================