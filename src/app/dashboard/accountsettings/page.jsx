"use client";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";

const EditProfile = () => {
    return (
        <div className="w-100">
            <div className="m_tabs_main mt-5">
                <form >
                    <div className="ast_main">
                        <h3>Profile Information</h3>
                        <div className="ast_item">
                            <Image
                                src="/images/profile-avatar.jpg"
                                width={64}
                                height={60}
                                alt="Profile"
                            />
                            <div className="ast_file">
                                <input type="file" name="AdminImage" />
                                <h5>Change Picture</h5>
                                <span><FaRegEdit /></span>
                            </div>
                        </div>
                        <div className="row pt-4 gx-3 gy-3">
                            <div className="col-4">
                                <div className="am_field">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                    // value={formData.firstName}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="am_field">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                    // value={formData.lastName}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="am_field">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                    // value={formData.email}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="am_field">
                                    <label>Gender</label>
                                    <input
                                        type="text"
                                        name="gender"
                                    // value={formData.gender}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="am_field">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="gender"
                                    // value={formData.gender}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="am_btn">
                                    <button class="themebtn4 green btn" type="button">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ast_main mt-4">
                        <div className="ast_item justify-content-between">
                            <h3>Contact Detail</h3>
                            <div className="ast_file px-2" style={{width:"auto"}}>
                                <h5>Edit</h5>
                                <span><FaRegEdit /></span>
                            </div>
                        </div>

                        <div className="row py-4 gx-3 gy-3">
                            <div className="col-4">
                                <div className="am_field">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                    // value={formData.firstName}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="am_field">
                                    <label>Country </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                    // value={formData.lastName}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="am_field">
                                    <label>Addres </label>
                                    <input
                                        type="email"
                                        name="email"
                                    // value={formData.email}
                                    // onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default EditProfile;
