export default function WebBanner({ bannerTitle, bannerPara }) {
    return (
        <div className="d-flex align-items-center justify-content-center flex-column gap-3 web_banner">
            <h1>{bannerTitle}</h1>
            <p >{bannerPara}</p>
        </div>
    );
}

