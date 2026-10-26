"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  RotateCcw
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  actionType?: "login_prompt" | "suggest_create" | "suggest_login" | "success" | "lockout";
  suggestedIdentifier?: string;
  timestamp: string;
}

type AuthStep = 
  | "idle"
  | "awaiting_login_id"
  | "awaiting_login_pwd"
  | "awaiting_reg_email"
  | "awaiting_reg_name"
  | "awaiting_reg_pwd";

export default function FloatingRAGBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "bot",
      text: "👋 Namaste! I am your **Candidate Auth Concierge**.\n\n• Directly apna **Username aur Password** chat me likh kar login karein (jaise: `username password`)\n• Ya agar naya candidate account create karna hai toh niche click karein:",
      actionType: "login_prompt",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("idle");
  const [pendingIdentifier, setPendingIdentifier] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  // Rate Limiting & 3-Minute Lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Toggle mask/unmask for password inputs
  const [maskPassword, setMaskPassword] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, authStep]);

  // Sync lockout from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("candidate_auth_lockout_until");
    if (stored) {
      const until = parseInt(stored, 10);
      const diff = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      if (diff > 0) {
        setLockoutRemaining(diff);
        setFailedAttempts(3);
      } else {
        localStorage.removeItem("candidate_auth_lockout_until");
      }
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("candidate_auth_lockout_until");
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to append a bot message
  const addBotMessage = (text: string, actionType?: ChatMessage["actionType"], suggestedIdentifier?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}-${Math.random()}`,
        sender: "bot",
        text,
        actionType,
        suggestedIdentifier,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Check if an account exists in Neon DB
  const checkUserInDB = async (identifier: string): Promise<{ exists: boolean; full_name?: string; email?: string; role?: string }> => {
    try {
      const res = await apiRequest<{ exists: boolean; full_name?: string; email?: string; role?: string }>(
        `/auth/check-user?identifier=${encodeURIComponent(identifier.trim())}`
      );
      return res;
    } catch {
      return { exists: false };
    }
  };

  // Security guardrail check: forbid password extraction
  const checkPasswordLeakAttempt = (text: string) => {
    const clean = text.toLowerCase();
    const triggers = [
      "what is admin password", "tell me password", "kisi ka password",
      "give me password", "show password", "show user password",
      "kisi aur ka password", "kisi ka pass", "database password", "secret key"
    ];
    return triggers.some((t) => clean.includes(t));
  };

  // Extract one-shot username and password if user typed both together
  const parseOneShotCredentials = (text: string): { identifier: string; password: string } | null => {
    const clean = text.trim();
    const stripped = clean.replace(/^(login|sign in|signin|mera username|my credentials are)\s+/i, "");
    
    // Pattern 1: user: xyz pass: abc
    const labeledMatch = stripped.match(/(?:username|user|email)[:=]\s*([^\s]+)\s+(?:password|pass)[:=]\s*([^\s]+)/i);
    if (labeledMatch) {
      return { identifier: labeledMatch[1], password: labeledMatch[2] };
    }

    // Pattern 2: two words separated by space: "email/user password"
    const parts = stripped.split(/\s+/);
    if (parts.length === 2 && parts[0].length >= 3 && parts[1].length >= 3) {
      if (!["create", "sign", "new", "kese", "kaise", "nahi"].includes(parts[0].toLowerCase())) {
        return { identifier: parts[0], password: parts[1] };
      }
    }

    return null;
  };

  // Execute Login API Call against Neon DB
  const executeLogin = async (idToUse: string, pwdToUse: string) => {
    setLoading(true);
    try {
      const resp = await apiRequest<{ access_token: string; token_type: string; user: any }>("/auth/login/json", {
        method: "POST",
        body: JSON.stringify({
          email_or_username: idToUse.trim(),
          password: pwdToUse.trim()
        })
      });

      // Login Success!
      setFailedAttempts(0);
      localStorage.removeItem("candidate_auth_lockout_until");
      localStorage.setItem("token", resp.access_token);
      localStorage.setItem("user", JSON.stringify(resp.user));

      addBotMessage(
        `✅ **Authentication Successful!**\n\nWelcome back, **${resp.user.full_name || resp.user.email}**!\nRole: \`${(resp.user.role || "researcher").toUpperCase()}\` (RBAC Active)\n\nLogging you into your personal candidate panel now...`,
        "success"
      );

      setAuthStep("idle");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

    } catch (err: any) {
      const errMsg = err.message || "";

      // Case: Account NOT in Database
      if (errMsg.includes("Account not found") || errMsg.includes("404")) {
        addBotMessage(
          `❌ **No Account Found in Database!**\n\nDatabase me \`${idToUse}\` naam ka koi candidate account exist nahi karta hai.\n\nPlease pehle apna account create karein:`,
          "suggest_create",
          idToUse
        );
        setPendingEmail(idToUse.includes("@") ? idToUse : "");
        setPendingName(!idToUse.includes("@") ? idToUse : "");
        setAuthStep("idle");
        return;
      }

      // Case: Rate Limit / Lockout
      if (errMsg.includes("429") || errMsg.includes("lockout") || errMsg.includes("Security Alert")) {
        const lockoutExpiry = Date.now() + 180 * 1000;
        localStorage.setItem("candidate_auth_lockout_until", lockoutExpiry.toString());
        setLockoutRemaining(180);
        setFailedAttempts(3);
        addBotMessage(
          `🔒 **Security Lockout Activated!**\n\n3 consecutive failed login attempts detected. Rate limiting has locked authentication for **3 minutes** (180s). Please wait for the timer to expire.`,
          "lockout"
        );
        setAuthStep("idle");
        return;
      }

      // Case: Incorrect Password
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        const lockoutExpiry = Date.now() + 180 * 1000;
        localStorage.setItem("candidate_auth_lockout_until", lockoutExpiry.toString());
        setLockoutRemaining(180);
        addBotMessage(
          `🔒 **Maximum Attempts Exceeded!**\n\nAapne 3 baar galat password enter kiya hai. Account **3 minutes** ke liye temporarily lock kar diya gaya hai.`,
          "lockout"
        );
        setAuthStep("idle");
      } else {
        const triesLeft = 3 - newAttempts;
        addBotMessage(
          `⚠️ **Incorrect Password!**\n\nPassword match nahi hua. Aapke paas **${triesLeft} attempt(s)** bache hain 3-minute lockout se pehle.\n\nKripya \`${idToUse}\` ka sahi password enter karein:`
        );
        setPendingIdentifier(idToUse);
        setAuthStep("awaiting_login_pwd");
      }
    } finally {
      setLoading(false);
    }
  };

  // Execute Register API Call against Neon DB
  const executeRegister = async (name: string, email: string, pwd: string) => {
    setLoading(true);
    try {
      const resp = await apiRequest<{ access_token: string; token_type: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: name.trim(),
          username: name.trim().toLowerCase().replace(/\s+/g, "_"),
          email: email.trim().toLowerCase(),
          password: pwd.trim(),
          role: "researcher"
        })
      });

      // Register Success! Save token and launch dashboard
      localStorage.setItem("token", resp.access_token);
      localStorage.setItem("user", JSON.stringify(resp.user));

      addBotMessage(
        `🎉 **Candidate Account Provisioned Successfully!**\n\nWelcome, **${resp.user.full_name}**!\nAapka password Bcrypt se encrypt karke Neon DB me store ho chuka hai.\nRole: \`RESEARCHER\` (Isolated RBAC Workspace)\n\nLaunching your candidate workspace...`,
        "success"
      );

      setAuthStep("idle");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

    } catch (err: any) {
      addBotMessage(`❌ **Registration Failed:** ${err.message || "Failed to create account"}.\n\nTry entering a different email:`);
      setAuthStep("awaiting_reg_email");
    } finally {
      setLoading(false);
    }
  };

  // Main chat message submission handler
  const handleSend = async (customText?: string) => {
    const rawText = (customText || inputVal).trim();
    if (!rawText || loading) return;

    // Check 3-minute lockout
    if (lockoutRemaining > 0) {
      addBotMessage(`⏳ **Account Locked!** Please wait **${formatTimer(lockoutRemaining)}** before making another attempt.`);
      setInputVal("");
      return;
    }

    // Add user message to stream
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: (authStep === "awaiting_login_pwd" || authStep === "awaiting_reg_pwd") && maskPassword
          ? "••••••••"
          : rawText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setInputVal("");

    // 1. Check Security Guardrail: forbid asking for passwords
    if (checkPasswordLeakAttempt(rawText)) {
      addBotMessage(
        "🔒 **Security Guardrail Enforced:**\n\nUser passwords aur authentication credentials Bcrypt hashing ke sath fully protected hain. Zero-knowledge policy ke tehat kisi bhi user ka password disclose nahi kiya ja sakta."
      );
      return;
    }

    const lower = rawText.toLowerCase();

    // 2. Check if user typed direct one-shot credentials: e.g. "scholar@example.com pass123"
    const oneShot = parseOneShotCredentials(rawText);
    if (oneShot && authStep === "idle") {
      setLoading(true);
      addBotMessage(`🔍 Checking database for \`${oneShot.identifier}\`...`);
      // First check if user exists in database!
      const userCheck = await checkUserInDB(oneShot.identifier);
      if (!userCheck.exists) {
        setLoading(false);
        addBotMessage(
          `❌ **No Account Found in Database!**\n\nDatabase me \`${oneShot.identifier}\` naam ka koi candidate account nahi mila.\n\n👉 Pehle account create karein:`,
          "suggest_create",
          oneShot.identifier
        );
        return;
      }
      // User exists, proceed with password verification
      await executeLogin(oneShot.identifier, oneShot.password);
      return;
    }

    // 3. User says "login" or wants to start login flow
    if (lower === "login" || lower === "sign in" || lower === "signin" || lower === "log in") {
      addBotMessage("🔑 Please enter your registered **Username or Email Address**:");
      setAuthStep("awaiting_login_id");
      return;
    }

    // 4. User says "register" or "create account"
    if (lower === "register" || lower === "signup" || lower === "sign up" || lower === "create account" || lower === "account banana hai") {
      addBotMessage("✨ Excellent! Let's create your candidate account.\n\nFirst, enter your **Email Address**:");
      setAuthStep("awaiting_reg_email");
      return;
    }

    // 5. User accepts recommended account creation ("yes", "ha", "create")
    if ((lower === "yes" || lower === "ha" || lower === "haan" || lower === "create" || lower.includes("account bana")) && authStep === "idle") {
      addBotMessage("✨ Great! What is your **Email Address**?");
      setAuthStep("awaiting_reg_email");
      return;
    }

    // =========================================================================
    // STEP-BY-STEP CONVERSATION FLOW WITH MANDATORY DATABASE PRE-CHECK
    // =========================================================================

    // LOGIN STEP 1: User provides Username/Email
    if (authStep === "awaiting_login_id") {
      setLoading(true);
      addBotMessage(`🔍 Checking database for \`${rawText}\`...`);
      const check = await checkUserInDB(rawText);
      setLoading(false);

      if (!check.exists) {
        // STRICT USER REQUIREMENT: IF NOT IN DATABASE, DO NOT ASK PASSWORD!
        addBotMessage(
          `❌ **No Account Found in Database!**\n\nDatabase me \`${rawText}\` naam ka koi candidate account exist nahi karta hai.\n\n👉 Pehle apna account create karein ya registered email se try karein:`,
          "suggest_create",
          rawText
        );
        setAuthStep("idle");
        return;
      }

      // Candidate exists in Neon DB -> Now ask for password
      setPendingIdentifier(rawText);
      addBotMessage(`✅ Account found for **${check.full_name || rawText}**!\n\nAb kripya apna **Password** enter karein:`);
      setAuthStep("awaiting_login_pwd");
      return;
    }

    // LOGIN STEP 2: User provides Password
    if (authStep === "awaiting_login_pwd") {
      const id = pendingIdentifier;
      addBotMessage(`🔍 Verifying password for \`${id}\` in Neon DB...`);
      await executeLogin(id, rawText);
      return;
    }

    // REGISTRATION STEP 1: User provides Email
    if (authStep === "awaiting_reg_email") {
      setLoading(true);
      addBotMessage(`🔍 Checking if \`${rawText}\` is already registered...`);
      const check = await checkUserInDB(rawText);
      setLoading(false);

      if (check.exists) {
        addBotMessage(
          `⚠️ Email \`${rawText}\` already exists in database!\n\nAap is account se directly login kar sakte hain:`,
          "suggest_login",
          rawText
        );
        setPendingIdentifier(rawText);
        setAuthStep("awaiting_login_pwd");
        return;
      }

      setPendingEmail(rawText);
      addBotMessage(`Email verified! Ab aap apna **Full Name / Username** enter karein:`);
      setAuthStep("awaiting_reg_name");
      return;
    }

    // REGISTRATION STEP 2: User provides Name
    if (authStep === "awaiting_reg_name") {
      setPendingName(rawText);
      addBotMessage(`Thanks, **${rawText}**! Ab ek secure **Password** choose karein (Bcrypt se encrypt hoga):`);
      setAuthStep("awaiting_reg_pwd");
      return;
    }

    // REGISTRATION STEP 3: User provides Password
    if (authStep === "awaiting_reg_pwd") {
      addBotMessage(`🔒 Encrypting password with Bcrypt & provisioning candidate workspace...`);
      await executeRegister(pendingName || "Candidate Researcher", pendingEmail, rawText);
      return;
    }

    // General Fallback
    addBotMessage(
      "🤖 I am your **Candidate Auth Concierge**.\n\nAap directly likh sakte hain:\n• `login <email> <password>`\n• Type **'login'** to sign in\n• Type **'create account'** to register."
    );
  };

  // Start registration flow with a pre-suggested email/username
  const handleStartRegisterWithSuggested = (suggestedId?: string) => {
    if (suggestedId && suggestedId.includes("@")) {
      setPendingEmail(suggestedId);
      addBotMessage(`✨ Creating account for \`${suggestedId}\`.\n\nPlease enter your **Full Name / Username**:`);
      setAuthStep("awaiting_reg_name");
    } else {
      addBotMessage("✨ Let's create your candidate account! What is your **Email Address**?");
      setAuthStep("awaiting_reg_email");
    }
  };

  const resetChat = () => {
    setAuthStep("idle");
    setPendingIdentifier("");
    setPendingName("");
    setPendingEmail("");
    setMessages([
      {
        id: "reset-init",
        sender: "bot",
        text: "👋 Chat reset! How can I assist you?\n\n• Apna **username aur password** chat me likh kar login karein\n• Ya naya candidate account create karne ke liye niche click karein:",
        actionType: "login_prompt",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Corner Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group px-4 py-3 bg-black hover:bg-neutral-900 text-white border border-white/30 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300 flex items-center gap-3 font-sans"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                AI
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-extrabold text-xs tracking-wider uppercase text-white flex items-center gap-1.5">
                Auth Concierge <span className="text-[10px] px-1.5 py-0.2 bg-white/20 text-white rounded font-mono">LOGIN / SIGNUP</span>
              </p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">CHAT TO ACCESS YOUR PANEL</p>
            </div>
          </button>
        )}
      </div>

      {/* Pure Conversational Chatbot Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[440px] max-w-[460px] bg-[#0A0D14]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col h-[600px] font-sans overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="p-4 bg-black/90 border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-black font-black text-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                AI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xs uppercase text-white tracking-wide">Candidate Auth Concierge</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[9px] uppercase text-neutral-400 font-mono">
                  Neon Database · Bcrypt Security · RBAC
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={resetChat}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-neutral-300 hover:text-white transition border border-white/10"
                title="Reset Chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-neutral-300 hover:text-white transition border border-white/10"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rate Limit Lockout Active Banner */}
          {lockoutRemaining > 0 && (
            <div className="mx-3 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-2 animate-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold">Security Lockout Active</p>
                  <p className="text-[10px] text-amber-300">3 failed attempts. Rate limited.</p>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-amber-400 text-black font-mono font-black text-xs rounded-lg">
                {formatTimer(lockoutRemaining)}
              </div>
            </div>
          )}

          {/* Chat Messages Stream (Pure Conversational Auth) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-white">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3.5 max-w-[88%] leading-relaxed rounded-2xl text-xs transition-all ${
                    m.sender === "user"
                      ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-br-none"
                      : "bg-[#121620] text-neutral-200 border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line text-xs font-sans leading-relaxed">{m.text}</p>

                  {/* Interactive Action Chips inside Bot Messages */}
                  {m.actionType === "login_prompt" && authStep === "idle" && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          addBotMessage("✨ Let's create your candidate account! Enter your **Email Address**:");
                          setAuthStep("awaiting_reg_email");
                        }}
                        className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs font-mono hover:bg-neutral-200 transition shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-2"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Create Candidate Account
                      </button>
                    </div>
                  )}

                  {/* Suggest Create Account Button (when user is not in database) */}
                  {m.actionType === "suggest_create" && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleStartRegisterWithSuggested(m.suggestedIdentifier)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-400 text-black font-extrabold text-[11px] font-mono hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(52,211,153,0.5)] flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Create Account Now
                      </button>

                      <button
                        onClick={() => {
                          addBotMessage("🔑 Okay, please enter your registered username or email:");
                          setAuthStep("awaiting_login_id");
                        }}
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px]"
                      >
                        Try Different Login
                      </button>
                    </div>
                  )}

                  {/* Suggest Login Button (when email is already registered) */}
                  {m.actionType === "suggest_login" && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPendingIdentifier(m.suggestedIdentifier || "");
                          addBotMessage(`Enter password for \`${m.suggestedIdentifier}\`:`);
                          setAuthStep("awaiting_login_pwd");
                        }}
                        className="px-3.5 py-2 rounded-lg bg-white text-black font-extrabold text-[11px] font-mono hover:bg-neutral-200 transition shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Enter Password & Log In
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-neutral-500 font-mono mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono animate-pulse bg-white/5 p-2.5 rounded-xl border border-white/10 max-w-[75%]">
                <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" /> Checking Neon database...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Conversational Context Helper Bar */}
          <div className="px-4 py-1.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 truncate max-w-[280px]">
              {authStep === "awaiting_login_id" && <><UserIcon className="w-3 h-3 text-white" /> Step 1: Enter username or email</>}
              {authStep === "awaiting_login_pwd" && <><Lock className="w-3 h-3 text-amber-400" /> Enter password for {pendingIdentifier}</>}
              {authStep === "awaiting_reg_email" && <><Mail className="w-3 h-3 text-emerald-400" /> Step 1: Enter your email</>}
              {authStep === "awaiting_reg_name" && <><UserPlus className="w-3 h-3 text-emerald-400" /> Step 2: Enter full name</>}
              {authStep === "awaiting_reg_pwd" && <><Lock className="w-3 h-3 text-emerald-400" /> Step 3: Choose password</>}
              {authStep === "idle" && <><Sparkles className="w-3 h-3 text-white" /> Type credentials or 'login' / 'register'</>}
            </span>

            {(authStep === "awaiting_login_pwd" || authStep === "awaiting_reg_pwd") && (
              <button
                type="button"
                onClick={() => setMaskPassword(!maskPassword)}
                className="hover:text-white flex items-center gap-1 shrink-0 ml-2"
              >
                {maskPassword ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {maskPassword ? "Show" : "Mask"}
              </button>
            )}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-black/95 border-t border-white/15 flex gap-2"
          >
            <input
              ref={inputRef}
              type={(authStep === "awaiting_login_pwd" || authStep === "awaiting_reg_pwd") && maskPassword ? "password" : "text"}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={lockoutRemaining > 0 || loading}
              placeholder={
                lockoutRemaining > 0
                  ? `Locked (${formatTimer(lockoutRemaining)} remaining)...`
                  : authStep === "awaiting_login_id"
                  ? "Enter registered email or username..."
                  : authStep === "awaiting_login_pwd"
                  ? "Enter your password..."
                  : authStep === "awaiting_reg_email"
                  ? "Enter your email address..."
                  : authStep === "awaiting_reg_name"
                  ? "Enter your full name / username..."
                  : authStep === "awaiting_reg_pwd"
                  ? "Set a password..."
                  : "Type username & password, or 'login'..."
              }
              className="flex-1 px-3.5 py-2.5 bg-white/[0.06] border border-white/20 rounded-xl text-xs outline-none text-white focus:border-white transition font-mono placeholder:text-neutral-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim() || lockoutRemaining > 0}
              className="px-4 py-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold uppercase text-xs rounded-xl transition shadow-[0_0_15px_rgba(255,255,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
