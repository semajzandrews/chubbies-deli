import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Visit from "./components/Visit";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Menu />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
