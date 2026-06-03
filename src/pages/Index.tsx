import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/ui/icon";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [authOpen, setAuthOpen] = useState(false);

  const storedUser = localStorage.getItem("statort_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const observers: Record<string, IntersectionObserver> = {};
    const sectionIds = ["hero", "features", "how", "pricing", "cta"];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      observers[id] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
            observers[id].unobserve(element);
          }
        },
        { threshold: 0.15 }
      );

      observers[id].observe(element);
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-2xl border-b border-accent/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="font-display font-bold text-2xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
            StatoRT
          </div>
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-white transition-colors">
              Преимущества
            </a>
            <a href="#how" className="text-muted-foreground hover:text-white transition-colors">
              Как купить
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-white transition-colors">
              Пакеты
            </a>
          </nav>
          <div className="flex gap-3">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all"
              >
                <Icon name="User" size={15} />
                {user.nickname}
              </button>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-5 py-2.5 text-sm font-medium border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all"
              >
                Войти
              </button>
            )}
            <button
              onClick={() => user ? navigate("/dashboard") : setAuthOpen(true)}
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-accent via-accent to-accent/80 text-black rounded-full hover:shadow-lg hover:shadow-accent/40 transition-all font-semibold"
            >
              Купить валюту
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-32 px-6 min-h-screen flex items-center overflow-hidden">
        {/* Night sky background */}
        <div className="absolute inset-0 bg-[#020b18]" />
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/652631f5-666b-4641-aa51-f5e8d6942346/files/8ff9de55-a409-4bcd-8355-92a7279890cd.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.6,
          }}
        />
        {/* Spinning Earth overlay */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div
            className="rounded-full border-2 border-blue-400/20 shadow-[0_0_120px_40px_rgba(56,189,248,0.15)]"
            style={{
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle at 35% 35%, #1e3a5f 0%, #0a1628 60%, #020b18 100%)",
              animation: "spin 40s linear infinite",
              backgroundSize: "200% 200%",
              boxShadow: "0 0 80px 20px rgba(56,189,248,0.1), inset 0 0 60px rgba(56,189,248,0.05)",
            }}
          />
        </div>
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.2,
                animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b18]/90 via-[#020b18]/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transition-all duration-1000 ${visibleSections["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="mb-8 inline-block">
                <span className="text-xs font-medium tracking-widest text-accent/80 uppercase">
                  Маркетплейс игровой валюты
                </span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-display font-black leading-tight mb-8 tracking-tighter">
                <span className="bg-gradient-to-br from-white via-white to-accent/40 bg-clip-text text-transparent">
                  Игровая валюта.
                </span>
                <br />
                <span className="text-accent">Быстро и выгодно.</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-xl font-light">
                StatoRT — маркетплейс для покупки игровой валюты по лучшим ценам. Мгновенное зачисление, безопасные платежи, поддержка 24/7.
              </p>
              <div className="flex gap-4 mb-12 flex-col sm:flex-row">
                <button className="group px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/50 transition-all font-semibold text-lg flex items-center gap-3 justify-center">
                  Купить сейчас
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="px-8 py-4 border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all font-medium text-lg text-white">
                  Смотреть пакеты
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-accent mb-2">50 000+</div>
                  <p className="text-sm text-white/60">Довольных игроков</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-2">1 000 000+</div>
                  <p className="text-sm text-white/60">Успешных заказов</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent mb-2">~2 мин</div>
                  <p className="text-sm text-white/60">Среднее зачисление</p>
                </div>
              </div>
            </div>

            <div
              className={`relative h-96 lg:h-[550px] transition-all duration-1000 flex items-center justify-center ${visibleSections["hero"] ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-transparent rounded-3xl blur-3xl animate-pulse" />
              <img
                src="https://cdn.poehali.dev/projects/652631f5-666b-4641-aa51-f5e8d6942346/files/1dd5aeb7-699a-46a2-b961-84ae1cfe8e0e.jpg"
                alt="StatoRT"
                className="w-full max-w-sm lg:max-w-md drop-shadow-2xl animate-float relative z-10 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${visibleSections["features"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Преимущества</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4 mb-6">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Почему StatoRT?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "Zap",
                title: "Мгновенное зачисление",
                desc: "Валюта поступает на аккаунт в течение 2 минут после оплаты",
              },
              {
                icon: "Shield",
                title: "Безопасные платежи",
                desc: "Все транзакции защищены шифрованием. Ваши данные в безопасности",
              },
              {
                icon: "TrendingDown",
                title: "Лучший курс",
                desc: "Ежедневно обновляем цены, чтобы предложить самый выгодный курс на рынке",
              },
              {
                icon: "Headphones",
                title: "Поддержка 24/7",
                desc: "Наша команда всегда на связи — решим любой вопрос за несколько минут",
              },
              {
                icon: "CreditCard",
                title: "Удобная оплата",
                desc: "Карты, электронные кошельки, криптовалюта — выбирайте удобный способ",
              },
              {
                icon: "RefreshCw",
                title: "Гарантия возврата",
                desc: "Не получили валюту? Вернём деньги в течение 24 часов без лишних вопросов",
              },
            ].map((item, i) => {
              const isVisible = visibleSections["features"];
              return (
                <div
                  key={i}
                  className={`group p-8 border border-accent/10 hover:border-accent/40 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-colors">
                    <Icon name={item.icon} fallback="Star" className="text-accent" size={22} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${visibleSections["how"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Процесс</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Купить за 4 шага
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Выбери пакет", desc: "Выберите нужное количество игровой валюты из наших пакетов" },
              { num: "02", title: "Введи ник", desc: "Укажите игровой никнейм или ID аккаунта для зачисления" },
              { num: "03", title: "Оплати", desc: "Выберите удобный способ оплаты и завершите покупку" },
              { num: "04", title: "Получи", desc: "Валюта поступает на аккаунт автоматически в течение 2 минут" },
            ].map((step, i) => {
              const isVisible = visibleSections["how"];
              return (
                <div
                  key={i}
                  className={`relative transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="group bg-accent/10 hover:bg-accent/20 border border-accent/20 hover:border-accent/40 rounded-2xl p-8 h-full flex flex-col justify-between transition-all backdrop-blur-sm cursor-pointer">
                    <div>
                      <div className="text-5xl font-display font-black text-accent mb-4 group-hover:scale-110 transition-transform">
                        {step.num}
                      </div>
                      <h3 className="font-display font-bold text-xl mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-accent/40 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 bg-accent/5">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${visibleSections["pricing"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Пакеты</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Выбери свой пакет
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Стартовый",
                price: "299 ₽",
                badge: "",
                features: ["1 000 монет StatoRT", "Зачисление за 2 минуты", "Поддержка 24/7", "Гарантия возврата"],
                highlight: false,
              },
              {
                name: "Популярный",
                price: "799 ₽",
                badge: "Выгоднее на 30%",
                features: ["3 500 монет StatoRT", "Зачисление за 2 минуты", "Приоритетная поддержка", "Бонус +500 монет"],
                highlight: true,
              },
            ].map((plan, i) => {
              const isVisible = visibleSections["pricing"];
              return (
                <div
                  key={i}
                  className={`group relative transition-all duration-700 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  } ${plan.highlight ? "md:scale-105" : ""}`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  {plan.highlight && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent via-accent to-accent/60 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition" />
                  )}
                  <div
                    className={`relative p-10 border rounded-2xl h-full flex flex-col justify-between backdrop-blur-sm transition-all ${
                      plan.highlight ? "border-accent/40 bg-accent/10" : "border-accent/10 bg-card/50 hover:bg-card/80"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display font-bold text-2xl">{plan.name}</h3>
                        {plan.badge && (
                          <span className="text-xs font-semibold bg-accent/20 text-accent px-3 py-1 rounded-full border border-accent/30">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-4xl font-black text-accent mb-8">{plan.price}</p>
                      <ul className="space-y-4 mb-10">
                        {plan.features.map((f, j) => (
                          <li key={j} className="flex gap-3 text-sm items-start">
                            <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                            <span className="text-foreground/80">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className={`w-full px-6 py-4 rounded-xl font-semibold transition-all ${
                        plan.highlight
                          ? "bg-gradient-to-r from-accent to-accent/80 text-black hover:shadow-xl hover:shadow-accent/40"
                          : "border border-accent/20 hover:border-accent/40 hover:bg-accent/5"
                      }`}
                    >
                      {plan.highlight ? "Купить популярный" : "Купить стартовый"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-32 px-6">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${visibleSections["cta"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
              Готов прокачать аккаунт?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto">
            Присоединяйтесь к 50 000 игроков, которые уже покупают валюту на StatoRT. Быстро, безопасно, выгодно.
          </p>
          <button className="group px-10 py-5 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/40 transition-all font-bold text-lg flex items-center gap-3 mx-auto">
            Купить валюту сейчас
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-accent/10 py-12 px-6 bg-background/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>© 2025 StatoRT — Маркетплейс игровой валюты</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              Конфиденциальность
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Условия
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Поддержка
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Контакты
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;