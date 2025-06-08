import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import {
  Eye,
  EyeOff,
  VenusAndMars,
  Calendar,
  User,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const profileCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000,

  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },

  get() {
    if (!this.data || !this.timestamp) return null;

    const now = Date.now();
    if (now - this.timestamp > this.CACHE_DURATION) {
      // Cache expired
      this.clear();
      return null;
    }

    return this.data;
  },

  clear() {
    this.data = null;
    this.timestamp = null;
  },

  isValid() {
    return (
      this.data &&
      this.timestamp &&
      Date.now() - this.timestamp < this.CACHE_DURATION
    );
  },
};

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    avatar_url: "",
    name: "",
    age: "",
    gender: "male",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const cachedProfile = profileCache.get();
        if (cachedProfile) {
          setProfile(cachedProfile);
          setLoading(false);
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("User tidak ditemukan");

        const { data, error } = await supabase
          .from("Profile")
          .select("avatar_url, name, age, gender")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        const profileData = {
          avatar_url: data.avatar_url || "",
          name: data.name || "",
          age: data.age || "",
          gender: data.gender || "male",
        };

        profileCache.set(profileData);
        setProfile(profileData);
      } catch (error) {
        setMessage({
          text: "Gagal load profil: " + error.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      passwords.newPassword &&
      passwords.newPassword !== passwords.confirmNewPassword
    ) {
      setMessage({
        text: "Password baru dan konfirmasi tidak sama.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user)
        throw userError || new Error("User tidak ditemukan");

      const { error: profileError } = await supabase
        .from("Profile")
        .update({
          avatar_url: profile.avatar_url,
          name: profile.name,
          age: parseInt(profile.age),
          gender: profile.gender,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      if (passwords.newPassword) {
        const { error: updatePassError } = await supabase.auth.updateUser({
          password: passwords.newPassword,
        });
        if (updatePassError) throw updatePassError;
      }

      profileCache.set(profile);

      setMessage({ text: "Profil berhasil disimpan.", type: "success" });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setMessage({
        text: "Gagal simpan profil: " + error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      profileCache.clear();
      navigate("/");
    } catch (error) {
      setMessage({ text: "Gagal logout: " + error.message, type: "error" });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      profileCache.clear();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("User tidak ditemukan");

      const { data, error } = await supabase
        .from("Profile")
        .select("avatar_url, name, age, gender")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const profileData = {
        avatar_url: data.avatar_url || "",
        name: data.name || "",
        age: data.age || "",
        gender: data.gender || "male",
      };

      // Update state and cache
      setProfile(profileData);
      profileCache.set(profileData);

      setMessage({ text: "Profile berhasil di-refresh", type: "success" });
    } catch (error) {
      setMessage({
        text: "Gagal refresh profile: " + error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#88DE7C] to-white flex flex-col justify-center items-center p-5">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md">
        <div className="bg-[#48aa7c] text-white rounded-t-3xl p-6 text-center relative">
          <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center -mt-16 overflow-hidden">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="text-[#164E50] w-10 h-10" />
            )}
          </div>
          <h2 className="text-xl font-semibold mt-2">
            {profile.name || "User"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <User className="text-[#164E50]" />
            <input
              name="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={loading}
              className="border rounded p-1 w-full"
              placeholder="Name"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="text-[#164E50]" />
            <input
              name="age"
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              disabled={loading}
              className="border rounded p-1 w-full"
              placeholder="Age"
            />
          </div>
          <div className="flex items-center space-x-3">
            <VenusAndMars className="text-[#164E50]" />
            <select
              name="gender"
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              disabled={loading}
              className="border rounded p-1 w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="text-[#164E50]" />
            <div className="relative w-full">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                placeholder="New Password"
                className="border rounded p-1 w-full pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPasswords.newPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="text-[#164E50]" />
            <div className="relative w-full">
              <input
                type={showPasswords.confirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmNewPassword: e.target.value,
                  })
                }
                placeholder="Confirm Password"
                className="border rounded p-1 w-full pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmNewPassword")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPasswords.confirmNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#48aa7c] text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Edit profile"}
            </button>

            <button
              onClick={refreshProfile}
              className="flex-1 bg-[#48aa7c] text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Refresh Profile
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Logout
          </button>

          {message.text && (
            <p
              className={`text-center text-sm mt-2 ${
                message.type === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
