import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";

// Import layout components
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";

// Import view components
import EventsView from "./components/events/EventsView";
import BookingsView from "./components/bookings/BookingsView";
import PaymentsView from "./components/payments/PaymentsView";
import AnalyticsView from "./components/analytics/AnalyticsView";

// Import modal components
import CreateEventModal from "./components/modals/CreateEventModal";
import BookEventModal from "./components/modals/BookEventModal";
import PaymentModal from "./components/modals/PaymentModal";

// Import common components
import Toast from "./components/common/Toast";
import AuthScreen from "./components/auth/AuthScreen";
import ChatbotWidget from "./components/chat/ChatbotWidget";
import GuestDashboard from "./components/layout/GuestDashboard";

import { API_BASE } from "./config";

function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ems_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Theme State (Default to dark mode)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("ems_theme");
    return saved || "dark";
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState("events");

  // Core Data State
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Refresh triggers to re-run fetch useEffects
  const [refreshEvents, setRefreshEvents] = useState(0);
  const [refreshBookings, setRefreshBookings] = useState(0);
  const [refreshPayments, setRefreshPayments] = useState(0);

  // Modal Visibility State
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Selected event for booking/payment flows
  const [targetEvent, setTargetEvent] = useState(null);

  // Toast Alerts State
  const [toasts, setToasts] = useState([]);

  // Sync theme with HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync axios auth headers when user state changes
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  // Toggle Theme Callback
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("ems_theme", next);
      return next;
    });
  }, []);

  // Helper to trigger floating toast message
  const triggerToast = useCallback((message, type = "success", options = {}) => {
    const id = Date.now();
    const dismiss = () => setToasts((prev) => prev.filter((t) => t.id !== id));

    const wrappedOptions = {};
    if (options.onConfirm) {
      wrappedOptions.onConfirm = () => {
        options.onConfirm();
        dismiss();
      };
    }
    if (options.onCancel) {
      wrappedOptions.onCancel = () => {
        options.onCancel();
        dismiss();
      };
    } else if (type === "confirm") {
      wrappedOptions.onCancel = () => {
        dismiss();
      };
    }

    const newToast = { id, message, type, ...options, ...wrappedOptions };
    setToasts((prev) => [...prev, newToast]);

    if (type !== "confirm") {
      setTimeout(() => {
        dismiss();
      }, 4000);
    }
  }, []);

  // Fetch events using useEffect
  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE}/events/events`);
        setEvents(res.data || []);
      } catch (err) {
        console.error(err);
        triggerToast("Failed to fetch events", "error");
      }
    };
    fetchEvents();
  }, [user, refreshEvents, triggerToast]);

  // Fetch bookings using useEffect
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/bookings/bookings`);
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
        triggerToast("Failed to fetch bookings", "error");
      }
    };
    fetchBookings();
  }, [user, refreshBookings, triggerToast]);

  // Fetch payments using useEffect
  useEffect(() => {
    if (!user) return;
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/payment/orders`);
        setPayments(res.data || []);
      } catch (err) {
        console.error(err);
        triggerToast("Failed to fetch transaction logs", "error");
      }
    };
    fetchPayments();
  }, [user, refreshPayments, triggerToast]);

  // Fetch analytics data using useEffect (manager only)
  useEffect(() => {
    if (!user || user.role !== "manager") return;
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE}/analytics/summary`);
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      }
    };
    fetchAnalytics();
  }, [user, activeTab, refreshPayments, refreshBookings]);

  // Auth Submit Handlers
  const handleLogin = useCallback(async (email, password) => {
    if (!email || !password) {
      triggerToast("Please fill in all fields", "error");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      const userData = {
        email,
        name: res.data.name || "User",
        role: res.data.role || "user",
        token: res.data.token
      };
      setUser(userData);
      localStorage.setItem("ems_user", JSON.stringify(userData));
      triggerToast("Logged in successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      triggerToast(msg, "error");
      throw err;
    }
  }, [triggerToast]);

  const handleRegister = useCallback(async (name, email, password, role) => {
    if (!name || !email || !password) {
      triggerToast("Please fill in all fields", "error");
      return false;
    }
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      triggerToast("Registration successful! You can now log in.");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      triggerToast(msg, "error");
      return false;
    }
  }, [triggerToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("ems_user");
    triggerToast("Logged out successfully");
  }, [triggerToast]);

  // Action Submissions
  const handleCreateEvent = useCallback(async (eventData) => {
    try {
      await axios.post(`${API_BASE}/events/events`, eventData);
      triggerToast("Event created successfully!");
      setRefreshEvents(prev => prev + 1);
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to create event";
      triggerToast(msg, "error");
      return false;
    }
  }, [triggerToast]);

  const handleCreateBooking = useCallback(async (bookingData) => {
    if (!targetEvent) return false;

    // 1. FREE EVENT FLOW
    if (!targetEvent.ticket_price || targetEvent.ticket_price <= 0) {
      try {
        await axios.post(`${API_BASE}/bookings/bookings`, bookingData);
        triggerToast("Event booked successfully!");
        setRefreshBookings(prev => prev + 1);
        return true;
      } catch (err) {
        const msg = err.response?.data?.error || "Booking failed";
        triggerToast(msg, "error");
        return false;
      }
    }

    // 2. PAID EVENT FLOW (Payment first, then Booking)
    try {
      const amount = targetEvent.ticket_price;
      const res = await axios.post(`${API_BASE}/payment/create-order`, {
        event_id: targetEvent.id,
        amount,
      });

      const data = res.data;

      return new Promise((resolve) => {
        const handleMockPayment = async () => {
          triggerToast("Razorpay test mode unavailable. Simulating transaction...", "info");
          await new Promise(r => setTimeout(r, 1500));
          const paymentSuccess = {
            paymentId: "pay_mock_" + Math.random().toString(36).substring(2, 11),
            orderId: data.order?.id || data.id || "order_mock_fallback",
            status: "success",
            event_id: targetEvent.id,
            amount: amount
          };
          try {
            // Save Payment
            await axios.post(
              `${API_BASE}/payment/save`,
              paymentSuccess
            );

            // Save Booking
            await axios.post(`${API_BASE}/bookings/bookings`, bookingData);

            triggerToast(`Payment successful and slot booked for ${targetEvent.name}! (Simulation Mode)`);
            setRefreshPayments(prev => prev + 1);
            setRefreshBookings(prev => prev + 1);
            resolve(true);
          } catch (err) {
            const msg = err.response?.data?.error || "Payment verification or booking failed";
            triggerToast(msg, "error");
            resolve(false);
          }
        };

        if (data.isMock || !window.Razorpay) {
          handleMockPayment();
          return;
        }

        const options = {
          key: data.key_id || import.meta.env.VITE_RAZORPAY_KEY,
          amount: data.order?.amount || data.amount,
          currency: data.order?.currency || data.currency || "INR",
          order_id: data.order?.id || data.id,

          handler: async function (response) {
            const paymentSuccess = {
              paymentId: response.razorpay_payment_id || "test_payment_123",
              orderId: response.razorpay_order_id || data.order?.id || data.id,
              status: "success",
              event_id: targetEvent.id,
              amount: amount
            };

            try {
              // Save Payment
              await axios.post(
                `${API_BASE}/payment/save`,
                paymentSuccess
              );

              // Save Booking
              await axios.post(`${API_BASE}/bookings/bookings`, bookingData);

              triggerToast(`Payment successful and slot booked for ${targetEvent.name}!`);
              setRefreshPayments(prev => prev + 1);
              setRefreshBookings(prev => prev + 1);
              resolve(true);
            } catch (err) {
              const msg = err.response?.data?.error || "Payment verification or booking failed";
              triggerToast(msg, "error");
              resolve(false);
            }
          },
          prefill: {
            name: bookingData.name || (user ? user.name : ""),
            email: bookingData.email || (user ? user.email : ""),
            contact: bookingData.phone || ""
          },
          theme: {
            color: "#6366f1",
          },
          modal: {
            ondismiss: function () {
              triggerToast("Payment cancelled", "warning");
              resolve(false);
            }
          }
        };

        try {
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } catch (err) {
          console.warn("Razorpay open failed, falling back to mock payment:", err);
          handleMockPayment();
        }
      });
    } catch (err) {
      const msg = err.response?.data?.error || "Payment order creation failed";
      triggerToast(msg, "error");
      return false;
    }
  }, [targetEvent, user, triggerToast]);

  const handleCreatePayment = useCallback(async (amount) => {
    // Legacy separate payment flow is no longer used
    return false;
  }, []);

  // Modal open controllers (using memoized callbacks for EventsView)
  const openBookingFor = useCallback((event) => {
    setTargetEvent(event);
    setShowBookingModal(true);
  }, []);

  const openPaymentFor = useCallback((event) => {
    setTargetEvent(event);
    setShowPaymentModal(true);
  }, []);

  const handleDeleteEvent = useCallback((eventId) => {
    triggerToast("Are you sure you want to delete this event?", "confirm", {
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/events/events/${eventId}`);
          triggerToast("Event deleted successfully!");
          setRefreshEvents(prev => prev + 1);
        } catch (err) {
          const msg = err.response?.data?.message || "Failed to delete event";
          triggerToast(msg, "error");
        }
      }
    });
  }, [triggerToast]);

  const handleGenerateDescription = useCallback(async (event) => {
    triggerToast("Generating description with AI...", "info");
    try {
      const aiRes = await axios.post(`${API_BASE}/ai/generate-description`, {
        name: event.name,
        date: event.date,
        time: event.time,
        venue: event.venue
      });
      const newDescription = aiRes.data?.description;
      if (!newDescription) {
        throw new Error("No description returned from AI");
      }
      await axios.put(`${API_BASE}/events/events/${event.id}/description`, {
        description: newDescription
      });
      triggerToast("Event description regenerated!");
      setRefreshEvents(prev => prev + 1);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || "Failed to generate description";
      triggerToast(msg, "error");
    }
  }, [triggerToast]);

  // 1. Auth Page View (New Guest Dashboard with top-right navbar login/signin modals)
  if (!user) {
    return (
      <GuestDashboard
        onLogin={handleLogin}
        onRegister={handleRegister}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        toasts={toasts}
      />
    );
  }

  // 2. Logged-in Dashboard Layout
  return (
    <div className="app-container">
      {/* Notifications overlay */}
      <Toast toasts={toasts} />

      {/* Corporate application header */}
      <Header
        userName={user.name}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      />

      {/* Tab navigation bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />

      {/* Views selection based on selected tab */}
      <main className="tab-content">
        {activeTab === "events" && (
          <EventsView
            events={events}
            userRole={user.role}
            onCreateEventClick={() => setShowEventModal(true)}
            onBookClick={openBookingFor}
            onPayClick={openPaymentFor}
            onDeleteClick={handleDeleteEvent}
            onGenerate={handleGenerateDescription}
          />
        )}

        {activeTab === "bookings" && user.role !== "manager" && <BookingsView bookings={bookings} />}

        {activeTab === "payments" && user.role !== "manager" && <PaymentsView payments={payments} />}

        {activeTab === "analytics" && user.role === "manager" && (
          <AnalyticsView analyticsData={analyticsData} totalEventsCount={events.length} />
        )}
      </main>

      {/* Modal overlays */}
      <CreateEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onCreateEvent={handleCreateEvent}
      />

      <BookEventModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        event={targetEvent}
        user={user}
        onBook={handleCreateBooking}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        event={targetEvent}
        onPaymentSubmit={handleCreatePayment}
      />

      {/* AI Chatbot Assistant */}
      <ChatbotWidget />
    </div>
  );
}

export default App;