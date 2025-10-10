import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faComments, 
  faTimes, 
  faPaperPlane, 
  faRobot,
  faUser,
  faHeart,
  faStore,
  faTruck,
  faClock,
  faPhone,
  faMapMarkerAlt,
  faShoppingCart,
  faCreditCard,
  faShieldAlt,
  faSmile,
  faStar,
  faGem
} from "@fortawesome/free-solid-svg-icons";

const ChatWidget = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "👋 Hello! Welcome to ReBuy.lk! I'm your shopping assistant. How can I help you today?",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello there! 🌊 Welcome to ReBuy.lk - your favorite second-hand marketplace! What can I help you find today?";
    } else if (msg.includes("how are you")) {
      return "I'm doing great! Ready to help you find some amazing deals! 💎";

    } else if (msg.includes("thank") || msg.includes("thank you")) {
      return "You're welcome! Happy to help! 🌟";

    } else if (msg.includes("address") || msg.includes("location") || msg.includes("where")) {
      return "🏠 We're located at: 77A, Market Street, Colombo 01, Sri Lanka. Come visit us!";

    } else if (msg.includes("contact") || msg.includes("phone") || msg.includes("call")) {
      return "📞 Reach us at: +94 77 321 4567 | 📧 Email: support@rebuy.lk | 💬 WhatsApp: +94 77 123 4567";

    } else if (msg.includes("delivery") || msg.includes("shipping") || msg.includes("dispatch")) {
      return "🚚 We offer FREE islandwide delivery! Orders usually arrive within 2-5 business days. Express delivery available for Colombo area!";

    } else if (msg.includes("hours") || msg.includes("time") || msg.includes("open")) {
      return "🕒 We're here for you 24/7 online! 📍 Physical store: Mon-Sun (8:00 AM - 10:00 PM)";

    } else if (msg.includes("product") || msg.includes("buy") || msg.includes("item") || msg.includes("shop")) {
      return "🛍️ Browse thousands of quality second-hand items! Electronics, Fashion, Home Appliances & more! Check our latest collections!";

    } else if (msg.includes("price") || msg.includes("cost") || msg.includes("expensive")) {
      return "💰 We offer the best prices in Sri Lanka! All items are quality-checked and fairly priced. Great value guaranteed!";

    } else if (msg.includes("return") || msg.includes("refund") || msg.includes("exchange")) {
      return "🔄 7-day return policy! If you're not happy with your purchase, we'll make it right!";

    } else if (msg.includes("payment") || msg.includes("pay") || msg.includes("card")) {
      return "💳 We accept: Credit/Debit Cards, Bank Transfer! Secure payments guaranteed!";

    } else if (msg.includes("quality") || msg.includes("condition")) {
      return "⭐ All items go through strict quality checks! We ensure everything works perfectly before listing!";

    } else if (msg.includes("warranty") || msg.includes("guarantee")) {
      return "🛡️ 3-month warranty on electronics! Your satisfaction is our priority!";

    } else if (msg.includes("sell") || msg.includes("seller")) {
      return "💰 Want to sell? Download our seller app! Get instant quotes and sell your items quickly!";

    } else if (msg.includes("app") || msg.includes("download")) {
      return "📱 Get our mobile app! Available on iOS & Android. Better experience, faster shopping!";

    } else if (msg.includes("love") || msg.includes("amazing") || msg.includes("good")) {
      return "😍 Thank you! We love making your shopping experience wonderful!";

    } else if (msg.includes("discount") || msg.includes("offer") || msg.includes("sale")) {
      return "🎁 Special offers available! Check our 'Deals of the Day' section for exclusive discounts!";

    } else if (msg.includes("electronics") || msg.includes("phone") || msg.includes("laptop") || msg.includes("headphone") || msg.includes("TV")) {
      return "📱 We have a wide range of certified pre-owned electronics! All tested and guaranteed!";

    } else {
      return "🤖 Email or Call us or visit ReBuy store for details! , 📞 Reach us at: +94 77 321 4567 , 📧 Email: support@rebuy.lk,  🏠 We're located at: 77A, Market Street, Colombo 01, Sri Lanka. ";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    const newUserMessage = { 
      sender: "user", 
      text: userMsg,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Simulate typing delay
    setTimeout(() => {
      const botReply = getBotResponse(userMsg);
      const newBotMessage = { 
        sender: "bot", 
        text: botReply,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, newBotMessage]);
    }, 800);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col overflow-hidden z-50 font-sans"
        style={{ maxHeight: "600px", height: "80vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 8
                  }}
                >
                  <FontAwesomeIcon icon={faRobot} className="text-xl" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">ReBuy.lk Assistant</h3>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </motion.button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50 to-cyan-50">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
              )}
              
              <div className={`max-w-[80%] ${msg.sender === "user" ? "order-first" : ""}`}>
                <div className={`flex items-center gap-2 mb-1 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <span className="text-xs text-blue-600 font-medium">
                    {msg.sender === "bot" ? "ReBuy Assistant" : "You"}
                  </span>
                  <span className="text-xs text-blue-400">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "bot"
                      ? "bg-white text-gray-800 border border-blue-100 rounded-tl-none shadow-sm"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-md"
                  }`}
                >
                  {msg.text}
                </motion.div>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 py-3 bg-white border-t border-blue-100">
          <div className="flex flex-wrap gap-2 justify-center">
            {["Products", "Delivery", "Payment", "Contact", "Returns", "Offers"].map((suggestion) => (
              <motion.button
                key={suggestion}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setInput(suggestion);
                  setTimeout(handleSend, 100);
                }}
                className="px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all duration-200 border border-blue-200 font-medium flex items-center gap-1"
              >
                <FontAwesomeIcon icon={
                  suggestion === "Products" ? faShoppingCart :
                  suggestion === "Delivery" ? faTruck :
                  suggestion === "Payment" ? faCreditCard :
                  suggestion === "Contact" ? faPhone :
                  suggestion === "Returns" ? faShieldAlt :
                  faStar
                } className="text-xs" />
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-blue-200 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full px-4 py-3 rounded-2xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm bg-blue-50 placeholder-blue-300 text-blue-800"
                placeholder="Type your message here..."
              />
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: input ? [0, 15, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <FontAwesomeIcon icon={faSmile} className="text-blue-400 text-lg" />
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim()}
              className={`px-5 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                input.trim() 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl" 
                  : "bg-blue-200 text-blue-400 cursor-not-allowed"
              }`}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </motion.button>
          </div>
          <p className="text-xs text-center text-blue-500 mt-3 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-blue-400" />
            Powered by ReBuy.lk • Your trusted marketplace
            <FontAwesomeIcon icon={faHeart} className="text-red-400" />
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWidget;