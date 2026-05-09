// "use client";

// import Image from "next/image";

// export default function ContactForm() {
//     return (
//         <div className="contact-wrapper mx-auto">

//             {/* Contact Info */}
//             <div className="d-flex justify-content-center gap-5 mb-4 contact-info">

//                 <div className="contact-content">
//                     <div className="contact-icon">
//                         <Image
//                             src="/images/email-bt.png"
//                             alt="NAIL WARZ"
//                             width={60}
//                             height={60}
//                             className="img-fluid"
//                             priority
//                         />
//                     </div>
//                     <div>
//                         <div className="txt1">Email</div>
//                         <small className="txt2">info@nailwarz.com</small>
//                     </div>
//                 </div>
//             </div>

//             {/* Form */}
//             <form className="contact-form">
//                 <input
//                     type="text"
//                     className="form-control contact-input"
//                     placeholder="Name"
//                 />

//                 <input
//                     type="email"
//                     className="form-control contact-input"
//                     placeholder="Email address"
//                 />

//                 <textarea
//                     rows="5"
//                     className="form-control contact-input"
//                     placeholder="Message"
//                 ></textarea>

//                 <button type="submit" className="btn send-btn">
//                     Send now
//                 </button>
//             </form>

//         </div>
//     );
// }


"use client";

import Image from "next/image";
import Link from "next/link";

export default function ContactForm() {
    return (
        <div className="contact-wrapper mx-auto">

            {/* Contact Info */}
            <div className="d-flex justify-content-center gap-5 mb-4 contact-info">
                <div className="contact-content">
                    <div className="contact-icon">
                        <Image
                            src="/images/email-bt.png"
                            alt="NAIL WARZ"
                            width={60}
                            height={60}
                        />
                    </div>
                    <div>
                        <div className="txt1">Email</div>
                        <small className="txt2">info@nailwarz.com</small>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form className="contact-form">
                <input type="text" className="form-control contact-input" placeholder="Name" />
                <input type="email" className="form-control contact-input" placeholder="Email address" />
                <textarea rows="5" className="form-control contact-input" placeholder="Message"></textarea>

                <button type="submit" className="btn send-btn">
                    Send now
                </button>
            </form>

            {/* ✅ NEW VENDOR SECTION */}
            <div className="vendor-section text-center mt-5 p-4 border rounded bg-light">
                <h4 className="fw-bold mb-2">Join As a Professional</h4>
                <p className="text-muted mb-3">
                    Want to become a vendor on Nail Warz? Join our platform and start growing your business with us.
                </p>

                <Link href="/auth/signup" className="btn btn-home-header">
                    Go to Vendor Signup
                </Link>
            </div>

        </div>
    );
}