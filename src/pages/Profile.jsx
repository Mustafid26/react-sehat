import React, { useEffect, useState } from "react";
import { supabase } from '../SupabaseClient';
import { Mail, Eye, VenusAndMars, Calendar, Phone, User } from "lucide-react";

export default function Profile() {
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
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
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

        setProfile({
          avatar_url: data.avatar_url || "",
          name: data.name || "",
          age: data.age || "",
          gender: data.gender || "male",
        });
      } catch (error) {
        setMessage("Gagal load profil: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage("Password baru dan konfirmasi tidak sama.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw userError || new Error("User tidak ditemukan");

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

      setMessage("Profil berhasil disimpan.");
      setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      setMessage("Gagal simpan profil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#88DE7C] to-white flex flex-col justify-center items-center p-5">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md">
        <div className="bg-[#164E50] text-white rounded-t-3xl p-6 text-center relative">
          <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center -mt-16 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="text-[#88DE7C] w-10 h-10" />
            )}
          </div>
          <h2 className="text-xl font-semibold mt-2">{profile.name || "User"}</h2>
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
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              disabled={loading}
              className="border rounded p-1 w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <Eye className="text-[#164E50]" />
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="New Password"
              className="border rounded p-1 w-full"
              disabled={loading}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Eye className="text-[#164E50]" />
            <input
              type="password"
              name="confirmNewPassword"
              value={passwords.confirmNewPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
              placeholder="Confirm Password"
              className="border rounded p-1 w-full"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-[#164E50] text-white px-4 py-2 rounded mt-4"
            disabled={loading}
          >
            {loading ? "Saving..." : "Edit profile"}
          </button>
          {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
}
