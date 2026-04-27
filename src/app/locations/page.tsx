import { LOCATIONS } from "@/constants/constants";

export default function LocationsPage() {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <main className="bg-gray-100 min-h-screen pb-12">
      {/* Page Header */}
      <div className="bg-[#222222] border-b-4 border-red-600 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-3xl font-extrabold uppercase tracking-tight">
            Our Locations
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Two Bay Area stores ready to serve your comic collecting needs.
          </p>
        </div>
      </div>

      {/* Location Cards */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row"
          >
            {/* Map — left */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0 h-64 md:h-auto min-h-[280px]">
              <iframe
                src={loc.mapEmbed}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: "block",
                  height: "100%",
                  minHeight: "280px",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map – ${loc.name} ${loc.subtitle}`}
              />
            </div>

            {/* Details — right */}
            <div className="flex flex-col flex-1 p-6 gap-5">
              {/* Title */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                  {loc.subtitle} - {loc.name}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 flex-1">
                {/* Address & Phone & Buttons */}
                <div className="flex flex-col gap-4 min-w-[180px]">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {loc.address}
                      <br />
                      {loc.cityStateZip}
                    </p>
                    {loc.note && (
                      <p className="text-xs text-gray-400 mt-1 italic">
                        {loc.note}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${loc.phoneRaw}`}
                      className="text-gray-800 text-sm hover:text-red-600 transition-colors"
                    >
                      {loc.phone}
                    </a>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto pt-2">
                    <a
                      href={loc.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded text-center transition-colors"
                    >
                      Get Directions
                    </a>
                    <a
                      href={`tel:${loc.phoneRaw}`}
                      className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold px-4 py-2 rounded text-center transition-colors"
                    >
                      Call Store
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Store Hours
                  </p>
                  <table className="w-full text-sm">
                    <tbody>
                      {loc.hours.map(({ day, hours }) => {
                        const isToday = day === todayName;
                        return (
                          <tr
                            key={day}
                            className={
                              isToday
                                ? "text-red-600 font-bold"
                                : "text-gray-700"
                            }
                          >
                            <td className="py-0.5 pr-4 w-28">
                              {day}
                              {isToday && (
                                <span className="ml-1.5 text-xs bg-red-600 text-white rounded px-1 py-0.5 font-semibold align-middle">
                                  Today
                                </span>
                              )}
                            </td>
                            <td className="py-0.5">{hours}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
