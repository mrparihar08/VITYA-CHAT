import React, { useState, useEffect, useCallback } from "react";
import {
  getSavingsGoals,
  createSavingsGoal,
  deleteSavingsGoal,
  depositToSavingsGoal,
} from "../../services/api";
import "./SavingsApp.css";

const SavingsApp = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [category, setCategory] = useState("Emergency");
  const [targetDate, setTargetDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSavingsGoals();
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch savings goals", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;
    try {
      await createSavingsGoal({
        title,
        target_amount: parseFloat(targetAmount),
        current_amount: currentAmount ? parseFloat(currentAmount) : 0,
        category,
        target_date: targetDate || null,
      });
      setTitle("");
      setTargetAmount("");
      setCurrentAmount("");
      setShowAddModal(false);
      fetchGoals();
    } catch (err) {
      alert("Failed to create savings goal");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || !showDepositModal) return;
    try {
      await depositToSavingsGoal(showDepositModal.id, parseFloat(depositAmount));
      setDepositAmount("");
      setShowDepositModal(null);
      fetchGoals();
    } catch (err) {
      alert("Failed to record deposit");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) return;
    try {
      await deleteSavingsGoal(id);
      fetchGoals();
    } catch (err) {
      alert("Failed to delete goal");
    }
  };

  const totalSaved = goals.reduce((acc, g) => acc + (g.current_amount || 0), 0);
  const totalTarget = goals.reduce((acc, g) => acc + (g.target_amount || 0), 0);

  return (
    <div className="vitya-savings-app">
      <div className="savings-header">
        <div>
          <h2 className="savings-title">🎯 Savings Goals & Milestones</h2>
          <p className="savings-subtitle">
            Track progress towards your target savings milestones and emergency funds.
          </p>
        </div>
        <button className="savings-add-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Create Savings Goal
        </button>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "12px 20px", flex: 1 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Total Amount Saved</span>
          <h3 style={{ fontSize: 22, color: "#10b981", margin: 0 }}>₹{totalSaved.toLocaleString()}</h3>
        </div>
        <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 20px", flex: 1 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Total Goal Target</span>
          <h3 style={{ fontSize: 22, color: "#ffffff", margin: 0 }}>₹{totalTarget.toLocaleString()}</h3>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.6)", padding: 20 }}>Loading savings goals...</p>
      ) : goals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(30, 41, 59, 0.4)", borderRadius: 16 }}>
          <span style={{ fontSize: 40 }}>🎯</span>
          <h3 style={{ marginTop: 12 }}>No Savings Goals Set Yet</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Create your first goal to start tracking progress towards your financial milestones.</p>
        </div>
      ) : (
        <div className="savings-grid">
          {goals.map((g) => {
            const pct = g.percentage_completed || (g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0);
            return (
              <div key={g.id} className="savings-card">
                <div className="savings-card-top">
                  <div>
                    <span className="goal-category-badge">{g.category || "General"}</span>
                    <h3 className="goal-title">{g.title}</h3>
                  </div>
                  {g.is_completed && <span style={{ background: "#10b981", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>COMPLETED 🎉</span>}
                </div>

                <div className="goal-amounts">
                  <span className="current-amount">₹{g.current_amount.toLocaleString()}</span>
                  <span className="target-amount">of ₹{g.target_amount.toLocaleString()} ({pct}%)</span>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.min(100, pct)}%` }} />
                </div>

                {g.target_date && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>📅 Target Date: {g.target_date}</span>}

                <div className="goal-card-footer">
                  <button className="deposit-btn" onClick={() => setShowDepositModal(g)}>+ Deposit Funds</button>
                  <button className="delete-goal-btn" onClick={() => handleDelete(g.id)} title="Delete Goal">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE GOAL MODAL */}
      {showAddModal && (
        <div className="savings-modal-overlay">
          <div className="savings-modal">
            <h3 style={{ margin: 0 }}>Create Savings Goal</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="savings-form-group">
                <label>Goal Title</label>
                <input className="savings-input" required placeholder="e.g. Emergency Fund, New Laptop" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="savings-form-group">
                <label>Target Amount (₹)</label>
                <input className="savings-input" type="number" step="any" required placeholder="50000" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
              </div>
              <div className="savings-form-group">
                <label>Initial Amount Saved (₹)</label>
                <input className="savings-input" type="number" step="any" placeholder="0" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} />
              </div>
              <div className="savings-form-group">
                <label>Category</label>
                <select className="savings-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Emergency">Emergency Fund</option>
                  <option value="Travel">Travel & Vacation</option>
                  <option value="Vehicle">Vehicle Purchase</option>
                  <option value="Gadgets">Gadgets & Tech</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
              <div className="savings-form-group">
                <label>Target Date</label>
                <input className="savings-input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </div>

              <div className="savings-modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="savings-add-btn">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <div className="savings-modal-overlay">
          <div className="savings-modal">
            <h3 style={{ margin: 0 }}>Deposit to "{showDepositModal.title}"</h3>
            <form onSubmit={handleDeposit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="savings-form-group">
                <label>Deposit Amount (₹)</label>
                <input className="savings-input" type="number" step="any" required placeholder="1000" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
              </div>

              <div className="savings-modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowDepositModal(null)}>Cancel</button>
                <button type="submit" className="savings-add-btn">Confirm Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsApp;
