"use client";

import { useState, useEffect } from "react";
import { Calendar, Globe, Menu, Scissors, UserCheck, X, Star, Award, Crown, Sparkles, ChevronRight, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/bantik_logo.png";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const testimonials = [
    {
      name: "Анна Петрова",
      text: "Невероятный сервис! Мастера настоящие профессионалы своего дела.",
      rating: 5,
      service: "Маникюр и педикюр"
    },
    {
      name: "Мария Иванова", 
      text: "Атмосфера салона просто волшебная. Чувствуешь себя королевой!",
      rating: 5,
      service: "Уход за лицом"
    },
    {
      name: "Елена Сидорова",
      text: "Результат превзошел все ожидания. Обязательно вернусь снова!",
      rating: 5,
      service: "Окрашивание волос"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-rose-50/30 to-amber-50/20 overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Image
              src={Logo}
              alt="Ajnails Beauty Salon"
              width={50}
              height={50}
              className="rounded-full shadow-lg"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                Ajnails
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Beauty Salon</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
              Услуги
            </Link>
            <Link href="/masters" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
              Мастера
            </Link>
            <Link href="/appointments" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
              Мои записи
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/booking"
                className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                Записаться
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full bg-rose-50 text-rose-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-rose-100"
          >
            <div className="px-6 py-4 space-y-4">
              <Link href="/services" className="block text-gray-700 hover:text-rose-600 transition-colors">
                Услуги
              </Link>
              <Link href="/masters" className="block text-gray-700 hover:text-rose-600 transition-colors">
                Мастера
              </Link>
              <Link href="/appointments" className="block text-gray-700 hover:text-rose-600 transition-colors">
                Мои записи
              </Link>
              <Link
                href="/booking"
                className="block bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-3 rounded-full text-center font-semibold"
              >
                Записаться
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-8 min-h-screen flex items-center">
        {/* Background Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-rose-200/30 to-amber-200/30 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-rose-200/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Crown className="h-6 w-6 text-amber-500" />
                <span className="text-amber-600 font-semibold uppercase tracking-wider text-sm">
                  Премиум салон красоты
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  Ваша красота
                </span>
                <br />
                <span className="text-gray-800">наша страсть</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
              >
                Откройте для себя мир роскоши и профессионального ухода в нашем премиальном салоне красоты
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-rose-500 to-amber-500 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg group"
                >
                  Записаться на приём
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-full hover:bg-rose-50 transition-all duration-300 font-semibold text-lg group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Смотреть видео
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">500+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Довольных клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">5</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Лет опыта</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">15+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Услуг</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/50 to-amber-200/50 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/5] bg-gradient-to-br from-rose-100 to-amber-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-24 w-24 text-rose-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                Наши услуги
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Профессиональный уход и безупречный сервис для вашей красоты
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Scissors className="h-8 w-8" />,
                title: "Парикмахерские услуги",
                description: "Стрижки, окрашивание, укладки от ведущих мастеров",
                color: "from-rose-500 to-pink-500"
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "Маникюр и педикюр",
                description: "Профессиональный уход за ногтями с премиум покрытиями",
                color: "from-amber-500 to-orange-500"
              },
              {
                icon: <Crown className="h-8 w-8" />,
                title: "Косметология",
                description: "Современные процедуры для здоровья и красоты кожи",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Массаж",
                description: "Расслабляющие и оздоровительные массажные техники",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Брови и ресницы",
                description: "Моделирование, окрашивание, наращивание ресниц",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <UserCheck className="h-8 w-8" />,
                title: "VIP обслуживание",
                description: "Индивидуальный подход и эксклюзивные процедуры",
                color: "from-rose-500 to-amber-500"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                Отзывы клиентов
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Что говорят о нас наши клиенты
            </p>
          </motion.div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl"
          >
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-amber-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl lg:text-3xl font-light text-gray-800 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </blockquote>
            <div>
              <div className="font-bold text-xl text-gray-800 mb-2">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-rose-600 font-medium">
                {testimonials[currentTestimonial].service}
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial 
                    ? 'bg-rose-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Готовы к преображению?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Запишитесь на консультацию и откройте для себя новый уровень красоты
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/booking"
                className="inline-flex items-center bg-white text-rose-600 px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg group"
              >
                Записаться сейчас
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="inline-flex p-4 rounded-full bg-rose-100 text-rose-600">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Режим работы</h3>
              <p className="text-gray-600">
                Пн-Вс: 9:00 - 21:00<br />
                Без выходных
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="inline-flex p-4 rounded-full bg-amber-100 text-amber-600">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Адрес</h3>
              <p className="text-gray-600">
                Улица Фрунзе, 300/4<br />
                1 этаж, Бишкек
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="inline-flex p-4 rounded-full bg-rose-100 text-rose-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Контакты</h3>
              <p className="text-gray-600">
                +996 755-47-03-86<br />
                Онлайн запись 24/7
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}