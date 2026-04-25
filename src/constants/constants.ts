export const NAV_ITEMS = [
  {
    label: "NEW RELEASES",
    href: "/new-releases",
    children: [
      { label: "Marvel", href: "/new-releases/marvel" },
      { label: "DC", href: "/new-releases/dc" },
      { label: "Image Comics", href: "/new-releases/image" },
      { label: "Indie", href: "/new-releases/indie" },
    ],
  },
  {
    label: "SHOP ALL",
    href: "/shop",
    children: [
      { label: "Comics", href: "/shop/comics" },
      { label: "Trading Cards", href: "/shop/trading-cards" },
      { label: "Collectibles", href: "/shop/collectibles" },
      { label: "Manga", href: "/shop/manga" },
    ],
  },
  {
    label: "GRADED COMICS",
    href: "https://shortboxed.com/u/heroes_and_champions_comics",
    children: [
      {
        label: "Visit Shortboxed Store",
        href: "https://shortboxed.com/u/heroes_and_champions_comics",
      },
    ],
  },
  {
    label: "SELL / TRADE",
    href: "/sell-trade",
    children: [
      { label: "Sell Your Comics", href: "/sell-trade/sell" },
      { label: "Trade In", href: "/sell-trade/trade" },
      { label: "Get an Appraisal", href: "/sell-trade/appraisal" },
    ],
  },
  {
    label: "EBAY STORE",
    href: "https://www.ebay.com/str/ccs1comics",
    children: [
      {
        label: "Current Listings",
        href: "https://www.ebay.com/str/ccs1comics",
      },
      {
        label: "Ending Soon",
        href: "https://www.ebay.com/str/ccs1comics?_sop=1&_tab=shop",
      },
    ],
  },
  {
    label: "ABOUT",
    href: "/about",
    children: [
      { label: "Locations", href: "/about/locations" },
      { label: "Contact Us", href: "/about/contact" },
    ],
  },
];

export const FOOTER_SECTIONS = [
  {
    heading: "Quick Links",
    items: [
      { label: "Home", href: "/" },
      { label: "New Releases", href: "/new-releases" },
      { label: "Shop All", href: "/shop" },
      { label: "Sell / Trade", href: "/sell-trade" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Locations",
    items: [
      {
        label: "Sunnyvale Store",
        href: "/locations",
        address: "574 E El Camino Real, Sunnyvale, CA 94087",
        phone: "(408) 732-8775",
      },
      {
        label: "Willow Glen Store",
        href: "/locations",
        address: "2050 Lincoln Ave, San Jose, CA 95125",
        phone: "(408) 266-1103",
      },
    ],
  },
  {
    heading: "Contact",
    items: [
      {
        label: "heroesandchampions@gmail.com",
        href: "mailto:heroesandchampions@gmail.com",
      },
    ],
  },
];

export const FOLLOW_US = [
  { label: "Facebook", href: "https://www.facebook.com/HeroesaChampions" },
  { label: "Instagram", href: "https://www.instagram.com/heroes.champions" },
];

export const LOCATIONS = [
  {
    id: "sunnyvale",
    name: "Heroes & Champions",
    subtitle: "Sunnyvale",
    address: "574 E El Camino Real",
    cityStateZip: "Sunnyvale, CA 94087",
    note: "Located in Pavlina Plaza Shopping Center",
    phone: "(408) 732-8775",
    phoneRaw: "+14087328775",
    hours: [
      { day: "Monday", hours: "10 AM – 6 PM" },
      { day: "Tuesday", hours: "10 AM – 6 PM" },
      { day: "Wednesday", hours: "10 AM – 6 PM" },
      { day: "Thursday", hours: "10 AM – 6 PM" },
      { day: "Friday", hours: "10 AM – 6 PM" },
      { day: "Saturday", hours: "10 AM – 6 PM" },
      { day: "Sunday", hours: "11 AM – 6 PM" },
    ],
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101482.244493532!2d-122.12175253706006!3d37.358601131632966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb67085bd5af3%3A0x7e6a0acafb606537!2sHeroes%20%26%20Champions!5e0!3m2!1sen!2sus!4v1777096927191!5m2!1sen!2sus",
    directionsUrl:
      "https://maps.google.com/?q=574+E+El+Camino+Real,+Sunnyvale,+CA+94087",
  },
  {
    id: "willow-glen",
    name: "Heroes & Champions",
    subtitle: "Willow Glen",
    address: "2050 Lincoln Ave",
    cityStateZip: "San Jose, CA 95125",
    note: null,
    phone: "(408) 266-1103",
    phoneRaw: "+14082661103",
    hours: [
      { day: "Monday", hours: "11 AM – 6 PM" },
      { day: "Tuesday", hours: "11 AM – 6 PM" },
      { day: "Wednesday", hours: "11 AM – 6 PM" },
      { day: "Thursday", hours: "11 AM – 6 PM" },
      { day: "Friday", hours: "11 AM – 6 PM" },
      { day: "Saturday", hours: "11 AM – 6 PM" },
      { day: "Sunday", hours: "11 AM – 6 PM" },
    ],
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3174.0588095811145!2d-121.8942660651123!3d37.29374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808e336f81e14501%3A0xe8e3085fe3dd389d!2sHeroes%20%26%20Champions%20Willow%20Glen!5e0!3m2!1sen!2sus!4v1777097291688!5m2!1sen!2sus",
    directionsUrl:
      "https://maps.google.com/?q=2050+Lincoln+Ave,+San+Jose,+CA+95125",
  },
];
