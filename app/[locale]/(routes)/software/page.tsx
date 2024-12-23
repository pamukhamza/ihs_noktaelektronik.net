/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BrainCircuit, Cpu, Database, Network, Microscope, Code, Fingerprint, Gamepad2, Film, ChevronRight } from 'lucide-react';
import useThreeScene from '@/hooks/useThreeScene';

const services = [
  { icon: BrainCircuit, title: 'AI Solutions', description: 'Cutting-edge artificial intelligence solutions for complex problems' },
  { icon: Cpu, title: 'Machine Learning', description: 'Advanced machine learning models and algorithms for predictive analytics' },
  { icon: Database, title: 'Big Data Analytics', description: 'Insights from large-scale data analysis to drive business decisions' },
  { icon: Network, title: 'IoT Integration', description: 'Seamless Internet of Things connectivity for smart ecosystems' },
  { icon: Microscope, title: 'Computer Vision', description: 'Visual data processing and analysis for image and video understanding' },
  { icon: Code, title: 'Software Development', description: 'Custom software solutions tailored to your specific needs' },
  { icon: Fingerprint, title: 'Biometric Systems', description: 'Advanced biometric authentication and identification systems' },
  { icon: Gamepad2, title: 'Game Development', description: 'Immersive and engaging game experiences across platforms' },
  { icon: Film, title: 'Video Analytics', description: 'Intelligent video analysis for security and business insights' },
];

const FloatingElement: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, 15, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      delay
    }}
  >
    {children}
  </motion.div>
);

export default function EnhancedSoftwarePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ['hero', 'services', 'expertise', 'technologies'];
  const threeRef = useThreeScene();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleScroll = (index: number) => {
    setCurrentSection(index);
    document.getElementById(sections[index])?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newCurrentSection = sections.findIndex((section, index) => {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          return scrollPosition >= top - windowHeight / 2 && scrollPosition < top + height - windowHeight / 2;
        }
        return false;
      });
      if (newCurrentSection !== -1 && newCurrentSection !== currentSection) {
        setCurrentSection(newCurrentSection);
      }
    };

    window.addEventListener('scroll', handleScrollEvent);
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, [currentSection, sections]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      <div ref={threeRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Dots Navigation */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        {sections.map((_, index) => (
          <motion.button
            key={index}
            className={`w-4 h-4 rounded-full transition-all ${
              currentSection === index ? 'bg-blue-500 scale-125' : 'bg-gray-500'
            }`}
            onClick={() => handleScroll(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 z-10">
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Software Solutions
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-center mb-12 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Empowering businesses with cutting-edge technology and unparalleled expertise
          </motion.p>
          <motion.a
            href="#services"
            className="mt-12 px-10 py-4 bg-blue-700 hover:bg-blue-800 rounded-full text-lg font-semibold transition-colors duration-300 flex items-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Services <ChevronRight className="ml-2" />
          </motion.a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="min-h-screen flex items-center justify-center p-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            className="text-5xl font-semibold mb-12 text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <service.icon className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="min-h-screen flex items-center justify-center p-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            className="text-5xl font-semibold mb-12 text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                <service.icon className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies We Use Section */}
      <section id="technologies" className="min-h-screen flex items-center justify-center p-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            className="text-5xl font-semibold mb-12 text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Technologies We Use
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Programming Languages', items: ['JavaScript', 'Python', 'Java', 'PHP', 'C++'] },
              { title: 'Frameworks', items: ['React', 'Angular', 'Django', 'Spring'] },
              { title: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
              { title: 'DevOps Tools', items: ['Docker', 'Kubernetes', 'Jenkins', 'Git'] },
              { title: 'Cloud Platforms', items: ['AWS', 'Azure', 'Google Cloud'] },
              { title: 'Other Technologies', items: ['GraphQL', 'REST APIs', 'WebSockets'] },
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 p-6 rounded-xl shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">{tech.title}</h3>
                <p className="text-gray-300">{tech.items.join(', ')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

