import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 h-[160px] w-full z-[100] shadow-lg shadow-black/15">
      <div className="h-[100px] w-full flex justify-between items-center bg-[#262626] px-[30px]">
        <div className="flex items-center justify-center">
          <Link href="/" aria-label="Go to home page" className="inline-block">
            <Image
              src={logo}
              alt="Heroes & Champions logo"
              className="h-[95px] w-[234px] cursor-pointer"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex h-[48px] w-[450px] items-center justify-between rounded-full border-[1px] border-white pl-[20px] pr-[1px]">
            <input
              className="h-full w-full bg-transparent text-white placeholder-white/70 outline-none"
              type="search"
              placeholder="Search titles, authors, products"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-[10px]">
          <Link
            href="/login"
            className="text-white/90 hover:text-white text-lg font-semibold"
          >
            Log In
          </Link>
          
          <Link
            href="/login"
            className="text-white/90 hover:text-white text-lg font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <div className="h-[60px] w-full bg-[#295585]">
        
      </div>
    </header>
  );
}
