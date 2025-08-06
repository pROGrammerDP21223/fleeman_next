import Image from "next/image";
import ConditionalForm from "./_components/ConditionalForm";

import HomeExtra from "./_components/HomeExtra";
import Banner from "./_components/Banner";
import About from "./_components/About";
import HomeForm from "./_components/HomeForm";

export default function Home() {
  return (
    <div>
      <Banner />
     <HomeForm />
      <About />
      <HomeExtra />
    </div>
  );
}
