import React from "react";
import { FaWhatsapp, FaGlobe, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4 text-center fixed bottom-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm">
            &copy; {currentYear} Futurannet Design. Todos os direitos
            reservados.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5598988670641"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors"
              title="WhatsApp"
            >
              <FaWhatsapp className="text-xl" />
            </a>

            <a
              href="https://www.futurannet.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors"
              title="Website"
            >
              <FaGlobe className="text-xl" />
            </a>

            <a
              href="https://www.instagram.com/futurannetdesigner"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition-colors"
              title="Instagram"
            >
              <FaInstagram className="text-xl" />
            </a>
          </div>

          <span className="text-gray-400 text-sm">
            Desenvolvido com <span className="text-red-500">♥</span> pela
            Futurannet
          </span>
        </div>
      </div>
    </footer>
  );
}
