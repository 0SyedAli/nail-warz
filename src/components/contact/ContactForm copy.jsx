"use client";

import Image from "next/image";

export default function ContactForm() {
    return (
        <div className="contact-wrapper mx-auto">

            {/* Contact Info */}
            <div className="d-flex justify-content-center gap-5 mb-4 contact-info">
                {/* <div className="contact-content">
                    <div className="contact-icon">
                        <Image
                            src="/images/phone-bt.png"
                            alt="NAIL WARZ"
                            width={60}
                            height={60}
                            className="img-fluid"
                            priority
                        />
                    </div>
                    <div>
                        <div className="txt1">Call</div>
                        <small className="txt2">+123 456 789</small>
                    </div>
                </div> */}

                <div className="contact-content">
                    <div className="contact-icon">
                        <Image
                            src="/images/email-bt.png"
                            alt="NAIL WARZ"
                            width={60}
                            height={60}
                            className="img-fluid"
                            priority
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
                <input
                    type="text"
                    className="form-control contact-input"
                    placeholder="Name"
                />

                <input
                    type="email"
                    className="form-control contact-input"
                    placeholder="Email address"
                />

                <textarea
                    rows="5"
                    className="form-control contact-input"
                    placeholder="Message"
                ></textarea>

                <button type="submit" className="btn send-btn">
                    Send now
                </button>
            </form>

        </div>
    );
}
