import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/de88ac28-78ea-4ec0-9cb0-ca093c76297e";
const AUTH_CONFIG_URL = "https://functions.poehali.dev/5ab2c94d-b2e3-4a13-8faa-0d90b4b49dff";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, config: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface Props {
  open: boolean;
  onClose: () => void;
}

type Step = "login" | "nickname";

const AuthModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("login");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<{ id: number; email: string; name: string; avatar: string } | null>(null);

  useEffect(() => {
    fetch(AUTH_CONFIG_URL)
      .then((r) => r.json())
      .then((d) => setClientId(d.client_id))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open || step !== "login" || !clientId) return;

    const initGoogle = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        ux_mode: "popup",
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "filled_black",
          size: "large",
          width: 320,
          text: "signin_with",
          shape: "pill",
          logo_alignment: "left",
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, [open, step, clientId]);

  const handleGoogleResponse = async (response: { credential: string }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${AUTH_URL}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка авторизации");

      if (!data.user.nickname) {
        setPendingUser(data.user);
        setStep("nickname");
      } else {
        localStorage.setItem("statort_user", JSON.stringify(data.user));
        onClose();
        navigate("/dashboard");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз");
    } finally {
      setLoading(false);
    }
  };

  const handleNicknameSubmit = async () => {
    if (!pendingUser) return;
    if (nickname.trim().length < 3) {
      setError("Ник должен быть минимум 3 символа");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${AUTH_URL}/nickname`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: pendingUser.id, nickname: nickname.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сохранения ника");

      localStorage.setItem("statort_user", JSON.stringify(data.user));
      onClose();
      navigate("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("login");
    setNickname("");
    setError("");
    setPendingUser(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm bg-card border border-accent/20 rounded-2xl p-8 shadow-2xl shadow-black/60 z-10">
        {/* Close */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors">
          <Icon name="X" size={18} />
        </button>

        {step === "login" && (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="LogIn" size={22} className="text-accent" />
              </div>
              <h2 className="text-xl font-bold mb-1">Войти в StatoRT</h2>
              <p className="text-sm text-muted-foreground">Войдите через Google, чтобы покупать игровую валюту</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <Icon name="Loader2" size={28} className="text-accent animate-spin" />
              </div>
            ) : (
              <div className="flex justify-center" ref={googleBtnRef} />
            )}

            {error && (
              <p className="mt-4 text-center text-sm text-red-400">{error}</p>
            )}
          </>
        )}

        {step === "nickname" && (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="UserCheck" size={22} className="text-accent" />
              </div>
              <h2 className="text-xl font-bold mb-1">Придумай ник</h2>
              <p className="text-sm text-muted-foreground">Это имя будет отображаться на сайте</p>
            </div>

            <input
              type="text"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleNicknameSubmit()}
              placeholder="Твой игровой ник"
              maxLength={20}
              className="w-full px-4 py-3 bg-background border border-accent/20 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 transition-colors mb-2"
            />
            <p className="text-xs text-muted-foreground mb-5">От 3 до 20 символов</p>

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              onClick={handleNicknameSubmit}
              disabled={loading || nickname.trim().length < 3}
              className="w-full py-3 bg-gradient-to-r from-accent to-accent/80 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : null}
              Продолжить
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;