// import Image from "next/image";

// const thumbs = [
//     "/images/prod_nail1.png",
//     "/images/prod_nail1.png",
//     "/images/prod_nail1.png",
// ];

// export default function ImageGallery() {
//     return (
//         <div className="row product_wrapper">
//             <div className="col-3">
//                 <div className="thumbs">
//                     {thumbs.map((img, i) => (
//                         <Image key={i} src={img} width={150} height={150} className="img-fluid" alt="" />
//                     ))}
//                 </div>
//             </div>

//             <div className="col-9">
//                 <div className="mainImage">
//                     <Image
//                         src="/images/prod_banner.png"
//                         width={500}
//                         height={600}
//                         alt="Product"
//                         priority
//                         className="img-fluid"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images = [] }) {
    const gallery =
        images.length && images.length > 0
            ? images.map((img) => `${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`)
            : ["/images/prod_paint.png"];

    const [active, setActive] = useState(gallery[0]);

    return (
        <div className="row product_wrapper">
            <div className="col-3">
                <div className="thumbs">
                    {gallery.map((img, i) => (
                        <Image
                            key={i}
                            src={img}
                            width={120}
                            height={120}
                            className={`img-fluid ${active === img ? "active" : ""}`}
                            alt="Thumb"
                            onClick={() => setActive(img)}
                        />
                    ))}
                </div>
            </div>

            <div className="col-9">
                <div className="mainImage">
                    <Image
                        src={active}
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
