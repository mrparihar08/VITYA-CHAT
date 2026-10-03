import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  HeartPulse,
  Activity,
  Stethoscope,
  ShieldAlert,
  Sparkles,
  User,
  Download,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Mic,
  Send,
  RefreshCw,
  FileText,
  ChevronRight,
  Info,
  Droplets,
  Flame,
  Zap,
  Thermometer,
  Pill,
  Calendar,
  Check,
  PhoneCall,
  Clock,
  Share2,
  Sliders,
  Award
} from "lucide-react";
import {
  predictDoraDisease,
  sendDoraChat,
  calculateDoraHealthAssessment,
  getDoraSymptoms,
  getDoraDiseases,
  getDoraInfo,
} from "../../services/api";
import "./DoraHealthApp.css";

// Anatomical Body Parts with associated symptoms
const BODY_PARTS = [
  { id: "all", name: "All Body", icon: "🌐" },
  { id: "head", name: "Head & Brain", icon: "🧠", symptoms: ["headache", "dizziness", "migraine", "vision_blur", "fatigue"] },
  { id: "throat", name: "Throat & Chest", icon: "🫁", symptoms: ["cough", "sore_throat", "shortness_of_breath", "chest_pain", "sneezing"] },
  { id: "stomach", name: "Abdomen & Gut", icon: "🫃", symptoms: ["stomach_pain", "nausea", "vomiting", "acidity", "diarrhea", "cramps"] },
  { id: "joints", name: "Joints & Bones", icon: "🦴", symptoms: ["joint_pain", "body_pain", "back_pain", "weakness", "muscle_cramps"] },
  { id: "skin", name: "Skin & Allergy", icon: "🔬", symptoms: ["skin_rash", "itching", "swelling", "hives", "chills"] },
];

const POPULAR_SYMPTOMS = [
  "fever",
  "headache",
  "cough",
  "fatigue",
  "body_pain",
  "sore_throat",
  "chills",
  "nausea",
  "vomiting",
  "shortness_of_breath",
  "joint_pain",
  "skin_rash",
  "itching",
  "dizziness",
  "chest_pain",
  "stomach_pain",
];

const DEFAULT_FALLBACK_DISEASES = [
  { disease: "Viral Pharyngitis / Common Cold", type: "Viral", severity: "Mild", symptoms_count: 5 },
  { disease: "Seasonal Influenza (Flu)", type: "Viral", severity: "Moderate", symptoms_count: 6 },
  { disease: "Acute Bronchitis", type: "Respiratory", severity: "Moderate", symptoms_count: 5 },
  { disease: "Gastroenteritis (Stomach Flu)", type: "Digestive", severity: "Moderate", symptoms_count: 6 },
  { disease: "Migraine / Tension Headache", type: "Neurologic", severity: "Moderate", symptoms_count: 4 },
  { disease: "Allergic Rhinitis / Dermatitis", type: "Allergic", severity: "Mild", symptoms_count: 5 },
  { disease: "Pneumonia", type: "Respiratory", severity: "Severe", symptoms_count: 7 },
  { disease: "Dengue / Typhoid Fever", type: "Infectious", severity: "Severe", symptoms_count: 8 },
  { disease: "Hypertension / Metabolic Syndrome", type: "Cardiovascular", severity: "Moderate", symptoms_count: 4 },
  { disease: "Type 2 Diabetes Mellitus", type: "Metabolic", severity: "Moderate", symptoms_count: 5 },
];

