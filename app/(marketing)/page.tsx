import Footer from "./_components/footer";
import Heading from "./_components/heading";
import Heros from "./_components/heros";

export default function LandingPage() {
  return (
    <div className="flex flex-col h-full pt-32">
      <div className="flex flex-col flex-1 items-center justify-center md:justify-start text-center gap-y-8 px-10 pb-10 dark:bg-[#1F1F1F]">
        <Heading />
        <Heros />
      </div>
      <Footer />
    </div>
  );
}
