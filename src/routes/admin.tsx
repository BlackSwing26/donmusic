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

type ClassData = {
  id: string;
  name: string;
  description: string;
  instrument: string;
  level: string;
  teachers?: { teacher_id: string; profiles: { full_name: string } }[];
};

type CompletedSession = {
  id: string;
  scheduled_for: string;
  classes: { name: string };
  profiles: { full_name: string };
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [stats, setStats] = useState({ students: 0, teachers: 0, activeClasses: 0, completedLessons: 0 });
  
  const [recentLessons, setRecentLessons] = useState<CompletedSession[]>([]);

  // Catalog Form State
  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [newClassInstrument, setNewClassInstrument] = useState("Piano");
  const [newClassLevel, setNewClassLevel] = useState("Beginner");
  
  // Teacher Assignment State
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    // Check auth and role
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    
    setCurrentUserId(session.user.id);
    
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
    const { data: profiles, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      toast.error("Failed to load users");
    } else if (profiles) {
      setUsers(profiles);
      setStats(prev => ({
        ...prev,
        students: profiles.filter(p => p.role === 'student').length,
        teachers: profiles.filter(p => p.role === 'teacher').length,
      }));
    }

    // Fetch classes and assigned teachers
    const { data: classesData, error: classesError } = await supabase
      .from('classes')
      .select(`
        *,
        class_teachers (
          teacher_id,
          profiles:teacher_id (full_name)
        )
      `);

    if (!classesError && classesData) {
      setClasses(classesData as unknown as ClassData[]);
      setStats(prev => ({ ...prev, activeClasses: classesData.length }));
    }

    // Fetch recent completed lessons
    const { data: doneSessions, error: doneSessionsError } = await supabase
      .from('class_sessions')
      .select(`
        id, scheduled_for,
        classes (name),
        profiles:teacher_id (full_name)
      `)
      .eq('status', 'done')
      .order('scheduled_for', { ascending: false })
      .limit(10);

    if (doneSessions && !doneSessionsError) {
      setRecentLessons(doneSessions as unknown as CompletedSession[]);
      setStats(prev => ({ ...prev, completedLessons: doneSessions.length }));
    }

    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      toast.success("User role updated!");
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
      if (error) throw error;
      toast.success(`User account ${newStatus}!`);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          name: newClassName,
          description: newClassDescription,
          instrument: newClassInstrument,
          level: newClassLevel
        }])
        .select()
        .single();
        
      if (error) throw error;
      toast.success("Class created successfully!");
      setNewClassName("");
      setNewClassDescription("");
      
      // Refresh classes
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create class");
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !selectedTeacherId) {
      toast.error("Please select both a class and a teacher");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('class_teachers')
        .insert([{ class_id: selectedClassId, teacher_id: selectedTeacherId }]);
        
      if (error) throw error;
      toast.success("Teacher assigned to class!");
      setSelectedClassId("");
      setSelectedTeacherId("");
      
      // Refresh classes
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign teacher (they might already be assigned)");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading admin portal...</div>;
  }

  const teachers = users.filter(u => u.role === 'teacher');

  return (
    <AppLayout role="admin" title="Admin Portal">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Stats */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">Global Overview</h1>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">{stats.students}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">{stats.teachers}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Faculty</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">{stats.activeClasses}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Classes</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quick Actions</span>
            <h3 className="text-xl mt-4 mb-2 font-serif">User Management</h3>
            <p className="text-muted-foreground text-sm mb-6">Promote students to teachers and suspend accounts.</p>
            <a href="#directory" className="block text-center w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              Jump to Directory
            </a>
          </div>

          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quick Actions</span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Catalog Management</h3>
            <p className="text-muted-foreground text-sm mb-6">Add new classes and assign teachers.</p>
            <a href="#catalog" className="block text-center w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              Jump to Catalog
            </a>
          </div>

          {/* Activity Feed */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm flex flex-col h-full max-h-[300px]">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 block">
              Recent Activity
            </span>
            <h3 className="font-serif text-xl mb-4">Completed Lessons</h3>
            <div className="space-y-4 overflow-y-auto pr-2">
              {recentLessons.length === 0 ? (
                <p className="text-sm italic text-muted-foreground">No completed lessons yet.</p>
              ) : (
                recentLessons.map(lesson => {
                  const dateStr = new Date(lesson.scheduled_for).toLocaleDateString();
                  return (
                    <div key={lesson.id} className="border-l-2 border-green-500 pl-3">
                      <div className="text-sm font-bold text-gold">{lesson.classes.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Taught by {lesson.profiles?.full_name} on {dateStr}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
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
                  <th className="px-6 py-4 font-medium">Actions</th>
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
                      {user.id === currentUserId ? (
                        <span className="text-gold font-bold">Admin (You)</span>
                      ) : (
                        <select 
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-gold"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.id !== currentUserId && (
                        <button 
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className={`text-xs px-3 py-1 rounded-sm border ${
                            user.status === 'active' 
                              ? 'border-red-900/50 text-red-400 hover:bg-red-900/20' 
                              : 'border-green-900/50 text-green-400 hover:bg-green-900/20'
                          }`}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catalog Management Section */}
        <div id="catalog" className="grid lg:grid-cols-2 gap-6">
          
          {/* Create Class Form */}
          <div className="bg-slate-custom/30 border border-white/5 rounded-sm p-6 md:p-8">
            <h3 className="font-serif text-2xl mb-6">Create New Class</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Class Name</label>
                <input 
                  type="text" 
                  required
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                  placeholder="e.g. Advanced Jazz Improv"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Description</label>
                <textarea 
                  value={newClassDescription}
                  onChange={e => setNewClassDescription(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold min-h-[80px]"
                  placeholder="What will students learn?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Instrument</label>
                  <select 
                    value={newClassInstrument}
                    onChange={e => setNewClassInstrument(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                  >
                    <option value="Piano">Piano</option>
                    <option value="Guitar">Guitar</option>
                    <option value="Violin">Violin</option>
                    <option value="Voice">Voice</option>
                    <option value="Theory">Theory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Level</label>
                  <select 
                    value={newClassLevel}
                    onChange={e => setNewClassLevel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-gold text-onyx text-[10px] font-bold uppercase tracking-widest hover:bg-gold/90 transition-all rounded-sm mt-4">
                Create Class
              </button>
            </form>
          </div>

          {/* Assign Teacher Form */}
          <div className="bg-slate-custom/30 border border-white/5 rounded-sm p-6 md:p-8">
            <h3 className="font-serif text-2xl mb-6">Assign Instructor</h3>
            <form onSubmit={handleAssignTeacher} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Select Class</label>
                <select 
                  required
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                >
                  <option value="">-- Choose a class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Select Teacher</label>
                <select 
                  required
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                >
                  <option value="">-- Choose a teacher --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-foreground text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm mt-4">
                Assign Teacher
              </button>
            </form>

            <div className="mt-8">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-bold border-b border-white/5 pb-2">Active Assignments</h4>
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                {classes.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No classes created yet.</p>
                ) : (
                  classes.map(c => (
                    <div key={c.id} className="text-sm">
                      <span className="font-bold text-gold">{c.name}</span>
                      <div className="text-muted-foreground text-xs mt-1">
                        Instructors: {c.teachers && c.teachers.length > 0 
                          ? c.teachers.map(t => t.profiles?.full_name || 'Unknown').join(", ") 
                          : "None assigned"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </AppLayout>
  );
}
