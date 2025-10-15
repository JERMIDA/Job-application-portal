import logo from '../../assets/images/debo.png';

const Footer = () => {
  return (
    <footer className="bg-debo-blue text-white mt-12 w-full">
      <div className="w-full max-w-7xl mx-auto py-6 md:py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-2 md:px-4">
        <div className="mb-4 flex flex-col items-start">
           <div className="bg-white rounded-full shadow-lg p-2 mb-4 flex items-center justify-center w-16 h-16 md:w-24 md:h-24">
             <img src={logo} alt="DEBO Engineering" className="w-12 h-12 md:w-20 md:h-20 object-contain" />
           </div>
          <div className="text-md text-gray-200 font-semibold">
            <span className="font-bold text-white">Debo Engineering</span>&nbsp;is a technology company that began as an agritech innovator in Ethiopia and has since evolved into a digital solutions provider, offering web and mobile app development, AI applications, and IoT solutions globally.
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-debo-light-blue mb-4">Services</h2>
          <div className="flex flex-col space-y-2">
            <a href="/services" className="hover:text-debo-light-blue transition">Website Development</a>
            <a href="/services" className="hover:text-debo-light-blue transition">Mobile App Development</a>
            <a href="/services" className="hover:text-debo-light-blue transition">E-commerce</a>
            <a href="/services" className="hover:text-debo-light-blue transition">ERP Systems</a>
            <a href="/services" className="hover:text-debo-light-blue transition">School Management Systems</a>
            <a href="/services" className="hover:text-debo-light-blue transition">Health Systems</a>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-debo-light-blue mb-4">Support</h2>
          <div className="flex flex-col space-y-2">
            <a href="/contacts" className="hover:text-debo-light-blue transition">Help</a>
            <a href="/faq" className="hover:text-debo-light-blue transition">FAQ</a>
            <a href="/contacts" className="hover:text-debo-light-blue transition">Contact Us</a>
            <a href="/privacy-policy" className="hover:text-debo-light-blue transition">Privacy Policy</a>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-debo-light-blue mb-4">Contact Info</h2>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-debo-light-blue">📍</span> Jimma, Ethiopia
            </p>
            <a href="mailto:contact@deboengineering.com" className="flex items-center gap-2 hover:text-debo-light-blue transition">
              <span className="text-debo-light-blue">✉️</span> contact@deboengineering.com
            </a>
            <p className="flex items-center gap-2">
              <span className="text-debo-light-blue">📞</span> +251 94 954 0860
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://facebook.com/deboengineering" className="hover:text-blue-400 transition" aria-label="Facebook">🌐</a>
              <a href="https://www.linkedin.com/company/debo-engineering" className="hover:text-blue-400 transition" aria-label="LinkedIn">💼</a>
              <a href="https://t.me/deboengineering" className="hover:text-blue-400 transition" aria-label="Telegram">✈️</a>
              <a href="https://www.youtube.com/channel/UCSFW4-JLb7X5Y8-ThBX5NFg" className="hover:text-blue-400 transition" aria-label="YouTube">▶️</a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-debo-blue border-t border-debo-light-blue text-center py-2 md:py-4 text-gray-300 text-xs md:text-sm w-full">
        © 2025 Debo Engineering, All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;