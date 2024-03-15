// =========================================
import { useEffect, useState } from 'react';
// =========================================
export default function Loader() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onLoadingStartCallback = () => setIsVisible(true);
        const onLoadingEndCallback = () => setIsVisible(false);

        window.addEventListener("On Loading Start", onLoadingStartCallback);
        window.addEventListener("On Loading End", onLoadingEndCallback);
        return (() => {
            window.removeEventListener("On Loading Start", onLoadingStartCallback);
            window.removeEventListener("On Loading End", onLoadingEndCallback);
        });
    }, []);

    return (
        <div id="loader-container" className={`${isVisible ? "d-block" : "d-none"}`}>
            <div id="loader" />
        </div>
    );
}
// =========================================