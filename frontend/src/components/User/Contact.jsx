import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faClock,
  faUsers,
  faHeadset,
  faGlobe,
  faShieldAlt,
  faRocket,
  faCheckCircle,
  faStar,
  faMessage,
  faHandshake,
  faAward,
  faHeart,
  faTruck,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";
import ChatWidget from "../User/ChatWidget";

export default function ContactUs() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const contactMethods = [
    {
      icon: faPhone,
      title: "Phone Support",
      details: "+94 77 321 4567",
      description: "Mon-Sun: 7:00 AM - 11:00 PM",
      color: "from-blue-500 to-cyan-500",
      buttonText: "Call Now",
      action: "tel:+94773214567"
    },
    {
      icon: faEnvelope,
      title: "Email Support",
      details: "support@rebuy.lk",
      description: "Average response time: 2 hours",
      color: "from-blue-600 to-blue-400",
      buttonText: "Send Email",
      action: "mailto:support@rebuy.lk"
    },
    {
      icon: faHeadset,
      title: "Live Chat",
      details: "24/7 Available",
      description: "Instant connection with our team",
      color: "from-cyan-500 to-blue-500",
      buttonText: "Start Chat",
      action: "chat"
    }
  ];

  const features = [
    {
      icon: faShieldAlt,
      title: "100% Secure",
      description: "Bank-level security for all transactions",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: faRocket,
      title: "Fast Response",
      description: "Get answers within minutes",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: faUsers,
      title: "Expert Team",
      description: "Knowledgeable support specialists",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: faCheckCircle,
      title: "Problem Solved",
      description: "99% issues resolved in first contact",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers", icon: faUsers, color: "text-blue-500" },
    { number: "24/7", label: "Support Available", icon: faClock, color: "text-green-500" },
    { number: "< 5min", label: "Avg Response", icon: faRocket, color: "text-purple-500" },
    { number: "99%", label: "Satisfaction Rate", icon: faStar, color: "text-amber-500" }
  ];

  const companyHighlights = [
    {
      icon: faAward,
      title: "Quality Guaranteed",
      description: "Every item is thoroughly inspected and verified",
      color: "text-amber-500"
    },
    {
      icon: faShieldAlt,
      title: "Safe & Secure",
      description: "Your transactions are protected with advanced security",
      color: "text-green-500"
    },
    {
      icon: faHeart,
      title: "Customer First",
      description: "We prioritize your satisfaction above everything",
      color: "text-pink-500"
    },
    {
      icon: faRocket,
      title: "Fast Delivery",
      description: "Islandwide delivery within 2-5 business days",
      color: "text-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100">
      <Navbar />

      {/* Enhanced Header Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Additional floating elements for more dynamism */}
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-cyan-300/15 rounded-full blur-xl animate-pulse delay-500"></div>
          
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_70%)]"></div>
        </div>

        <div className="container mx-auto px-6 py-24 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faHandshake} className="mr-2" />
              We're Here to Help 24/7
            </motion.span>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Get in Touch with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                ReBuy.lk
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Your trusted marketplace for quality second-hand items. Our dedicated support team 
              is ready to assist you with any questions or concerns.
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <FontAwesomeIcon icon={stat.icon} className={`${stat.color} text-lg`} />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="#f8fafc" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="container mx-auto px-6 py-16 -mt-2 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Company Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Why Choose ReBuy.lk */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Why Choose ReBuy.lk?</h2>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                We're revolutionizing the second-hand market in Sri Lanka with our commitment to 
                quality, security, and exceptional customer service.
              </p>
              
              <div className="grid gap-6">
                {companyHighlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 transition-all duration-300 border border-gray-100"
                  >
                    <div className={`p-3 rounded-xl bg-white shadow-sm border border-gray-200`}>
                      <FontAwesomeIcon icon={highlight.icon} className={`${highlight.color} text-xl`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{highlight.title}</h3>
                      <p className="text-gray-600 text-sm">{highlight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Company Info - Less Blue */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
                Our Location & Hours
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-800">Headquarters</div>
                    <div className="text-gray-600">77A, Market Street, Colombo 01, Sri Lanka</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <FontAwesomeIcon icon={faClock} className="text-green-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-800">Business Hours</div>
                    <div className="text-gray-600">Monday - Sunday: 7:00 AM - 11:00 PM</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <FontAwesomeIcon icon={faGlobe} className="text-purple-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-800">Service Coverage</div>
                    <div className="text-gray-600">Islandwide delivery across Sri Lanka</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Get in Touch</h2>
                <p className="text-gray-600 text-lg">Choose the method that works best for you</p>
              </div>
              
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-start gap-6 relative z-10">
                    {/* Icon with enhanced blue gradient and animation */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 0.5 }}
                      className={`p-4 rounded-xl bg-gradient-to-r ${method.color} shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <FontAwesomeIcon icon={method.icon} className="text-white text-2xl relative z-10" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                        {method.title}
                      </h3>
                      <div className="text-2xl font-semibold text-gray-900 mb-1 group-hover:text-blue-800 transition-colors duration-300">
                        {method.details}
                      </div>
                      <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                        {method.description}
                      </p>
                      
                      {method.action === "chat" ? (
                        <motion.button
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsChatOpen(true)}
                          className={`px-6 py-3 bg-gradient-to-r ${method.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 relative overflow-hidden group`}
                        >
                          {/* Button shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <FontAwesomeIcon icon={faMessage} className="relative z-10" />
                          <span className="relative z-10">{method.buttonText}</span>
                        </motion.button>
                      ) : (
                        <motion.a
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          href={method.action}
                          className={`px-6 py-3 bg-gradient-to-r ${method.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 relative overflow-hidden group`}
                        >
                          {/* Button shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <FontAwesomeIcon icon={method.icon} className="relative z-10" />
                          <span className="relative z-10">{method.buttonText}</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover border animation */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300"></div>
                </motion.div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Support Promise</h3>
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`text-center p-4 rounded-2xl ${feature.bgColor} border border-gray-200 hover:shadow-md transition-all duration-300`}
                  >
                    <div className={`w-12 h-12 mx-auto bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm border border-gray-200`}>
                      <FontAwesomeIcon icon={feature.icon} className={`${feature.color} text-lg`} />
                    </div>
                    <div className="font-bold text-gray-800 mb-1">{feature.title}</div>
                    <div className="text-gray-600 text-xs leading-relaxed">{feature.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Visit Our Flagship Store</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience our premium service in person. Visit our Colombo store to see our 
            quality-checked items and meet our friendly team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
        >
          <iframe
            title="ReBuy.lk Colombo Store"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798239732841!2d79.84845741528785!3d6.927169220388785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596b8d0a7c4d%3A0x6a19780421d64c8c!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1642345678901!5m2!1sen!2sus"
            className="w-full h-[450px] border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
          >
            <FontAwesomeIcon icon={faTruck} className="text-blue-500 text-3xl mb-4" />
            <h3 className="font-bold text-gray-800 mb-2">Free Delivery</h3>
            <p className="text-gray-600 text-sm">Islandwide delivery on all orders</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
          >
            <FontAwesomeIcon icon={faShieldAlt} className="text-green-500 text-3xl mb-4" />
            <h3 className="font-bold text-gray-800 mb-2">Quality Checked</h3>
            <p className="text-gray-600 text-sm">All items thoroughly inspected</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
          >
            <FontAwesomeIcon icon={faUndo} className="text-purple-500 text-3xl mb-4" />
            <h3 className="font-bold text-gray-800 mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm">7-day return policy</p>
          </motion.div>
        </div>
      </section>

      {/* Chat Widget */}
      <AnimatePresence>
        {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}