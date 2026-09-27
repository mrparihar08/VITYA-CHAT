import React, { useState, useEffect, useCallback } from "react";
import {
  getSubscriptions,
  getSubscriptionSummary,
  createSubscription,
  deleteSubscription,
  updateSubscription,
} from "../../services/api";
import "./SubscriptionsApp.css";

const SubscriptionsApp = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [category, setCategory] = useState("Entertainment");
  const [nextDueDate, setNextDueDate] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [listData, summaryData] = await Promise.all([
        getSubscriptions(),
        getSubscriptionSummary(),
      ]);
      setSubscriptions(Array.isArray(listData) ? listData : []);
      setSummary(summaryData);
    } catch (err) {
      console.error("Failed to fetch subscriptions data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    try {
      await createSubscription({
        name,
        amount: parseFloat(amount),
        billing_cycle: billingCycle,
        category,
        next_due_date: nextDueDate || null,
      });
      setName("");
      setAmount("");
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to add subscription");
    }
  };

  const handleToggleStatus = async (sub) => {
    const newStatus = sub.status === "active" ? "paused" : "active";
    try {
      await updateSubscription(sub.id, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update subscription status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) return;
    try {
      await deleteSubscription(id);
      fetchData();
    } catch (err) {
      alert("Failed to delete subscription");
    }
  };

  return (
    <div className="vitya-subs-app">
      <div className="subs-header">
        <div>
          <h2 className="subs-title">🔄 Recurring Subscriptions & Bills</h2>
          <p className="subs-subtitle">
            Manage your monthly subscriptions, SaaS services, and recurring utility bills.
          </p>
        </div>
        <button className="subs-add-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Add Subscription
        </button>
      </div>

      <div className="subs-summary-row">
        <div className="subs-summary-card">
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Monthly Committed</span>
          <h3 style={{ fontSize: 22, color: "#818cf8", margin: 0 }}>₹{summary?.total_monthly_committed || 0}</h3>
        </div>
        <div className="subs-summary-card">
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Yearly Commitment</span>
          <h3 style={{ fontSize: 22, color: "#ffffff", margin: 0 }}>₹{summary?.total_yearly_committed || 0}</h3>
        </div>
        <div className="subs-summary-card">
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Active Subscriptions</span>
          <h3 style={{ fontSize: 22, color: "#34d399", margin: 0 }}>{summary?.active_count || 0}</h3>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.6)", padding: 20 }}>Loading subscriptions...</p>
      ) : subscriptions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(30, 41, 59, 0.4)", borderRadius: 16 }}>
          <span style={{ fontSize: 40 }}>🔄</span>
          <h3 style={{ marginTop: 12 }}>No Subscriptions Added</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Keep track of your recurring subscriptions and avoid surprise charges.</p>
        </div>
      ) : (
        <div className="subs-list">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="sub-item-card">
              <div className="sub-info-col">
                <div className="sub-icon-avatar">⚡</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h4 className="sub-name">{sub.name}</h4>
                    <span className="sub-cycle-badge">{sub.billing_cycle}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Category: {sub.category}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div className="sub-amount-col">
                  <div className="sub-amount">₹{sub.amount}</div>
                  {sub.next_due_date && <div className="sub-due-date">Due: {sub.next_due_date}</div>}
                </div>

                <button
                  className={`sub-status-badge status-${sub.status}`}
                  onClick={() => handleToggleStatus(sub)}
                  title="Click to toggle status"
                  style={{ border: "none", cursor: "pointer" }}
                >
                  {sub.status}
                </button>

                <button
                  onClick={() => handleDelete(sub.id)}
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD SUBSCRIPTION MODAL */}
      {showAddModal && (
        <div className="savings-modal-overlay">
          <div className="savings-modal">
            <h3 style={{ margin: 0 }}>Add Recurring Subscription</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="savings-form-group">
                <label>Service / Bill Name</label>
                <input className="savings-input" required placeholder="e.g. Netflix, Spotify, Gym, Cloud Hosting" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="savings-form-group">
                <label>Billing Amount (₹)</label>
                <input className="savings-input" type="number" step="any" required placeholder="649" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="savings-form-group">
                <label>Billing Cycle</label>
                <select className="savings-input" value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="savings-form-group">
                <label>Category</label>
                <select className="savings-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Entertainment">Entertainment & Streaming</option>
                  <option value="Utilities">Utilities & Electricity</option>
                  <option value="Software">Software & Cloud</option>
                  <option value="Fitness">Fitness & Health</option>
                  <option value="Housing">Housing & Rent</option>
                </select>
              </div>
              <div className="savings-form-group">
                <label>Next Due Date</label>
                <input className="savings-input" type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} />
              </div>

              <div className="savings-modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="subs-add-btn">Add Subscription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsApp;
