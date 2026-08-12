import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

type TeacherSearch = { tab?: string };

export const Route = createFileRoute("/teacher")({
  validateSearch: (search: Record<string, unknown>): TeacherSearch => {
    return {
      tab: search.tab as string | undefined,
    };
  },
  component: TeacherDashboard,
});

type EnrolledStudent = {
  id: string;
  status: string;
  student_id: string;
  profiles: { full_name: string, email: string };
};

type AssignedClass = {
  id: string;
  name: string;
  description: string;
  instrument: string;
  level: string;
  enrollments: EnrolledStudent[];
};

type SessionData = {
  id: string;
  class_id: string;
  scheduled_for: string;
  status: string;
  classes: { name: string, instrument: string, level: string };
  attendance: { student_id: string, profiles: { full_name: string } }[];
};

function TeacherDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Instructor");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [myClasses, setMyClasses] = useState<AssignedClass[]>([]);
  const [mySessions, setMySessions] = useState<SessionData[]>([]);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0 });
  const searchParams = Route.useSearch();
  const activeTab = searchParams.tab || 'schedule';

  // Scheduling State
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  
  // Assignment State
  const [assignmentClassId, setAssignmentClassId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [assignmentDue, setAssignmentDue] = useState("");

  useEffect(() => {
    fetchTeacherData();
  }, [navigate]);

  const fetchTeacherData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    
    setCurrentUserId(session.user.id);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', session.user.id)
      .single();
      
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      navigate({ to: "/dashboard" });
      return;
    }
    
    if (profile?.full_name) {
      setUserName(profile.full_name.split(' ')[0]);
    }
    
    // Fetch assigned classes via class_teachers junction
    const { data: classTeachers, error: classTeachersError } = await supabase
      .from('class_teachers')
      .select(`
        class_id,
        classes (
          id, name, description, instrument, level,
          enrollments (
            id, status, student_id,
            profiles:student_id (full_name, email)
          )
        )
      `)
      .eq('teacher_id', session.user.id);

    if (classTeachers && !classTeachersError) {
      // Map the nested data out
      const assigned = classTeachers
        .map((ct: any) => ct.classes)
        .filter(Boolean) as AssignedClass[];
      
      setMyClasses(assigned);

      // Calculate stats
      let totalS = 0;
      assigned.forEach(c => {
        totalS += (c.enrollments?.filter(e => e.status === 'active').length || 0);
      });
      
      setStats({
        totalClasses: assigned.length,
        totalStudents: totalS
      });
    }

    // Fetch sessions
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('class_sessions')
      .select(`
        id, class_id, scheduled_for, status,
        classes (name, instrument, level),
        attendance (
          student_id,
          profiles:student_id (full_name)
        )
      `)
      .eq('teacher_id', session.user.id)
      .order('scheduled_for', { ascending: true });

    if (sessionsData && !sessionsError) {
      setMySessions(sessionsData as unknown as SessionData[]);
    }

    setLoading(false);
  };

  const handleApproveEnrollment = async (enrollmentId: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: 'active' })
        .eq('id', enrollmentId);
        
      if (error) throw error;
      
      toast.success("Student approved and enrolled!");
      fetchTeacherData();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve student");
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !selectedClassId || !sessionDate || !sessionTime) {
      toast.error("Please fill out all fields");
      return;
    }

    // Combine date and time to ISO string
    const scheduledFor = new Date(`${sessionDate}T${sessionTime}`).toISOString();

    try {
      const { error } = await supabase
        .from('class_sessions')
        .insert([{
          class_id: selectedClassId,
          teacher_id: currentUserId,
          scheduled_for: scheduledFor,
          status: 'scheduled'
        }]);

      if (error) throw error;
      toast.success("Lesson scheduled successfully!");
      setSessionDate("");
      setSessionTime("");
      setSelectedClassId("");
      fetchTeacherData();
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule lesson");
    }
  };

  const handleMarkSessionDone = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('class_sessions')
        .update({ status: 'done' })
        .eq('id', sessionId);
        
      if (error) throw error;
      
      toast.success("Lesson marked as done!");
      fetchTeacherData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update session");
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !assignmentClassId || !assignmentTitle || !assignmentDue) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('assignments')
        .insert([{
          class_id: assignmentClassId,
          teacher_id: currentUserId,
          title: assignmentTitle,
          description: assignmentDesc,
          due_date: new Date(assignmentDue).toISOString()
        }]);

      if (error) throw error;
      toast.success("Assignment created successfully!");
      setAssignmentTitle("");
      setAssignmentDesc("");
      setAssignmentDue("");
      setAssignmentClassId("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create assignment");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading faculty portal...</div>;
  }

  const activeSessions = mySessions.filter(s => s.status === 'scheduled');

  return (
    <AppLayout role="teacher" title="Faculty Portal">
      <div className="max-w-7xl mx-auto pb-12 space-y-8">
          
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <div>
              <h1 className="font-serif text-3xl mb-2">Welcome, {userName}.</h1>
              <p className="text-muted-foreground text-sm">Here is your faculty overview</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-serif text-gold">{stats.totalClasses}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  My Classes
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-gold">{stats.totalStudents}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Active Students
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-gold">{activeSessions.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Upcoming Lessons
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'schedule' && (
            <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Schedule Lesson Form */}
              <div className="bg-slate-custom/30 border border-white/5 rounded-sm p-6 md:p-8">
                <h3 className="font-serif text-2xl mb-6">Schedule a Lesson</h3>
                <form onSubmit={handleScheduleSession} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Select Class</label>
                    <select 
                      required
                      value={selectedClassId}
                      onChange={e => setSelectedClassId(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                    >
                      <option value="">-- Choose a class --</option>
                      {myClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Date</label>
                      <input 
                        type="date" 
                        required
                        value={sessionDate}
                        onChange={e => setSessionDate(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Time</label>
                      <input 
                        type="time" 
                        required
                        value={sessionTime}
                        onChange={e => setSessionTime(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-gold text-onyx text-[10px] font-bold uppercase tracking-widest hover:bg-gold/90 transition-all rounded-sm mt-4">
                    Schedule Lesson
                  </button>
                </form>
              </div>

              {/* Active Sessions */}
              <div className="bg-slate-custom/30 border border-white/5 rounded-sm p-6 md:p-8 flex flex-col max-h-[500px]">
                <h3 className="font-serif text-2xl mb-6">Upcoming Lessons</h3>
                <div className="space-y-4 overflow-y-auto flex-grow pr-2">
                  {activeSessions.length === 0 ? (
                    <p className="text-sm italic text-muted-foreground">No upcoming lessons scheduled.</p>
                  ) : (
                    activeSessions.map(session => {
                      const dateObj = new Date(session.scheduled_for);
                      const dateStr = dateObj.toLocaleDateString();
                      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div key={session.id} className="p-4 border border-white/10 rounded-sm bg-black/20">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-serif text-xl text-gold">{session.classes.name}</h4>
                            <button 
                              onClick={() => handleMarkSessionDone(session.id)}
                              className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-black text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm"
                            >
                              Mark Done
                            </button>
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            {dateStr} at {timeStr}
                          </div>
                          
                          {/* Attendance Display */}
                          <div className="mt-2 border-t border-white/5 pt-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Checked In Students:</span>
                            {session.attendance && session.attendance.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {session.attendance.map(att => (
                                  <span key={att.student_id} className="text-xs bg-white/5 px-2 py-1 rounded-sm text-white">
                                    {att.profiles?.full_name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs italic text-muted-foreground">No students checked in yet</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roster' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-serif text-3xl mb-8 border-b border-white/5 pb-4">My Roster</h2>
              
              {myClasses.length === 0 ? (
                <div className="bg-slate-custom/30 p-12 border border-white/5 rounded-sm text-center">
                  <p className="text-muted-foreground">You have not been assigned to any classes yet.</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  {myClasses.map((cls) => (
                    <div key={cls.id} className="bg-slate-custom/30 border border-white/5 rounded-sm flex flex-col max-h-[500px]">
                      
                      {/* Class Header */}
                      <div className="p-6 border-b border-white/5 bg-black/20">
                        <h3 className="font-serif text-2xl text-gold">{cls.name}</h3>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                          <span>{cls.instrument}</span>
                          <span>•</span>
                          <span>{cls.level}</span>
                        </div>
                      </div>

                      {/* Student List */}
                      <div className="p-6 overflow-y-auto flex-grow">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Enrolled Students</h4>
                        
                        <div className="space-y-3">
                          {!cls.enrollments || cls.enrollments.length === 0 ? (
                            <p className="text-sm italic text-muted-foreground">No students enrolled yet.</p>
                          ) : (
                            cls.enrollments.map((student) => (
                              <div key={student.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02] rounded-sm">
                                <div>
                                  <div className="text-sm font-medium">{student.profiles?.full_name}</div>
                                  <div className="text-xs text-muted-foreground">{student.profiles?.email}</div>
                                </div>
                                
                                {student.status === 'pending' ? (
                                  <button 
                                    onClick={() => handleApproveEnrollment(student.id)}
                                    className="px-3 py-1 bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-onyx text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm"
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-400 rounded-sm">
                                    Active
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-custom/30 border border-white/5 rounded-sm p-6 md:p-8">
                <h3 className="font-serif text-2xl mb-6">Create Assignment</h3>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Select Class</label>
                      <select 
                        required
                        value={assignmentClassId}
                        onChange={e => setAssignmentClassId(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                      >
                        <option value="">-- Choose a class --</option>
                        {myClasses.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Due Date</label>
                      <input 
                        type="date" 
                        required
                        value={assignmentDue}
                        onChange={e => setAssignmentDue(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Assignment Title</label>
                    <input 
                      type="text" 
                      required
                      value={assignmentTitle}
                      onChange={e => setAssignmentTitle(e.target.value)}
                      placeholder="e.g. Practice C Major Scales"
                      className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Description / Instructions</label>
                    <textarea 
                      value={assignmentDesc}
                      onChange={e => setAssignmentDesc(e.target.value)}
                      placeholder="What exactly should they do?"
                      className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-2 focus:outline-none focus:border-gold min-h-[80px]"
                    />
                  </div>
                  
                  <button type="submit" className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-foreground text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm mt-4">
                    Assign to Class
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
    </AppLayout>
  );
}