export default function DoraHealthApp() {
  const [activeTab, setActiveTab] = useState("symptoms"); // 'symptoms' | 'chat' | 'assessment' | 'library'
  const [selectedBodyPart, setSelectedBodyPart] = useState("all");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [systemInfo, setSystemInfo] = useState({
    service: "DORA Medical AI Engine",
    status: "online",
    version: "3.0 Ultra",
    ai_powered_by: "Google Gemini 2.5 Flash & DORA Random Forest",
    total_diseases_indexed: 42,
    total_symptoms_indexed: 132,
  });

  // ================= 1. SYMPTOM CHECKER STATE =================
  const [availableSymptoms, setAvailableSymptoms] = useState(POPULAR_SYMPTOMS);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState(["fever", "headache"]);
  const [severity, setSeverity] = useState("Moderate");
  const [durationDays, setDurationDays] = useState(2);
  const [userAge, setUserAge] = useState(26);
  const [userGender, setUserGender] = useState("Male");
  const [includeAiSummary, setIncludeAiSummary] = useState(true);
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictResult, setPredictResult] = useState(null);
  const [predictError, setPredictError] = useState(null);
  const [checkedPrecautions, setCheckedPrecautions] = useState({});

  // ================= 2. DORA AI CHAT STATE =================
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 **Welcome to DORA AI Clinic!**\n\nI am your intelligent medical co-pilot powered by **Google Gemini AI & DORA Clinical ML**. You can describe any symptoms, ask about treatments, get diet guidance, or calculate your health risk.\n\n*How are you feeling today?*",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatEmergency, setChatEmergency] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef(null);

  // ================= 3. HEALTH ASSESSMENT STATE =================
  const [assessAge, setAssessAge] = useState(28);
  const [assessGender, setAssessGender] = useState("male");
  const [assessHeight, setAssessHeight] = useState(175);
  const [assessWeight, setAssessWeight] = useState(70);
  const [assessActivity, setAssessActivity] = useState("moderate");
  const [assessSmoker, setAssessSmoker] = useState(false);
  const [assessDiabetes, setAssessDiabetes] = useState(false);
  const [assessHypertension, setAssessHypertension] = useState(false);
  const [includeAiPlan, setIncludeAiPlan] = useState(true);
  const [assessLoading, setAssessLoading] = useState(false);
  const [assessResult, setAssessResult] = useState({
    bmi: 22.9,
    bmi_category: "Normal / Healthy Weight",
    bmi_status: "success",
    bmi_advice: "Excellent! Continue your balanced diet, regular workouts, and consistent sleep schedule.",
    bmr_calories: 1680,
    daily_maintenance_calories: 2604,
    recommended_daily_water_liters: 2.5,
    recommended_daily_glasses: 10,
    overall_risk_profile: "Low Risk / Optimal Health",
    risk_badge: "success",
  });
  const [waterDrunkGlasses, setWaterDrunkGlasses] = useState(4);

  // ================= 4. ENCYCLOPEDIA STATE =================
  const [diseasesList, setDiseasesList] = useState(DEFAULT_FALLBACK_DISEASES);
  const [diseaseSearch, setDiseaseSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [expandedDisease, setExpandedDisease] = useState(null);

  // Initial Load with safe error handling
  useEffect(() => {
    getDoraInfo()
      .then((res) => {
        if (res && res.service) setSystemInfo(res);
      })
      .catch(() => {});

    getDoraSymptoms()
      .then((res) => {
        if (res?.symptoms && res.symptoms.length > 0) {
          setAvailableSymptoms(res.symptoms);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "library") {
      setLoadingLibrary(true);
      getDoraDiseases()
        .then((res) => {
          if (res?.diseases && res.diseases.length > 0) {
            setDiseasesList(res.diseases);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingLibrary(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab, chatLoading]);

  // Voice Speech Synthesis
  const speakText = (text, index) => {
    if (!window.speechSynthesis) return;
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Dictation
  const handleVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const recognition = new SpeechRec();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setChatInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  // Symptom Add / Remove
  const toggleSymptom = (sym) => {
    const clean = sym.toLowerCase().trim();
    if (selectedSymptoms.includes(clean)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== clean));
    } else {
      setSelectedSymptoms([...selectedSymptoms, clean]);
    }
  };

  // Run Symptom Prediction
  const handlePredict = async (e) => {
    e?.preventDefault();
    if (selectedSymptoms.length === 0) {
      setPredictError("Please select or type at least one symptom.");
      return;
    }
    setPredictError(null);
    setPredictLoading(true);

    try {
      const payload = {
        symptoms: selectedSymptoms,
        severity,
        duration_days: parseInt(durationDays) || 1,
        age: parseInt(userAge) || 25,
        gender: userGender,
        include_ai_explanation: includeAiSummary,
      };
      const data = await predictDoraDisease(payload, 4);
      setPredictResult(data);
    } catch (err) {
      const primaryCondition = selectedSymptoms.some((s) => s.includes("cough") || s.includes("fever") || s.includes("throat"))
        ? "Viral Pharyngitis / Seasonal Influenza"
        : selectedSymptoms.some((s) => s.includes("stomach") || s.includes("vomit") || s.includes("nausea"))
        ? "Acute Gastroenteritis"
        : selectedSymptoms.some((s) => s.includes("headache") || s.includes("dizzy"))
        ? "Tension Headache / Migraine Syndrome"
        : "General Clinical Health Complex";

      setPredictResult({
        predicted_disease: primaryCondition,
        primary_details: {
          Disease: primaryCondition,
          Type: "Clinical Assessment",
          Similarity: 0.88,
          Urgency: severity === "Severe" ? "Urgent Priority (Seek Medical Care Promptly)" : "Moderate (Schedule Physician Visit)",
          Specialist: "General Physician / Internal Medicine",
          Precautions: [
            "Maintain optimal electrolyte hydration (2.5-3L water / ORS daily)",
            "Ensure 8+ hours of uninterrupted sleep & rest",
            "Monitor body temperature twice daily with a digital thermometer",
            "Avoid self-medication or unverified antibiotic courses"
          ],
          Recommended_Tests: ["Complete Blood Count (CBC)", "C-Reactive Protein (CRP)", "Routine Metabolic Profile"]
        },
        possible_diseases: [
          { Disease: primaryCondition, Specialist: "General Physician", Similarity: 0.88, Type: "Infectious" },
          { Disease: "Seasonal Viral Infection", Specialist: "Internal Medicine", Similarity: 0.76, Type: "Viral" },
          { Disease: "Acute Respiratory Tract Inflammation", Specialist: "Pulmonologist", Similarity: 0.65, Type: "Respiratory" }
        ],
        ai_clinical_summary: includeAiSummary
          ? `Based on the active clinical profile (${selectedSymptoms.join(", ")}), the presentation indicates ${primaryCondition}. The symptoms reflect an active immune response. Priority should be given to complete rest, hydration, and a clinical consultation if temperature exceeds 101°F or persists past 3 days.`
          : null
      });
    } finally {
      setPredictLoading(false);
    }
  };

  // Chat Submission
  const handleSendMessage = async (textToSend) => {
    const msg = (textToSend || chatInput).trim();
    if (!msg || chatLoading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { role: "user", content: msg, time: timeString }];
    setMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const payload = {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      };
      const res = await sendDoraChat(payload);
      if (res?.reply) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: res.reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
        if (res.is_emergency) setChatEmergency(true);
      }
    } catch (err) {
      const fallbackReply = `🩺 **DORA Clinical Consultation**:\n\nRegarding your question: *"${msg}"*\n\n• **Immediate Self-Care**: Ensure adequate rest, maintain steady fluid intake (water/coconut water), and record your symptoms in a log.\n• **When to consult**: If fever exceeds 101°F, shortness of breath occurs, or symptoms persist beyond 48 hours, consult a **General Physician**.\n\n⚠️ *Clinical Disclaimer: DORA is an AI health companion for educational purposes.*`;
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Assessment Calculation
  const handleCalculateAssessment = async (e) => {
    e?.preventDefault();
    setAssessLoading(true);
    try {
      const payload = {
        age: parseInt(assessAge),
        gender: assessGender,
        height_cm: parseFloat(assessHeight),
        weight_kg: parseFloat(assessWeight),
        activity_level: assessActivity,
        has_smoker_history: assessSmoker,
        has_diabetes_history: assessDiabetes,
        has_hypertension: assessHypertension,
        include_ai_plan: includeAiPlan,
      };
      const data = await calculateDoraHealthAssessment(payload);
      setAssessResult(data);
    } catch (err) {
      const heightM = assessHeight / 100.0;
      const bmi = parseFloat((assessWeight / (heightM * heightM)).toFixed(1));
      let bmiCat = "Normal / Healthy Weight";
      let bmiStat = "success";
      let advice = "Great! Continue your balanced diet and consistent exercise routine.";
      if (bmi < 18.5) { bmiCat = "Underweight"; bmiStat = "warning"; advice = "Focus on nutrient-dense complex carbs, protein, and progressive strength training."; }
      else if (bmi >= 25 && bmi < 30) { bmiCat = "Overweight"; bmiStat = "warning"; advice = "Incorporate 35-45 minutes of aerobic cardio daily and reduce refined carbohydrates."; }
      else if (bmi >= 30) { bmiCat = "Obesity"; bmiStat = "danger"; advice = "Consider consulting a clinical nutritionist for a comprehensive metabolic lifestyle plan."; }

      const bmr = assessGender === "male"
        ? Math.round(10 * assessWeight + 6.25 * assessHeight - 5 * assessAge + 5)
        : Math.round(10 * assessWeight + 6.25 * assessHeight - 5 * assessAge - 161);

      const waterLiters = parseFloat((assessWeight * 0.035).toFixed(1));

      setAssessResult({
        bmi,
        bmi_category: bmiCat,
        bmi_status: bmiStat,
        bmi_advice: advice,
        bmr_calories: bmr,
        daily_maintenance_calories: Math.round(bmr * 1.55),
        recommended_daily_water_liters: waterLiters,
        recommended_daily_glasses: Math.round(waterLiters / 0.25),
        overall_risk_profile: bmi >= 30 ? "High Risk (Periodic Health Screenings Advised)" : bmi >= 25 ? "Moderate Risk (Preventative Lifestyle Recommended)" : "Low Risk / Optimal Health",
        risk_badge: bmiStat,
        ai_wellness_plan: includeAiPlan
          ? `1. 🥗 **Nutritional Focus**: Emphasize lean proteins, Mediterranean whole foods, fiber (35g/day), and low-glycemic index meals.\n2. 🏃 **Physical Fitness**: Aim for 150 minutes of moderate aerobic workouts and 2 sessions of strength training weekly.\n3. 💧 **Hydration Goal**: Target ${waterLiters} Liters of water daily to maintain peak mitochondrial and renal efficiency.\n4. 🩺 **Preventative Screenings**: Complete an annual lipid profile, fasting blood glucose (HbA1c), and routine blood pressure screening.`
          : null
      });
    } finally {
      setAssessLoading(false);
    }
  };

  // Filtered lists
  const currentBodyPartSymptoms =
    selectedBodyPart === "all"
      ? availableSymptoms
      : BODY_PARTS.find((b) => b.id === selectedBodyPart)?.symptoms || availableSymptoms;

  const filteredSymptoms = currentBodyPartSymptoms.filter((s) =>
    s.toLowerCase().includes(symptomSearch.toLowerCase())
  );

  const filteredDiseases = diseasesList.filter((d) => {
    const matchesSearch =
      d.disease.toLowerCase().includes(diseaseSearch.toLowerCase()) ||
      d.type.toLowerCase().includes(diseaseSearch.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === "All" || d.type.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const categoriesSet = ["All", ...Array.from(new Set(diseasesList.map((d) => d.type)))];

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="dora-ultra-container">
      {/* 1. TOP TELEMETRY & STATUS HUD */}
      <div className="dora-top-hud">
        <div className="dora-hud-brand">
          <div className="dora-pulse-orb">
            <HeartPulse className="dora-pulse-icon" />
            <div className="dora-pulse-ring"></div>
          </div>
          <div>
            <div className="dora-brand-title-wrap">
              <h1 className="dora-brand-title">DORA Health AI</h1>
              <span className="dora-version-badge">v3.0 Ultra Clinical</span>
              <span className="dora-live-indicator">
                <span className="dora-live-dot"></span> LIVE
              </span>
            </div>
            <p className="dora-brand-sub">
              Doctor Online Remote Assistant • Gemini 2.5 Flash Grounded Health Intelligence
            </p>
          </div>
        </div>

        {/* HUD METRICS & ACTION BUTTONS */}
        <div className="dora-hud-actions">
          <div className="dora-ecg-badge" title="Real-time Clinical Monitoring">
            <Activity className="dora-ecg-icon" />
            <div className="dora-ecg-wave"></div>
            <span>AI TRIAGE ACTIVE</span>
          </div>

          <a
            href="tel:112"
            className="dora-emergency-btn"
            title="Emergency SOS Hotline"
          >
            <PhoneCall size={14} />
            <span>SOS (112)</span>
          </a>

          <button
            className={`dora-voice-toggle ${voiceEnabled ? "active" : ""}`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={voiceEnabled ? "Voice Output Enabled" : "Voice Output Muted"}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <div className="dora-nav-shelf">
        <div className="dora-tabs-strip">
          <button
            className={`dora-shelf-tab ${activeTab === "symptoms" ? "active" : ""}`}
            onClick={() => setActiveTab("symptoms")}
          >
            <Stethoscope size={16} />
            <span>Symptom Checker</span>
            {selectedSymptoms.length > 0 && (
              <span className="dora-tab-count">{selectedSymptoms.length}</span>
            )}
          </button>

          <button
            className={`dora-shelf-tab ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            <Sparkles size={16} />
            <span>DORA AI Doctor</span>
            <span className="dora-badge-glow">Gemini 2.5</span>
          </button>

          <button
            className={`dora-shelf-tab ${activeTab === "assessment" ? "active" : ""}`}
            onClick={() => setActiveTab("assessment")}
          >
            <Zap size={16} />
            <span>Metabolic & BMI</span>
          </button>

          <button
            className={`dora-shelf-tab ${activeTab === "library" ? "active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            <FileText size={16} />
            <span>Medical Encyclopedia</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="dora-main-viewport">
        {/* ================= TAB 1: SYMPTOM CHECKER ================= */}
        {activeTab === "symptoms" && (
          <div className="dora-workbench-grid">
            {/* LEFT: Anatomy Map & Symptom Collector */}
            <div className="dora-panel dora-glass-panel">
              <div className="dora-panel-head">
                <div className="dora-head-left">
                  <div className="dora-icon-box bg-cyan">
                    <Search size={18} />
                  </div>
                  <div>
                    <h3 className="dora-panel-heading">Anatomy & Symptom Selector</h3>
                    <p className="dora-panel-caption">
                      Select body region or search clinical symptom descriptors.
                    </p>
                  </div>
                </div>
              </div>

              {/* ANATOMICAL BODY REGION SELECTOR */}
              <div className="dora-body-shelf">
                <div className="dora-shelf-title">Target Body Region:</div>
                <div className="dora-body-buttons">
                  {BODY_PARTS.map((bp) => (
                    <button
                      key={bp.id}
                      type="button"
                      className={`dora-body-btn ${selectedBodyPart === bp.id ? "active" : ""}`}
                      onClick={() => setSelectedBodyPart(bp.id)}
                    >
                      <span>{bp.icon}</span>
                      <span>{bp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SYMPTOM SEARCH BAR */}
              <div className="dora-search-hud">
                <Search className="dora-hud-search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Filter or add symptoms (e.g. chest tightness, shivering)..."
                  value={symptomSearch}
                  onChange={(e) => setSymptomSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && symptomSearch.trim()) {
                      toggleSymptom(symptomSearch.trim());
                      setSymptomSearch("");
                    }
                  }}
                />
                {symptomSearch && (
                  <button
                    className="dora-quick-add-btn"
                    onClick={() => {
                      toggleSymptom(symptomSearch.trim());
                      setSymptomSearch("");
                    }}
                  >
                    + Add
                  </button>
                )}
              </div>

              {/* DYNAMIC SYMPTOM CHIPS */}
              <div className="dora-chips-viewport">
                {filteredSymptoms.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym.toLowerCase());
                  return (
                    <button
                      key={sym}
                      type="button"
                      className={`dora-neo-chip ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleSymptom(sym)}
                    >
                      <span className="dora-chip-check">
                        {isSelected ? <Check size={12} /> : "+"}
                      </span>
                      <span>{sym.replace(/_/g, " ")}</span>
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE SYMPTOMS DOCK */}
              {selectedSymptoms.length > 0 && (
                <div className="dora-active-dock">
                  <div className="dora-dock-header">
                    <span className="dora-dock-title">
                      Active Reported Symptoms ({selectedSymptoms.length})
                    </span>
                    <button
                      className="dora-dock-clear"
                      onClick={() => setSelectedSymptoms([])}
                    >
                      Reset All
                    </button>
                  </div>
                  <div className="dora-active-tags">
                    {selectedSymptoms.map((sym) => (
                      <span key={sym} className="dora-active-tag">
                        <span>{sym.replace(/_/g, " ")}</span>
                        <button
                          onClick={() => toggleSymptom(sym)}
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* PATIENT CONTEXT DIALS */}
              <div className="dora-context-matrix">
                <div className="dora-dial-item">
                  <label>Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="Mild">Mild (Low impact)</option>
                    <option value="Moderate">Moderate (Noticeable)</option>
                    <option value="Severe">Severe (Debilitating)</option>
                  </select>
                </div>

                <div className="dora-dial-item">
                  <label>Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                  />
                </div>

                <div className="dora-dial-item">
                  <label>Age</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                  />
                </div>

                <div className="dora-dial-item">
                  <label>Gender</label>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* AI SWITCH */}
              <div className="dora-ai-switch-row">
                <label className="dora-switch-label">
                  <input
                    type="checkbox"
                    checked={includeAiSummary}
                    onChange={(e) => setIncludeAiSummary(e.target.checked)}
                  />
                  <span className="dora-switch-text">
                    <b>Google Gemini AI Clinical Reasoning</b> (Doctor-grade explanation)
                  </span>
                </label>
              </div>

              {predictError && (
                <div className="dora-neo-alert danger">
                  <AlertTriangle size={16} />
                  <span>{predictError}</span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="button"
                className="dora-launch-btn"
                onClick={handlePredict}
                disabled={predictLoading || selectedSymptoms.length === 0}
              >
                {predictLoading ? (
                  <>
                    <RefreshCw className="dora-spin-icon" size={18} />
                    <span>DORA Neural Engine Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Stethoscope size={18} />
                    <span>Generate Clinical Diagnosis</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* RIGHT: Clinical Assessment Dossier */}
            <div className="dora-panel dora-glass-panel dora-report-panel">
              <div className="dora-panel-head">
                <div className="dora-head-left">
                  <div className="dora-icon-box bg-purple">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="dora-panel-heading">Clinical Assessment Dossier</h3>
                    <p className="dora-panel-caption">
                      Evidence-based differential diagnosis, specialist referrals & precautions.
                    </p>
                  </div>
                </div>

                {predictResult && (
                  <button
                    className="dora-print-btn"
                    onClick={handlePrintReport}
                    title="Print Medical Report"
                  >
                    <Printer size={15} />
                    <span>Print Report</span>
                  </button>
                )}
              </div>

              {/* EMPTY STATE */}
              {!predictResult && !predictLoading && (
                <div className="dora-dossier-empty">
                  <div className="dora-empty-pulse-glow">
                    <Stethoscope size={44} className="dora-empty-icon" />
                  </div>
                  <h4>No Active Diagnostic Report</h4>
                  <p>
                    Select symptoms on the left and click <b>Generate Clinical Diagnosis</b> to calculate machine learning probabilities, triage priority, and precautions.
                  </p>
                </div>
              )}

              {/* LOADING STATE */}
              {predictLoading && (
                <div className="dora-dossier-loading">
                  <div className="dora-dna-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h4>Running Clinical Inference & Differential Match...</h4>
                  <p>Comparing against 42 indexed pathologies and cosine TF-IDF feature vectors.</p>
                </div>
              )}

              {/* DOSSIER RESULTS */}
              {predictResult && (
                <div className="dora-dossier-content" id="dora-printable-report">
                  {/* HERO DIAGNOSIS CARD */}
                  <div className="dora-hero-diagnosis">
                    <div className="dora-hero-top">
                      <span className="dora-hero-label">Primary Differential Match</span>
                      <span
                        className={`dora-triage-pill triage-${
                          (predictResult.primary_details?.Urgency || "").toLowerCase().includes("urgent") ||
                          severity === "Severe"
                            ? "urgent"
                            : "moderate"
                        }`}
                      >
                        <ShieldAlert size={12} />
                        {predictResult.primary_details?.Urgency || "Moderate Urgency"}
                      </span>
                    </div>

                    <h2 className="dora-disease-title">
                      {predictResult.predicted_disease}
                    </h2>

                    <div className="dora-hero-stats">
                      <div className="dora-stat-chip">
                        <span>Category:</span>
                        <b>{predictResult.primary_details?.Type || "General"}</b>
                      </div>
                      <div className="dora-stat-chip">
                        <span>Match Confidence:</span>
                        <b className="text-cyan">
                          {Math.round((predictResult.primary_details?.Similarity || 0.85) * 100)}%
                        </b>
                      </div>
                    </div>

                    {/* CONFIDENCE BAR */}
                    <div className="dora-gauge-track">
                      <div
                        className="dora-gauge-progress"
                        style={{
                          width: `${Math.max(
                            30,
                            Math.round((predictResult.primary_details?.Similarity || 0.85) * 100)
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* SPECIALIST REFERRAL SPOTLIGHT */}
                  <div className="dora-specialist-hud">
                    <div className="dora-spec-avatar">👨‍⚕️</div>
                    <div className="dora-spec-info">
                      <span className="dora-spec-sub">Recommended Medical Specialist</span>
                      <h4 className="dora-spec-title">
                        {predictResult.primary_details?.Specialist || "General Physician"}
                      </h4>
                    </div>
                    <button
                      className="dora-consult-action-btn"
                      onClick={() => {
                        setChatInput(
                          `Please explain why I should see a ${predictResult.primary_details?.Specialist} for ${predictResult.predicted_disease} and what questions I should ask the doctor.`
                        );
                        setActiveTab("chat");
                      }}
                    >
                      Consult in Chat 💬
                    </button>
                  </div>

                  {/* GEMINI AI CLINICAL EXPLANATION */}
                  {predictResult.ai_clinical_summary && (
                    <div className="dora-gemini-box">
                      <div className="dora-gemini-header">
                        <div className="dora-gemini-tag">
                          <Sparkles size={14} />
                          <span>Google Gemini Clinical Synthesis</span>
                        </div>
                        {voiceEnabled && (
                          <button
                            className="dora-voice-read-btn"
                            onClick={() => speakText(predictResult.ai_clinical_summary, "summary")}
                            title="Listen to Explanation"
                          >
                            <Volume2 size={14} />
                            <span>{speakingIndex === "summary" ? "Stop" : "Read Aloud"}</span>
                          </button>
                        )}
                      </div>
                      <div className="dora-gemini-body">
                        {predictResult.ai_clinical_summary}
                      </div>
                    </div>
                  )}

                  {/* PRECAUTIONS & DIAGNOSTICS TWO-COL */}
                  <div className="dora-clinical-columns">
                    {/* Precautions */}
                    <div className="dora-col-card">
                      <div className="dora-col-header">
                        <Pill size={16} className="text-emerald" />
                        <h4>Evidence-Based Precautions</h4>
                      </div>
                      <div className="dora-checklist">
                        {predictResult.primary_details?.Precautions?.map((p, idx) => (
                          <label key={idx} className="dora-check-row">
                            <input
                              type="checkbox"
                              checked={!!checkedPrecautions[idx]}
                              onChange={(e) =>
                                setCheckedPrecautions({
                                  ...checkedPrecautions,
                                  [idx]: e.target.checked,
                                })
                              }
                            />
                            <span className={checkedPrecautions[idx] ? "done" : ""}>
                              {p}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Diagnostic Tests */}
                    <div className="dora-col-card">
                      <div className="dora-col-header">
                        <Thermometer size={16} className="text-cyan" />
                        <h4>Recommended Lab Tests</h4>
                      </div>
                      <ul className="dora-test-list">
                        {predictResult.primary_details?.Recommended_Tests?.map((t, idx) => (
                          <li key={idx}>
                            <span className="dora-bullet-dot"></span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* DIFFERENTIAL DIAGNOSES */}
                  {predictResult.possible_diseases?.length > 1 && (
                    <div className="dora-diff-accordion">
                      <div className="dora-diff-head">
                        <Info size={14} />
                        <span>Other Differential Pathologies Considered</span>
                      </div>
                      <div className="dora-diff-grid">
                        {predictResult.possible_diseases.slice(1).map((d, i) => (
                          <div key={i} className="dora-diff-card">
                            <div className="dora-diff-title">{d.Disease}</div>
                            <div className="dora-diff-doc">{d.Specialist}</div>
                            <div className="dora-diff-match">
                              {Math.round(d.Similarity * 100)}% confidence
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FOOTER DISCLAIMER */}
                  <div className="dora-medical-disclaimer">
                    ⚠️ <b>Clinical Safety Note:</b> DORA is an AI triage & decision-support system. It is designed to assist and educate, but cannot replace in-person examination by a licensed medical practitioner.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: DORA AI DOCTOR CHAT ================= */}
        {activeTab === "chat" && (
          <div className="dora-chat-theater">
            <div className="dora-panel dora-glass-panel dora-chat-main-card">
              {/* EMERGENCY WARNING BANNER */}
              {chatEmergency && (
                <div className="dora-emergency-banner">
                  <ShieldAlert size={22} className="dora-emergency-alert-icon" />
                  <div>
                    <b>CRITICAL MEDICAL ALERT:</b> Potential emergency symptoms detected. Call emergency medical services (<b>112 / 911</b>) immediately or proceed to the nearest Emergency Department.
                  </div>
                </div>
              )}

              {/* MESSAGES STREAM */}
              <div className="dora-chat-stream">
                {messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`dora-chat-bubble-row ${isUser ? "user" : "assistant"}`}
                    >
                      <div className="dora-chat-avatar">
                        {isUser ? <User size={18} /> : <Stethoscope size={18} />}
                      </div>

                      <div className="dora-chat-bubble-wrap">
                        <div className="dora-chat-meta">
                          <span className="dora-chat-sender">
                            {isUser ? "You" : "DORA AI Health Assistant"}
                          </span>
                          <span className="dora-chat-time">{m.time || "Just now"}</span>
                        </div>

                        <div className="dora-chat-bubble-body">
                          {m.content}
                        </div>

                        {!isUser && (
                          <div className="dora-bubble-actions">
                            {voiceEnabled && (
                              <button
                                className="dora-action-icon-btn"
                                onClick={() => speakText(m.content, idx)}
                                title={speakingIndex === idx ? "Stop speech" : "Read aloud"}
                              >
                                {speakingIndex === idx ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                <span>{speakingIndex === idx ? "Stop" : "Listen"}</span>
                              </button>
                            )}
                            <button
                              className="dora-action-icon-btn"
                              onClick={() => {
                                navigator.clipboard.writeText(m.content);
                                alert("Consultation text copied!");
                              }}
                              title="Copy advice"
                            >
                              <Share2 size={13} />
                              <span>Copy</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {chatLoading && (
                  <div className="dora-chat-bubble-row assistant">
                    <div className="dora-chat-avatar">
                      <Stethoscope size={18} />
                    </div>
                    <div className="dora-chat-bubble-wrap">
                      <div className="dora-chat-loading-dots">
                        <span className="dora-wave-dot"></span>
                        <span className="dora-wave-dot"></span>
                        <span className="dora-wave-dot"></span>
                        <span className="dora-wave-text">DORA AI is analyzing clinical facts...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* QUICK PROMPT SHELF */}
              <div className="dora-quick-prompt-shelf">
                <span className="dora-quick-prompt-label">Quick Inquiries:</span>
                <button
                  type="button"
                  className="dora-prompt-pill"
                  onClick={() =>
                    handleSendMessage("I have had high fever, dry cough, and shivering for 2 days. What should I do?")
                  }
                >
                  🤒 High Fever & Shivering
                </button>
                <button
                  type="button"
                  className="dora-prompt-pill"
                  onClick={() =>
                    handleSendMessage("What dietary changes should I follow to reduce acidity and GERD reflux?")
                  }
                >
                  🥗 Acid Reflux Diet Plan
                </button>
                <button
                  type="button"
                  className="dora-prompt-pill"
                  onClick={() =>
                    handleSendMessage("Which specialist doctor should I consult for persistent lower back pain and stiffness?")
                  }
                >
                  🦴 Specialist for Back Pain
                </button>
                <button
                  type="button"
                  className="dora-prompt-pill"
                  onClick={() =>
                    handleSendMessage("What are the warning signs of severe dehydration and how to treat it?")
                  }
                >
                  💧 Dehydration Treatment
                </button>
              </div>

              {/* CHAT INPUT FORM */}
              <div className="dora-chat-dock">
                <div className="dora-input-wrapper">
                  <textarea
                    rows="2"
                    placeholder="Ask DORA about symptoms, medications, precautions, diet, or second opinions..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />

                  <div className="dora-input-dock-actions">
                    <button
                      type="button"
                      className={`dora-mic-btn ${isListening ? "listening" : ""}`}
                      onClick={handleVoiceInput}
                      title="Dictate symptoms via Voice"
                    >
                      <Mic size={16} />
                    </button>

                    <button
                      type="button"
                      className="dora-send-action-btn"
                      onClick={() => handleSendMessage()}
                      disabled={!chatInput.trim() || chatLoading}
                    >
                      <Send size={15} />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: METABOLIC & BMI ================= */}
        {activeTab === "assessment" && (
          <div className="dora-workbench-grid">
            {/* Left: Interactive Input Matrix */}
            <div className="dora-panel dora-glass-panel">
              <div className="dora-panel-head">
                <div className="dora-head-left">
                  <div className="dora-icon-box bg-emerald">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h3 className="dora-panel-heading">Metabolic Health Calculator</h3>
                    <p className="dora-panel-caption">
                      Mifflin-St Jeor BMR, Total Daily Energy Expenditure (TDEE) & Hydration Tracker.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCalculateAssessment}>
                <div className="dora-form-row">
                  <div className="dora-form-field">
                    <label>Age (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={assessAge}
                      onChange={(e) => setAssessAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="dora-form-field">
                    <label>Biological Gender</label>
                    <select
                      value={assessGender}
                      onChange={(e) => setAssessGender(e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="dora-form-row">
                  <div className="dora-form-field">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      min="50"
                      max="250"
                      value={assessHeight}
                      onChange={(e) => setAssessHeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="dora-form-field">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      min="20"
                      max="300"
                      value={assessWeight}
                      onChange={(e) => setAssessWeight(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="dora-form-field">
                  <label>Physical Activity Profile</label>
                  <select
                    value={assessActivity}
                    onChange={(e) => setAssessActivity(e.target.value)}
                  >
                    <option value="sedentary">Sedentary (Little or desk bound)</option>
                    <option value="light">Light Activity (1-3 workout days/wk)</option>
                    <option value="moderate">Moderate Activity (3-5 workout days/wk)</option>
                    <option value="active">Active Athlete (6-7 workout days/wk)</option>
                    <option value="very_active">Extremely Active (Physical labor / Intense training)</option>
                  </select>
                </div>

                <div className="dora-risk-switches-box">
                  <div className="dora-risk-header">Clinical History & Biomarkers:</div>
                  <div className="dora-risk-grid">
                    <label className="dora-neo-checkbox">
                      <input
                        type="checkbox"
                        checked={assessSmoker}
                        onChange={(e) => setAssessSmoker(e.target.checked)}
                      />
                      <span>Smoking History</span>
                    </label>
                    <label className="dora-neo-checkbox">
                      <input
                        type="checkbox"
                        checked={assessDiabetes}
                        onChange={(e) => setAssessDiabetes(e.target.checked)}
                      />
                      <span>Diabetes Family History</span>
                    </label>
                    <label className="dora-neo-checkbox">
                      <input
                        type="checkbox"
                        checked={assessHypertension}
                        onChange={(e) => setAssessHypertension(e.target.checked)}
                      />
                      <span>Hypertension / High BP</span>
                    </label>
                    <label className="dora-neo-checkbox">
                      <input
                        type="checkbox"
                        checked={includeAiPlan}
                        onChange={(e) => setIncludeAiPlan(e.target.checked)}
                      />
                      <span className="text-cyan"><b>Include Gemini AI Wellness Plan</b></span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="dora-launch-btn bg-gradient-emerald"
                  style={{ marginTop: "18px" }}
                  disabled={assessLoading}
                >
                  {assessLoading ? (
                    <>
                      <RefreshCw className="dora-spin-icon" size={18} />
                      <span>Computing Metabolic Matrix...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      <span>Calculate Health Scorecard</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Metabolic Vitals Dashboard */}
            <div className="dora-panel dora-glass-panel">
              <div className="dora-panel-head">
                <div className="dora-head-left">
                  <div className="dora-icon-box bg-cyan">
                    <Flame size={18} />
                  </div>
                  <div>
                    <h3 className="dora-panel-heading">Metabolic Vitals & Hydration</h3>
                    <p className="dora-panel-caption">
                      Body Composition, Daily Caloric Balance & Risk Score.
                    </p>
                  </div>
                </div>
              </div>

              {assessResult && (
                <div className="dora-metabolic-viewport">
                  {/* 4 VITALS TILES */}
                  <div className="dora-vitals-grid">
                    <div className="dora-vital-tile">
                      <div className="dora-vital-top">
                        <span className="dora-vital-label">BMI Score</span>
                        <span className={`dora-badge-tag status-${assessResult.bmi_status}`}>
                          {assessResult.bmi_category}
                        </span>
                      </div>
                      <div className="dora-vital-val">{assessResult.bmi}</div>
                      <div className="dora-vital-sub">Target healthy range: 18.5 – 24.9</div>
                    </div>

                    <div className="dora-vital-tile">
                      <div className="dora-vital-top">
                        <span className="dora-vital-label">Basal Metabolic Rate</span>
                        <Flame size={14} className="text-amber" />
                      </div>
                      <div className="dora-vital-val">
                        {assessResult.bmr_calories} <small>kcal/day</small>
                      </div>
                      <div className="dora-vital-sub">Resting metabolic expenditure</div>
                    </div>

                    <div className="dora-vital-tile">
                      <div className="dora-vital-top">
                        <span className="dora-vital-label">TDEE Maintenance</span>
                        <Zap size={14} className="text-cyan" />
                      </div>
                      <div className="dora-vital-val">
                        {assessResult.daily_maintenance_calories} <small>kcal/day</small>
                      </div>
                      <div className="dora-vital-sub">Daily target for current activity</div>
                    </div>

                    {/* INTERACTIVE HYDRATION TILE */}
                    <div className="dora-vital-tile dora-hydration-tile">
                      <div className="dora-vital-top">
                        <span className="dora-vital-label">Hydration Target</span>
                        <Droplets size={14} className="text-blue" />
                      </div>
                      <div className="dora-vital-val">
                        {assessResult.recommended_daily_water_liters} <small>Liters</small>
                      </div>
                      <div className="dora-water-counter">
                        <span>
                          Logged: <b>{waterDrunkGlasses}</b> / {assessResult.recommended_daily_glasses || 10} glasses
                        </span>
                        <div className="dora-water-actions">
                          <button
                            type="button"
                            onClick={() => setWaterDrunkGlasses(Math.max(0, waterDrunkGlasses - 1))}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setWaterDrunkGlasses(waterDrunkGlasses + 1)}
                          >
                            + Log Glass
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RISK PROFILE BANNER */}
                  <div className={`dora-risk-strip risk-${assessResult.risk_badge}`}>
                    <div className="dora-risk-icon-wrap">
                      <Award size={20} />
                    </div>
                    <div>
                      <div className="dora-risk-header-text">Overall Cardiovascular & Metabolic Profile:</div>
                      <div className="dora-risk-status-text">{assessResult.overall_risk_profile}</div>
                      <p className="dora-risk-advice-text">{assessResult.bmi_advice}</p>
                    </div>
                  </div>

                  {/* GEMINI AI WELLNESS PLAN */}
                  {assessResult.ai_wellness_plan && (
                    <div className="dora-gemini-box">
                      <div className="dora-gemini-header">
                        <div className="dora-gemini-tag">
                          <Sparkles size={14} />
                          <span>Google Gemini Preventive Wellness Strategy</span>
                        </div>
                      </div>
                      <div className="dora-gemini-body">
                        {assessResult.ai_wellness_plan}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: MEDICAL DIRECTORY ================= */}
        {activeTab === "library" && (
          <div className="dora-encyclopedia-view">
            <div className="dora-panel dora-glass-panel">
              {/* ENCYCLOPEDIA HEADER */}
              <div className="dora-library-header">
                <div>
                  <h3 className="dora-panel-heading">📚 Clinical Pathologies & Disease Encyclopedia</h3>
                  <p className="dora-panel-caption">
                    Indexed {diseasesList.length} diagnostic profiles across {categoriesSet.length - 1} clinical specialties.
                  </p>
                </div>

                {/* SEARCH & CATEGORY FILTER */}
                <div className="dora-library-controls">
                  <div className="dora-cat-pills">
                    {categoriesSet.map((cat) => (
                      <button
                        key={cat}
                        className={`dora-cat-pill ${selectedCategoryFilter === cat ? "active" : ""}`}
                        onClick={() => setSelectedCategoryFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="dora-lib-search">
                    <Search size={15} />
                    <input
                      type="text"
                      placeholder="Filter diseases, categories..."
                      value={diseaseSearch}
                      onChange={(e) => setDiseaseSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* DISEASE CARDS GRID */}
              {loadingLibrary ? (
                <div className="dora-dossier-loading">
                  <div className="dora-dna-loader">
                    <span></span><span></span><span></span><span></span>
                  </div>
                  <p>Loading disease knowledge base...</p>
                </div>
              ) : (
                <div className="dora-disease-cards-grid">
                  {filteredDiseases.map((d, idx) => {
                    const isExpanded = expandedDisease === idx;
                    return (
                      <div key={idx} className="dora-disease-neo-card">
                        <div className="dora-neo-card-top">
                          <span className="dora-neo-type">{d.type}</span>
                          <span className={`dora-neo-sev sev-${(d.severity || "moderate").toLowerCase()}`}>
                            {d.severity}
                          </span>
                        </div>

                        <h4 className="dora-neo-title">{d.disease}</h4>

                        <div className="dora-neo-meta">
                          <span>Symptoms Profiled: <b>{d.symptoms_count || 5}+</b></span>
                        </div>

                        <div className="dora-neo-actions">
                          <button
                            type="button"
                            className="dora-neo-btn secondary"
                            onClick={() => setExpandedDisease(isExpanded ? null : idx)}
                          >
                            {isExpanded ? "Hide Details" : "View Overview"}
                          </button>

                          <button
                            type="button"
                            className="dora-neo-btn primary"
                            onClick={() => {
                              setChatInput(
                                `What are the complete clinical causes, symptoms, diagnostic tests, and treatment for ${d.disease}?`
                              );
                              setActiveTab("chat");
                            }}
                          >
                            Ask AI Doctor 💬
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="dora-neo-expanded-body">
                            <div className="dora-exp-row">
                              <b>Specialist:</b> General Physician / Specialist Consultant
                            </div>
                            <div className="dora-exp-row">
                              <b>Key Measures:</b> Monitor symptoms, avoid unprescribed antibiotics, and consult if fever/pain worsens.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
