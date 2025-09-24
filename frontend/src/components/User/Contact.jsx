import React from "react";
import { motion } from "framer-motion";
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
  faStar
} from '@fortawesome/free-solid-svg-icons';
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";

export default function ContactUs() {
  const contactMethods = [
    {
      icon: faPhone,
      title: "Phone Support",
      details: "+94 77 321 4567",
      description: "Mon-Sun: 7:00 AM - 11:00 PM",
      color: "from-blue-500 to-cyan-500",
      buttonText: "Call Now"
    },
    {
      icon: faEnvelope,
      title: "Email Support",
      details: "rebuy@gmail.com",
      description: "Average response time: 2 hours",
      color: "from-purple-500 to-pink-500",
      buttonText: "Send Email"
    },
    {
      icon: faHeadset,
      title: "Live Chat",
      details: "24/7 Available",
      description: "Instant connection with our team",
      color: "from-green-500 to-emerald-500",
      buttonText: "Start Chat"
    }
  ];

  const features = [
    {
      icon: faShieldAlt,
      title: "100% Secure",
      description: "Bank-level security for all your transactions"
    },
    {
      icon: faRocket,
      title: "Fast Response",
      description: "Get answers within minutes, not hours"
    },
    {
      icon: faUsers,
      title: "Expert Team",
      description: "Knowledgeable support specialists"
    },
    {
      icon: faCheckCircle,
      title: "Problem Solved",
      description: "99% of issues resolved in first contact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

      <Navbar />
      {/* Enhanced Header Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 border border-white/20">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              We're Here to Help
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                ReBuy.lk
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Have questions or need assistance? Our dedicated support team is here to help you 
              with anything you need. Fast, friendly, and always available.
            </p>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="#f8fafc" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="container mx-auto px-6 py-16 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Enhanced Company Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Main Image */}
            <div className="relative">
              <img
                src="/contactUs.jpg"
                alt="Our Office"
                className="rounded-3xl shadow-2xl w-full border-4 border-white"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />
                  <div>
                    <div className="font-bold text-lg">4.9/5 Rating</div>
                    <div className="text-blue-100 text-sm">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About ReBuy.lk</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At <span className="font-semibold text-blue-600">ReBuy.lk</span>, we're committed to 
                providing exceptional service to our community of buyers and sellers. Our team is 
                dedicated to making your second-hand shopping experience seamless and enjoyable.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 text-xl" />
                  <div>
                    <div className="font-semibold text-gray-800">Address</div>
                    <div className="text-gray-600">77A, Market Street, Colombo, Sri Lanka</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                  <FontAwesomeIcon icon={faClock} className="text-blue-600 text-xl" />
                  <div>
                    <div className="font-semibold text-gray-800">Business Hours</div>
                    <div className="text-gray-600">Monday - Sunday: 7:00 AM - 11:00 PM</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                  <FontAwesomeIcon icon={faGlobe} className="text-blue-600 text-xl" />
                  <div>
                    <div className="font-semibold text-gray-800">Service Area</div>
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
            {/* Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Preferred Way to Connect</h2>
              <p className="text-gray-600 mb-6">We offer multiple channels for your convenience</p>
              
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} shadow-lg`}>
                      <FontAwesomeIcon icon={method.icon} className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
                      <div className="text-2xl font-semibold text-gray-900 mb-1">{method.details}</div>
                      <p className="text-gray-600 mb-4">{method.description}</p>
                      <button className={`px-6 py-2 bg-gradient-to-r ${method.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}>
                        {method.buttonText}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Our Support?</h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-3">
                      <FontAwesomeIcon icon={feature.icon} className="text-white text-lg" />
                    </div>
                    <div className="font-semibold text-sm">{feature.title}</div>
                    <div className="text-blue-100 text-xs mt-1">{feature.description}</div>
                  </div>
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
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Visit Our Shop</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Feel free to drop by our headquarters in Colombo. We'd love to meet you in person 
            and discuss how we can serve you better.
          </p>
        </motion.div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <iframe
            title="Company Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63423.75066168245!2d79.9032858486328!3d6.523650800000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2310975425869%3A0xbfbd3a9f96b2627f!2sGolden%20Japan%20International%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1758547623386!5m2!1sen!2slk"
            className="w-full h-[400px] border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { number: "50,000+", label: "Happy Customers" },
            { number: "24/7", label: "Support Available" },
            { number: "5min", label: "Avg Response Time" },
            { number: "99%", label: "Satisfaction Rate" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100"
            >
              <div className="text-2xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}