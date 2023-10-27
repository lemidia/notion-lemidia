import Navbar from "./_components/navbar";

export default function LootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <Navbar />
      <main className="h-full">{children}</main>
    </div>
  );
}
