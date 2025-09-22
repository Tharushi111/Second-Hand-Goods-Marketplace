import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRecycle, 
  faHandshake, 
  faUsers, 
  faBolt,
  faShieldAlt,
  faLeaf,
  faRocket,
  faChartLine,
  faMobileAlt,
  faHeadset,
  faAward,
  faGlobe,
  faCheckCircle,
  faStar
} from '@fortawesome/free-solid-svg-icons';

export default function AboutUs() {
  const features = [
    {
      icon: faShieldAlt,
      title: "100% Secure Transactions",
      description: "Bank-level encryption and secure payment processing",
      stats: "Zero fraud cases",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: faLeaf,
      title: "Eco-Friendly Impact",
      description: "Help reduce carbon footprint by reusing products",
      stats: "50+ tons waste saved",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: faRocket,
      title: "Lightning Fast Delivery",
      description: "Same-day delivery available in major cities",
      stats: "24h average delivery",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: faChartLine,
      title: "Best Market Prices",
      description: "AI-powered pricing for fair deals",
      stats: "30% avg. savings",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: faAward,
      title: "Quality Verified",
      description: "Every product undergoes strict quality checks",
      stats: "98% satisfaction",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: faHeadset,
      title: "24/7 Support",
      description: "Dedicated customer service team",
      stats: "5min response time",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const values = [
    {
      icon: faRecycle,
      title: "Sustainability",
      description: "Promoting circular economy by giving products second life"
    },
    {
      icon: faHandshake,
      title: "Trust",
      description: "Verified sellers and quality-checked products"
    },
    {
      icon: faUsers,
      title: "Community",
      description: "Building connections between buyers and sellers"
    },
    {
      icon: faBolt,
      title: "Efficiency",
      description: "Streamlined processes for seamless transactions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Simplified Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <span className="inline-block px-4 py-2 bg-blue-600/80 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 border border-blue-400/30">
                  ✨ Trusted by 50,000+ Users
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Sri Lanka's{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                    Favorite
                  </span>{' '}
                  Second-Hand Marketplace
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed mb-6">
                  Join thousands of smart shoppers who save money while saving the planet. 
                  Quality products, unbeatable prices, and exceptional service await you.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold shadow-2xl flex items-center gap-3"
                >
                  <FontAwesomeIcon icon={faRocket} />
                  Start Shopping Now
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <FontAwesomeIcon key={star} icon={faStar} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <span className="text-blue-200">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" />
                  <span className="text-blue-200">100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-cyan-400" />
                  <span className="text-blue-200">50K+ Community</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative z-10">
                <motion.img
                  src="/aboutUs01.jpg"
                  alt="ReBuy.lk Platform"
                  className="rounded-3xl shadow-2xl w-full border-4 border-white/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="#f8fafc" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Experience the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                ReBuy.lk Difference
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just a marketplace - we're a community committed to excellence, 
              sustainability, and your complete satisfaction.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Icon Container */}
                  <div className={`relative mb-6 inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <FontAwesomeIcon icon={feature.icon} className="text-2xl text-white" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">{feature.stats}</span>
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map((star) => (
                        <FontAwesomeIcon key={star} icon={faStar} className="text-amber-400 text-xs" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every interaction we have
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FontAwesomeIcon icon={value.icon} className="text-3xl text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Experience Smart Shopping?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join Sri Lanka's most trusted second-hand marketplace today
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg"
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}