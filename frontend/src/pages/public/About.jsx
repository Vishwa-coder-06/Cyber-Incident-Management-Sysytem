import Navbar from "../../components/public/PublicNavbar";
import AboutHero from "../../components/public/AboutHero";
import StatsSection from "../../components/public/StatsSection";
import MissionSection from "../../components/public/MissionSection";

function About() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <StatsSection />
      <MissionSection />
    </>
  );
}

export default About;