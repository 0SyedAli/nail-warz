import AboutHero from "@/components/about/AboutHero";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";

const About = () => {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="About Us" />
            <div className="container my-5">
                <AboutHero />
                <p className="battle-desc mw-100">Operated by business professionals, marketing experts, and nail enthusiasts, Nail Warz blends
                    beauty, technology, and culture to offer a dedicated digital community for all things nail care. From
                    intelligent search engines and seamless booking to interactive Battlez that celebrate artistry, the
                    platform delivers both structure and creativity to nail care.</p>
                <p className="battle-desc mw-100">For nail salons and technicians, Nail Warz provides new opportunities to gain visibility, manage
                    their business with ease, and showcase their talent within a growing community. Guided by our
                    core values of honesty, transparency, innovation, and fun, Nail Warz is setting a new standard for
                    nail care.</p>
                <p className="battle-desc mw-100">Nail Warz is your one-stop shop for all things nail care.</p>
            </div>
            <AppCTASection />
            <Footer />
        </>
    )
}

export default About