import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Icon from "@/components/ui/icon";

const Dashboard = () => {
  const navigate = useNavigate();

  const raw = localStorage.getItem("statort_user");
  const user = raw ? JSON.parse(raw) : null;

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("statort_user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-accent/20 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span
            onClick={() => navigate("/")}
            className="font-display font-bold text-2xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent cursor-pointer"
          >
            StatoRT
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-accent/20 rounded-full text-sm hover:border-accent/50 hover:bg-accent/10 transition-all text-muted-foreground hover:text-white"
          >
            <Icon name="LogOut" size={15} />
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile card */}
        <div className="bg-card/60 border border-accent/15 rounded-2xl p-8 mb-8 flex items-center gap-6">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-accent/40" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Icon name="User" size={28} className="text-accent" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{user.nickname}</h1>
              <span className="text-xs bg-accent/15 text-accent border border-accent/25 px-2 py-0.5 rounded-full">Игрок</span>
            </div>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { label: "Баланс монет", value: "0", icon: "Coins", accent: true },
            { label: "Покупок совершено", value: "0", icon: "ShoppingBag", accent: false },
            { label: "Статус", value: "Новичок", icon: "Star", accent: false },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${s.accent ? "border-accent/30 bg-accent/10" : "border-accent/10 bg-card/50"}`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon name={s.icon} fallback="Circle" size={18} className="text-accent" />
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <div className={`text-3xl font-black ${s.accent ? "text-accent" : "text-white"}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Buy more */}
        <div className="bg-card/60 border border-accent/15 rounded-2xl p-8 text-center">
          <Icon name="ShoppingCart" size={36} className="text-accent mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Пополни баланс</h2>
          <p className="text-muted-foreground mb-6 text-sm">Покупай игровую валюту StatoRT по лучшим ценам</p>
          <button
            onClick={() => navigate("/#pricing")}
            className="px-8 py-3 bg-gradient-to-r from-accent to-accent/80 text-black rounded-full font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            Выбрать пакет
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
