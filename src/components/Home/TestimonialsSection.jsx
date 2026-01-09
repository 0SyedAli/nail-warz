"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import ScrollReveal from "../animations/ScrollReveal";

const testimonials = [
  {
    name: "Robin Ayala Doe",
    image: "/images/userp1.png",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore magna aliqua.",
  },
  {
    name: "John De marli",
    image: "/images/userp2.png",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Rowhan Smith",
    image: "/images/userp3.png",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Rowhan Smith",
    image: "/images/userp3.png",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="testimonial-section">
      <h2>What Our Happy Client Say</h2>
      <p className="subtitle">
        Things That Make It The Best Place To Start Trading
      </p>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        className="testimonial-slider"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <ScrollReveal direction="down" duration={1}>
              <div className="testimonial-card">
                <div className="avatar">
                  <Image src={item.image} alt={item.name} width={56} height={56} />
                </div>

                <div className="stars">
                  <Stars rating={5} />
                </div>

                <h4>{item.name}</h4>

                <div className="quote">
                  <Image src="/images/quotes.png" alt={item.name} width={83.62} height={58.36} />
                </div>

                <p className="mb-0">{item.text}</p>
              </div>
            </ScrollReveal>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-controls">
        <button className="swiper-prev"><IoChevronBack /></button>
        <button className="swiper-next active"><IoChevronForward /></button>
      </div>
    </section>
  );
}
const Stars = ({ rating }) => (
  <div className="stars">
    {[...Array(5)].map((_, i) => (
      <IoIosStar key={i} color={i < rating ? "#C00606" : "#ccc"} />
    ))}
  </div>
);