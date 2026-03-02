import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext";
import { successEventName } from "../lib/notify";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/dashboard/students", label: "Students", icon: "users" },
  { to: "/dashboard/attendance", label: "Attendance", icon: "check" },
  { to: "/dashboard/attendance-history", label: "Attendance History", icon: "history" },
  { to: "/dashboard/marks", label: "Marks", icon: "book" },
  { to: "/dashboard/timetable", label: "Timetable", icon: "calendar" },
  { to: "/dashboard/timetable-history", label: "Timetable History", icon: "history" },
  { to: "/dashboard/teacher-notes", label: "Teacher Notes", icon: "notes" },
];

function Icon({ name }: { name: string }) {
  if (name === "grid") {
    return (
      <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path d="M3 20c0-3.3 2.7-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M14 20c.2-2.7 2.4-4.8 5.1-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 11l2.5 2.5L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 5.5A2.5 2.5 0 015.5 3H12v18H5.5A2.5 2.5 0 013 18.5v-13z" stroke="currentColor" strokeWidth="2" />
        <path d="M21 5.5A2.5 2.5 0 0018.5 3H12v18h6.5a2.5 2.5 0 002.5-2.5v-13z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "history") {
    return (
      <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12a9 9 0 109-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 3v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "notes") {
    return (
      <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Layout() {
  const { teacher, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 860 : false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 860;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    function handleSuccess(event: Event) {
      const customEvent = event as CustomEvent<string>;
      setSuccessMessage(customEvent.detail || "Action completed successfully.");
    }

    window.addEventListener(successEventName(), handleSuccess as EventListener);
    return () => window.removeEventListener(successEventName(), handleSuccess as EventListener);
  }, []);

  return (
    <div className="app-shell">
      {!!successMessage && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card success-modal-card">
            <div className="success-modal-head">
              <h3>Success</h3>
              <button
                className="success-modal-close"
                type="button"
                aria-label="Close success message"
                onClick={() => setSuccessMessage("")}
              >
                x
              </button>
            </div>
            <p className="success-modal-message">{successMessage}</p>
            <div className="success-modal-actions">
              <button className="btn btn-success-ok" type="button" onClick={() => setSuccessMessage("")}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {isMobile && mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <aside className={`sidebar ${isMobile ? "sidebar-mobile" : ""} ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div>
            <div className="sidebar-brand">
              <span className="sidebar-brand-icon" aria-hidden="true"></span>
              <h1>
                <span>Shule</span>
                <span className="sidebar-brand-accent">Track</span>
              </h1>
            </div>
            <p className="sidebar-teacher-name">
              <span className="online-dot" aria-hidden="true"></span>
              Teacher {teacher?.name || ""}
            </p>
          </div>
          {isMobile && (
            <button className="sidebar-mobile-close" type="button" onClick={() => setMobileOpen(false)}>
              Close
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              end={link.to === "/dashboard"}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-email">{teacher?.email || ""}</p>
          <NavLink to="/dashboard/profile" className="sidebar-signout" end onClick={() => isMobile && setMobileOpen(false)}>
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20c1.5-3.3 4.3-5 8-5s6.5 1.7 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            View Profile
          </NavLink>
          <button className="sidebar-signout" type="button" onClick={logout}>
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 17l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
      <main className="content">
        {isMobile && (
          <div className="mobile-topbar">
            <button className="mobile-menu-btn" type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              &#9776;
            </button>
            <div className="mobile-topbar-brand">
              <span className="sidebar-brand-icon mobile-brand-icon" aria-hidden="true"></span>
              <span>ShuleTrack</span>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
