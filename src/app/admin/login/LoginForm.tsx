"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", padding: "4rem 1rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary)" }}>تسجيل الدخول للإدارة</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">اسم المستخدم</label>
            <input type="text" id="username" name="username" className="input-field" required />
          </div>
          <div className="input-group" style={{ marginBottom: "2rem" }}>
            <label htmlFor="password">كلمة المرور</label>
            <input type="password" id="password" name="password" className="input-field" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
