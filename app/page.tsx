"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleShopNow = () => {
    router.push("/products");
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Blur */}
      <Image
        src="/bg-image.jpg"
        alt="Background Image"
        width={1920}
        height={1080}
        className="absolute w-full h-full object-cover blur-sm scale-105"
        priority
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#171A1F66]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          Order Fresh in Bulk
        </h1>
        <p className="text-white text-lg md:text-xl mb-6">
          Shop fresh fruits and vegetables in bulk at unbeatable prices.
        </p>
        <button
          onClick={handleShopNow}
          className="bg-sky-500 hover:bg-sky-600 text-white w-full md:w-auto md:px-30 font-semibold px-6 py-3 rounded-md transition cursor-pointer"
        >
          Shop Now
        </button>
      </div>
    </main>
  );
}
