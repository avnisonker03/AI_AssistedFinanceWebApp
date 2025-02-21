import React from "react";
import { Home, Github, Linkedin, Info, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg">
      {/* Top divider with proper styling */}
      <div className="w-full border-b border-gray-700 h-1"></div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center md:text-left"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Home className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold text-gray-100">SpendWise</h2>
            </div>
            <p className="text-sm text-gray-400 mt-1">Smart Finance. Smarter You.</p>
          </motion.div>

          <div className="flex items-center space-x-8">
            {[
              { icon: <Home className="h-4 w-4" />, text: "Home"  },
              { icon: <Info className="h-4 w-4" />, text: "About" },
              { icon: <Phone className="h-4 w-4" />, text: "Contact" }
            ].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span>{item.text}</span>
              </motion.a>
            ))}
          </div>

          <div className="flex space-x-4">
            {[
              { icon: <Github className="h-5 w-5" />,url:'https://github.com/avnisonker03'},
              { icon: <Linkedin className="h-5 w-5" />,url:'http://www.linkedin.com/in/avni-sonker-85a054256' }
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.url}
                target="_blank"
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Middle divider - clean and simple */}
        <div className="border-t border-gray-700 my-8"></div>

        <motion.div
          className="text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} SpendWise. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            {["Privacy Policy", "Terms of Service"].map((text, index) => (
              <motion.a
                key={index}
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                {text}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}