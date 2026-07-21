import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  PiInstagramLogo, PiFacebookLogo, PiTwitterLogo,
  PiYoutubeLogo, PiEnvelope, PiPhone, PiMapPin
} from "react-icons/pi";

const Footer = () => {
  return (
    <footer style={{ background: "linear-gradient(145deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
  
  {/* Main container — centers everything */}
  <div className="max-w-6xl mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

    {/* Brand */}
    <div className="flex flex-col gap-4">
      <div className="w-fit">
        <Logo />
      </div>
      <p className="text-indigo-300 text-sm leading-relaxed max-w-xs">
        Your one-stop destination for premium products. Fast shipping, easy returns, and unbeatable prices.
      </p>
      <div className="flex items-center gap-3">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-indigo-300 hover:text-white transition-all" style={{ background: "rgba(255,255,255,0.08)" }}><PiInstagramLogo size={18} /></a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-indigo-300 hover:text-white transition-all" style={{ background: "rgba(255,255,255,0.08)" }}><PiFacebookLogo size={18} /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-indigo-300 hover:text-white transition-all" style={{ background: "rgba(255,255,255,0.08)" }}><PiTwitterLogo size={18} /></a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-indigo-300 hover:text-white transition-all" style={{ background: "rgba(255,255,255,0.08)" }}><PiYoutubeLogo size={18} /></a>
      </div>
    </div>

    {/* Contact */}
    <div className="flex flex-col gap-4">
      <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contact Us</h4>
      <ul className="flex flex-col gap-4">
        <li className="flex items-start gap-3">
          <PiMapPin size={17} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <span className="text-indigo-300 text-sm leading-relaxed">123 ShopZone Street, Islamabad, Pakistan</span>
        </li>
        <li className="flex items-center gap-3">
          <PiPhone size={17} className="text-indigo-400 flex-shrink-0" />
          <a href="tel:+923000000000" className="text-indigo-300 text-sm hover:text-white transition-colors">+92 300 3315867</a>
        </li>
        <li className="flex items-center gap-3">
          <PiEnvelope size={17} className="text-indigo-400 flex-shrink-0" />
          <a href="mailto:support@shopzone.com" className="text-indigo-300 text-sm hover:text-white transition-colors">support@shopzone.com</a>
        </li>
      </ul>
      <div className="mt-2">
        <p className="text-white text-xs font-semibold mb-2 uppercase tracking-wide">Newsletter</p>
        <div className="flex gap-2">
          <input type="email" placeholder="your@email.com" className="flex-1 h-9 px-3 rounded-lg text-xs outline-none text-gray-800" style={{ background: "rgba(255,255,255,0.9)" }} />
          <button className="h-9 px-4 rounded-lg text-white text-xs font-bold transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>Subscribe</button>
        </div>
      </div>
    </div>

  </div>

  {/* Divider */}
  <div className="max-w-6xl mx-auto px-8 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

  {/* Bottom bar */}
  <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
    <p className="text-indigo-400 text-xs">© {new Date().getFullYear()} ShopZone. All rights reserved.</p>
    <div className="flex items-center gap-6">
      <Link to="/privacy" className="text-indigo-400 text-xs hover:text-white transition-colors">Privacy Policy</Link>
      <Link to="/terms" className="text-indigo-400 text-xs hover:text-white transition-colors">Terms of Service</Link>
      <Link to="/cookies" className="text-indigo-400 text-xs hover:text-white transition-colors">Cookie Policy</Link>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-indigo-400 text-xs">We accept:</span>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded text-indigo-200" style={{ background: "rgba(255,255,255,0.1)" }}>VISA</span>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded text-indigo-200" style={{ background: "rgba(255,255,255,0.1)" }}>MC</span>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded text-indigo-200" style={{ background: "rgba(255,255,255,0.1)" }}>PayPal</span>
    </div>
  </div>

</footer>
  );
};

export default Footer;