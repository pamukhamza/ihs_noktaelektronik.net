/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BrainCircuit, Cpu, Database, Network, Microscope, Code, Fingerprint, Gamepad2, Film, ChevronRight, Globe, Shield, Zap, Users, BarChart, Rocket } from 'lucide-react';
import useThreeScene from '@/hooks/useThreeScene';
import { useTranslations } from 'next-intl';

export default function EnhancedSoftwarePage() {

  const t = useTranslations('software')

  const services = [
    { icon: BrainCircuit, title: t('services.items.0.title'), description: t('services.items.0.description') },
    { icon: Cpu, title: t('services.items.1.title'), description: t('services.items.1.description') },
    { icon: Database, title: t('services.items.2.title'), description: t('services.items.2.description') },
    { icon: Network, title: t('services.items.3.title'), description: t('services.items.3.description') },
    { icon: Microscope, title: t('services.items.4.title'), description: t('services.items.4.description') },
    { icon: Code, title: t('services.items.5.title'), description: t('services.items.5.description') },
    { icon: Fingerprint, title: t('services.items.6.title'), description: t('services.items.6.description') },
    { icon: Gamepad2, title: t('services.items.7.title'), description: t('services.items.7.description') },
    { icon: Film, title: t('services.items.8.title'), description: t('services.items.8.description') },
  ];
  
  const expertise = [
    { icon: Globe, title: t('expertise.solutions.0.title'), description: t('expertise.solutions.0.description'), },
    { icon: Shield, title: t('expertise.solutions.1.title'), description: t('expertise.solutions.1.description') },
    { icon: Zap, title: t('expertise.solutions.2.title'), description: t('expertise.solutions.2.description') },
    { icon: Users, title: t('expertise.solutions.3.title'), description: t('expertise.solutions.3.description') },
    { icon: Rocket, title: t('expertise.solutions.4.title'), description: t('expertise.solutions.4.description') },
    { icon: BarChart, title: t('expertise.solutions.5.title'), description: t('expertise.solutions.5.description') },
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const sections = useMemo(() => ['hero', 'services', 'expertise', 'technologies'], []);
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } }
  };

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
            {t('title1')}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-center mb-12 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t('text1')}
          </motion.p>
          <motion.a
            href="#services"
            className="mt-8 px-10 py-4 bg-blue-700 hover:bg-blue-800 rounded-full text-lg font-semibold transition-colors duration-300 flex items-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('button1')} <ChevronRight className="ml-2" />
          </motion.a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center px-4">
          <motion.h2 
            className="text-5xl font-semibold mb-12 text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('services.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300 border border-blue-500/20 group"
              >
                <div className="bg-blue-500/20 rounded-full p-3 inline-block mb-4 group-hover:bg-blue-500/30 transition-all duration-300">
                  <service.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-300">{service.title}</h3>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 flex items-center justify-center bg-gradient-to-b from-transparent to-blue-900/30">
        <div className="max-w-7xl mx-auto text-center px-4">
          <motion.h2 
            className="text-5xl font-semibold mb-12 text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('expertise.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300 border border-purple-500/20 group"
              >
                <div className="bg-purple-500/20 rounded-full p-3 inline-block mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-purple-300">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies We Use Section */}
      <section id="technologies" className="py-20 flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center px-4">
          <motion.h2 
            className="text-5xl font-semibold mb-12 text-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('technologies.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: t('technologies.areas.0'), items: ['JavaScript', 'Python', 'Java', 'PHP', 'C++'] },
              { title: t('technologies.areas.1'), items: ['React', 'Angular', 'Django', 'Spring'] },
              { title: t('technologies.areas.2'), items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
              { title: t('technologies.areas.3'), items: ['Docker', 'Kubernetes', 'Jenkins', 'Git'] },
              { title: t('technologies.areas.4'), items: ['AWS', 'Azure', 'Google Cloud'] },
              { title: t('technologies.areas.5'), items: ['GraphQL', 'REST APIs', 'WebSockets'] },
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300 border border-green-500/20"
              >
                <h3 className="text-xl font-semibold mb-4 text-green-400">{tech.title}</h3>
                <p className="text-gray-300 text-sm">{tech.items.join(', ')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

