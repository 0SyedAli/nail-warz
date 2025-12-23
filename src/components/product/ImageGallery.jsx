import Image from "next/image";

const thumbs = [
    "/images/prod_nail1.png",
    "/images/prod_nail1.png",
    "/images/prod_nail1.png",
];

export default function ImageGallery() {
    return (
        <div className="row product_wrapper">
            <div className="col-3">
                <div className="thumbs">
                    {thumbs.map((img, i) => (
                        <Image key={i} src={img} width={150} height={150} className="img-fluid" alt="" />
                    ))}
                </div>
            </div>

            <div className="col-9">
                <div className="mainImage">
                    <Image
                        src="/images/prod_banner.png"
                        width={500}
                        height={600}
                        alt="Product"
                        priority
                        className="img-fluid"
                    />
                </div>
            </div>
        </div>
    );
}
