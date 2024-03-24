
// =========================================
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { getTimeFromNow } from '../../data/time.js';

import defaultProfileImage from '../../assets/images/user-profile-default.webp';
// =========================================
export default function CommentCard({ comment, userId, onModifyCallback = null, onDeleteCallback = null }) {
    return (
        <Col className="col-12 d-flex align-items-start mb-1">
            <Image src={comment.user_profile_image ? comment.user_profile_image : defaultProfileImage}
                className="ms-2 me-3"
                style={{ minWidth: "32px", minHeight: "32px", maxWidth: "48px", maxHeight: "48px", width: "100%", height: "auto", cursor: "pointer" }} />
            <div className="w-100">
                <div className="d-flex align-items-center">
                    <p className="m-0 p-0">
                        <span className="fs-6 fw-bold me-2">{comment.user_first_name + " " + comment.user_last_name}</span>
                        <span style={{ color: "#444444", fontSize: "0.8em" }}>
                            @{(comment.user_first_name + comment.user_last_name).replace(" ", "")} • {getTimeFromNow(new Date(comment.created_at))}
                        </span>
                    </p>

                    {/* Comment Modification/Deletion Tools */}
                    {
                        comment.user_id === userId ? (
                            <div className="ms-auto">
                                <Button variant="light" onClick={() => {
                                    if (onModifyCallback)
                                        onModifyCallback(comment);
                                }}>
                                    <i className="bi bi-screwdriver"></i>
                                </Button>
                                <Button variant="light" onClick={() => {
                                    if (onDeleteCallback)
                                        onDeleteCallback(comment);
                                }}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        ) : null
                    }
                </div>
                <p className="m-0 p-0 mb-2">
                    {comment.comment_content}
                </p>
                {/* Buttons Row */}
                <div className="d-flex justify-content-between">
                    <Button variant="light">
                        <i className="bi bi-chat">{" 0"}</i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    <Button variant="light">
                        <i className={"bi bi-heart"}>{" 0"}</i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-bar-chart-line"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-journal-bookmark"></i>
                    </Button>
                </div>
            </div>
        </Col>
    );
}