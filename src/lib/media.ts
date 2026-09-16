/** Founder portraits and site illustrations under /public/images */

export const LOGOS = {
  mark: "/images/logo/logo.png",
} as const;

export const FOUNDER = {
  portrait: "/images/founder-image/George.png",
  office: "/images/founder-image/george-antony-office.jpg",
  alt: "/images/founder-image/george-antony-alt.jpg",
} as const;

export const SITE_ART = {
  handshakeDeal: "/images/site-image/acheivement-removebg-preview.png",
  goldHand:
    "/images/site-image/A_monochrome_photo_of_an_african_hand_holding_a_stack_of_golden-removebg-preview.png",
  moneyBag: "/images/site-image/indian-money-removebg-preview.png",
  bars: "/images/site-image/still-bars-removebg-preview.png",
  handshakeRupee: "/images/site-image/still-handshake-removebg-preview.png",
  rupeeNote: "/images/site-image/still-rupee-removebg-preview.png",
  trade: "/images/site-image/trade-removebg-preview.png",
} as const;

const DOODLE_DARK = "/images/Doodle/Doodle/Black Doodle";
const DOODLE_LIGHT = "/images/Doodle/Doodle/White";

function doodle(folder: string, file: string) {
  return encodeURI(`${folder}/${file}`);
}

/** Paper theme uses the White set; Ink theme uses Black Doodle (white stroke). */
export const DOODLES = {
  light: {
    chart: doodle(DOODLE_LIGHT, "For white-01.png"),
    pyramid: doodle(DOODLE_LIGHT, "For white-02.png"),
    flow: doodle(DOODLE_LIGHT, "For white-03.png"),
    bars: doodle(DOODLE_LIGHT, "For white-05.png"),
    pie: doodle(DOODLE_LIGHT, "For white-07.png"),
    arrow: doodle(DOODLE_LIGHT, "For white-10.png"),
    percent: doodle(DOODLE_LIGHT, "For white-12.png"),
  },
  dark: {
    chart: doodle(DOODLE_DARK, "Untitled-2-01.png"),
    pyramid: doodle(DOODLE_DARK, "Untitled-2-02.png"),
    flow: doodle(DOODLE_DARK, "Untitled-2-03.png"),
    bars: doodle(DOODLE_DARK, "Untitled-2-05.png"),
    pie: doodle(DOODLE_DARK, "Untitled-2-07.png"),
    arrow: doodle(DOODLE_DARK, "Untitled-2-10.png"),
    percent: doodle(DOODLE_DARK, "Untitled-2-12.png"),
  },
} as const;
