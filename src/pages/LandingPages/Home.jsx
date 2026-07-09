import Hero from "@/components/LandingPageComponents/Hero";
import HomeFeatures from "@/components/LandingPageComponents/HomeFeatures";
import Category from "@/components/LandingPageComponents/Category";
import HomeNewArrivals from "@/components/LandingPageComponents/HomeNewArrivals";
import HomeShowcase from "@/components/LandingPageComponents/HomeShowcase";
import Homefeagnace from "@/components/LandingPageComponents/Homefeagnace";
import HomeCommitment from "@/components/LandingPageComponents/HomeCommitment";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeFeatures />
      <Category />
      <HomeNewArrivals />
      <HomeShowcase />
      <Homefeagnace />
      <HomeCommitment />
    </>
  );
}