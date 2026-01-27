import { LuDownload } from "react-icons/lu";

export default function WebBanner({ bannerTitle, bannerPara, bannerBtn }) {
    return (
        <div className="d-flex align-items-center justify-content-center flex-column gap-3 web_banner text-center">
            <h1>{bannerTitle}</h1>
            {bannerPara && <p>{bannerPara}</p>}
            {bannerBtn &&
                <button className="btn banner-btn">
                    <span>
                        <LuDownload />
                    </span>
                    Join the Warz - Download App
                </button>
            }
        </div>
    );
}

