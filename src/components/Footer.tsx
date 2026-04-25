import Image from "next/image";
import Link from "next/link";
import logo from "@public/logo.png";
import { FOOTER_SECTIONS, FOLLOW_US } from "@/constants/constants";

export function Footer() {
  return (
    <footer className="w-full flex flex-col bg-black text-white">
      <div className="flex flex-row flex-wrap px-12 pt-8 pb-8">
        <div className="w-full sm:w-1/4 flex flex-col items-start pr-4 mb-6">
          <Image
            src={logo}
            alt="Heroes & Champions logo"
            className="h-[70px] w-[170px] object-scale-down mb-3"
          />
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div
            key={section.heading}
            className="w-full sm:w-1/4 flex flex-col items-start gap-2 pr-4 mb-6"
          >
            <p className="font-bold text-sm uppercase tracking-wider mb-1">
              {section.heading}
            </p>

            {section.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5 w-full">
                <Link
                  href={item.href}
                  className="text-white/65 hover:text-white text-sm transition-colors duration-200"
                >
                  {item.label}
                </Link>

                {"address" in item && (
                  <>
                    <p className="text-white/45 text-xs leading-relaxed">
                      {item.address}
                    </p>
                    <p className="text-white/45 text-xs">{item.phone}</p>
                  </>
                )}
              </div>
            ))}

            {section.heading === "Contact" && (
              <>
                <p className="font-bold text-sm uppercase tracking-wider mt-4 mb-1">
                  Follow Us
                </p>

                {FOLLOW_US.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white/65 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center py-4">
        <div className="w-9/10 border-t border-white/20 mb-4" />
        <p className="text-white/40 text-xs">
          © 2026 Heroes & Champions Comics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
