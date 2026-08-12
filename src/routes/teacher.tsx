import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher")({
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

function TeacherDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Instructor");
  const [loading, setLoading] = useState(true);
  const [myClasses, setMyClasses] = useState<AssignedClass[]>([]);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0 });

  useEffect(() => {
    fetchTeacherData();
  }, [navigate]);

  const fetchTeacherData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    
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

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading faculty portal...</div>;
  }

  return (
    <AppLayout role="teacher" title="Faculty Portal">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">Welcome, {userName}.</h1>
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
          </div>
        </div>

        <div>
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

      </div>
    </AppLayout>
  );
}
