import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState({ students: 0, teachers: 0 });

  useEffect(() => {
    const fetchAdminData = async () => {
      // Check auth and role
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      
      const { data: currentUser } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (currentUser?.role !== 'admin') {
        navigate({ to: "/dashboard" });
        return;
      }

      // Fetch all users
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to load users");
      } else if (profiles) {
        setUsers(profiles);
        setStats({
          students: profiles.filter(p => p.role === 'student').length,
          teachers: profiles.filter(p => p.role === 'teacher').length,
        });
      }
      setLoading(false);
    };

    fetchAdminData();
  }, [navigate]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success("User role updated!");
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading admin portal...</div>;
  }

  return (
    <AppLayout role="admin" title="Admin Portal">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">Global Overview</h1>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">{stats.students}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">{stats.teachers}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Faculty
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">0</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Active Classes
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* User Management */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              User Management
            </span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Manage Roles & Accounts</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Promote students to teachers, update fee balances, and manage access.
            </p>
            <a href="#directory" className="block text-center w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              Jump to Directory
            </a>
          </div>

          {/* Catalog Management */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm opacity-50 cursor-not-allowed">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Catalog Management
            </span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Manage Classes</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add new classes, assign teachers, and edit existing catalog details.
            </p>
            <button disabled className="w-full py-3 border border-white/10 text-muted-foreground text-[10px] font-bold uppercase tracking-widest cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>

        {/* User Directory */}
        <div id="directory" className="bg-slate-custom/30 border border-white/5 rounded-sm">
          <div className="p-6 md:p-8 border-b border-white/5">
            <h3 className="font-serif text-2xl">User Directory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-muted-foreground text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium">{user.full_name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-gold"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
