import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext(null);

const TOKEN_KEY = "foodhub_token";
const USER_KEY = "foodhub_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("khaja_notifications");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("khaja_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const theme = user?.theme || "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [user]);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: { token }
    });
    setSocket(socketInstance);

    socketInstance.on("order:statusUpdated", (payload) => {
      setNotifications((prev) => [
        { id: Date.now(), message: `Order ${payload.orderCode} updated to ${payload.status}` },
        ...prev
      ]);
    });
    socketInstance.on("order:placed", (payload) => {
      setNotifications((prev) => [
        { id: Date.now(), message: `New order ${payload.orderCode} placed` },
        ...prev
      ]);
    });
    socketInstance.on("message:new", () => {
      setNotifications((prev) => [{ id: Date.now(), message: "New message received" }, ...prev]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const clearNotifications = () => setNotifications([]);

  const value = useMemo(
    () => ({ token, user, login, logout, socket, setUser, notifications, clearNotifications }),
    [token, user, socket, notifications]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
