import Image from "next/image";
import logo from "@public/logo.png";

export default function ContactPage() {
  return (
    <main className="bg-gray-100 min-h-screen pb-12">
      {/* Page Header */}
      <div className="bg-[#222222] border-b-4 border-red-600 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-3xl font-extrabold uppercase tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Have a question? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
          {/* Left — contact info */}
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-[#222222] p-8 flex flex-col gap-6 justify-start">
            <Image
              src={logo}
              alt="Heroes & Champions logo"
              className="h-[100px] w-[250px] object-scale-down mb-2"
            />

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Email
              </p>
              <a
                href="mailto:heroesandchampions@gmail.com"
                className="text-white text-sm hover:text-red-400 transition-colors break-all"
              >
                heroesandchampions@gmail.com
              </a>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Sunnyvale
              </p>
              <a
                href="tel:+14087328775"
                className="text-white text-sm hover:text-red-400 transition-colors"
              >
                (408) 732-8775
              </a>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Willow Glen
              </p>
              <a
                href="tel:+14082661103"
                className="text-white text-sm hover:text-red-400 transition-colors"
              >
                (408) 266-1103
              </a>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Response Time
              </p>
              <p className="text-gray-300 text-sm">
                We typically reply within 1–2 business days.
              </p>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="flex flex-col flex-1 p-6 gap-5">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                Send Us a Message
              </h2>
            </div>

            <form
              action={`mailto:heroesandchampions@gmail.com`}
              method="GET"
              className="flex flex-col gap-4 flex-1"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Peter"
                    className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Parker"
                    className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subject
                </label>
                <select
                  name="subject"
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent bg-white"
                >
                  <option value="">Select a topic…</option>
                  <option value="General Question">General Question</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Store Hours / Locations">
                    Store Hours / Locations
                  </option>
                  <option value="Selling / Trading">Selling / Trading</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  name="body"
                  rows={5}
                  placeholder="How can we help you?"
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href="mailto:heroesandchampions@gmail.com"
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded text-center transition-colors"
                >
                  Send Email
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-extrabold text-gray-900">
              Other Ways to Reach Us
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <a
              href="/locations"
              className="flex-1 px-6 py-5 flex items-start gap-4 hover:bg-gray-50 transition-colors group"
            >
              <i className="fa-solid fa-location-dot text-gray-700 text-xl"></i>
              <div>
                <p className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors">
                  Visit a Store
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Stop by either of our two Bay Area locations.
                </p>
              </div>
            </a>
            <a
              href="tel:+14087328775"
              className="flex-1 px-6 py-5 flex items-start gap-4 hover:bg-gray-50 transition-colors group"
            >
              <i className="fa-solid fa-phone text-gray-700 text-xl"></i>
              <div>
                <p className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors">
                  Call Sunnyvale
                </p>
                <p className="text-gray-500 text-xs mt-0.5">(408) 732-8775</p>
              </div>
            </a>
            <a
              href="tel:+14082661103"
              className="flex-1 px-6 py-5 flex items-start gap-4 hover:bg-gray-50 transition-colors group"
            >
              <i className="fa-solid fa-phone text-gray-700 text-xl"></i>
              <div>
                <p className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors">
                  Call Willow Glen
                </p>
                <p className="text-gray-500 text-xs mt-0.5">(408) 266-1103</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
