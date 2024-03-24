import Button from 'react-bootstrap/Button';

export default function IconButton({ isTop, iconClassName, textClassName, onClick, text }) {
    const margin = isTop ? `light rounded-pill my-3` : `light rounded-pill`;

    const iconMargin = text ? " me-3" : " ";

    return (
        <Button variant={margin} className="d-flex align-items-center" onClick={onClick}>
            <i className={iconClassName + iconMargin} style={{ fontSize: "24px", color: isTop ? "dodgerblue" : "black" }}></i>
            <span className={`d-md-block d-none ${textClassName}`} > {text}</span>
        </Button>
    );
}