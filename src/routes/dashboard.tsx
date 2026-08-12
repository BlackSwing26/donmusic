import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type ClassData = {
  id: string;
  name: string;
  description: string;
  instrument: string;
  level: string;
  class_teachers?: { profiles: { full_name: string } }[];
};

type EnrollmentData = {
  id: string;
  class_id: string;
  status: string;
  classes: ClassData;
};

type UpcomingSession = {
  id: string;
  class_id: string;
  scheduled_for: string;
  classes: { name: string, class_teachers?: { profiles: { full_name: string } }[] };
  hasCheckedIn: boolean;
};

type AssignmentData = {
  id: string;
  title: string;
  description: string;
  due_date: string;
  classes: { name: string };
  assignment_submissions: { status: string }[];
};

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Student");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<EnrollmentData[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [myAssignments, setMyAssignments] = useState<AssignmentData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    
    const userId = session.user.id;
    setCurrentUserId(userId);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
      
    if (profile?.full_name) {
      setUserName(profile.full_name.split(' ')[0]);
    }

    // Fetch my enrollments
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        id, class_id, status,
        classes (
          id, name, description, instrument, level,
          class_teachers (
            profiles (full_name)
          )
        )
      `)
      .eq('student_id', userId);

    if (enrollments && !enrollError) {
      setMyEnrollments(enrollments as unknown as EnrollmentData[]);
      
      // Fetch upcoming sessions for ACTIVE enrollments
      const activeClassIds = enrollments.filter(e => e.status === 'active').map(e => e.class_id);
      
      if (activeClassIds.length > 0) {
        const { data: sessions, error: sessionsError } = await supabase
          .from('class_sessions')
          .select(`
            id, class_id, scheduled_for,
            classes (
              name,
              class_teachers (profiles (full_name))
            ),
            attendance (student_id)
          `)
          .in('class_id', activeClassIds)
          .eq('status', 'scheduled')
          .order('scheduled_for', { ascending: true });
          
        if (sessions && !sessionsError) {
          const formattedSessions = sessions.map((s: any) => ({
            id: s.id,
            class_id: s.class_id,
            scheduled_for: s.scheduled_for,
            classes: s.classes,
            hasCheckedIn: s.attendance?.some((att: any) => att.student_id === userId) || false
          }));
          setUpcomingSessions(formattedSessions);
        }

        // Fetch Assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            id, title, description, due_date,
            classes (name),
            assignment_submissions (status, student_id)
          `)
          .in('class_id', activeClassIds)
          .order('due_date', { ascending: true });

        if (assignments && !assignmentsError) {
          // Filter out submissions for other students
          const formattedAssignments = assignments.map((a: any) => ({
            ...a,
            assignment_submissions: a.assignment_submissions?.filter((sub: any) => sub.student_id === userId) || []
          }));
          setMyAssignments(formattedAssignments);
        }
      }
    }

    // Fetch all classes
    const { data: allClasses, error: classesError } = await supabase
      .from('classes')
      .select(`
        id, name, description, instrument, level,
        class_teachers (
          profiles (full_name)
        )
      `);

    if (allClasses && !classesError) {
      // Filter out classes the user is already enrolled in
      const enrolledClassIds = enrollments?.map(e => e.class_id) || [];
      const available = allClasses.filter(c => !enrolledClassIds.includes(c.id));
      setAvailableClasses(available as unknown as ClassData[]);
    }

    setLoading(false);
  };

  const handleEnroll = async (classId: string) => {
    if (!currentUserId) return;
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{
          student_id: currentUserId,
          class_id: classId,
          status: 'pending'
        }]);

      if (error) throw error;
      toast.success("Enrollment requested! Waiting for instructor approval.");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Failed to enroll");
    }
  };

  const handleCheckIn = async (sessionId: string) => {
    if (!currentUserId) return;
    try {
      const { error } = await supabase
        .from('attendance')
        .insert([{
          session_id: sessionId,
          student_id: currentUserId,
          status: 'present'
        }]);

      if (error) throw error;
      toast.success("Checked in successfully!");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Failed to check in");
    }
  };

  const handleCompleteAssignment = async (assignmentId: string) => {
    if (!currentUserId) return;
    try {
      const { error } = await supabase
        .from('assignment_submissions')
        .insert([{
          assignment_id: assignmentId,
          student_id: currentUserId,
          status: 'completed'
        }]);

      if (error) throw error;
      toast.success("Assignment completed! Great job!");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Failed to complete assignment");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading campus...</div>;
  }

  return (
    <AppLayout role="student" title="Personal Campus">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">Welcome back, {userName}.</h1>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">{myEnrollments.filter(e => e.status === 'active').length}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Active Classes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">{upcomingSessions.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Upcoming Lessons
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Lessons Module */}
        {upcomingSessions.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl mb-6 border-b border-white/5 pb-4">Next Lessons</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map(session => {
                const dateObj = new Date(session.scheduled_for);
                const dateStr = dateObj.toLocaleDateString();
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={session.id} className="bg-slate-custom/30 p-6 border border-white/5 rounded-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2 block">
                        {dateStr} • {timeStr}
                      </span>
                      <h3 className="font-serif text-xl mb-1">{session.classes.name}</h3>
                      <p className="text-xs text-muted-foreground mb-6">
                        Instructor: {session.classes.class_teachers?.[0]?.profiles?.full_name || 'Unknown'}
                      </p>
                    </div>
                    
                    {session.hasCheckedIn ? (
                      <div className="w-full text-center py-2 bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Checked In
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleCheckIn(session.id)}
                        className="w-full py-2 bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-onyx text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm"
                      >
                        Check-in
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* My Assignments Module */}
        {myAssignments.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl mb-6 border-b border-white/5 pb-4">My Coursework</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAssignments.map(assignment => {
                const dateObj = new Date(assignment.due_date);
                const isCompleted = assignment.assignment_submissions?.some(s => s.status === 'completed');
                
                return (
                  <div key={assignment.id} className={`p-6 border border-white/5 rounded-sm flex flex-col justify-between ${
                    isCompleted ? 'bg-black/20 opacity-60' : 'bg-slate-custom/30'
                  }`}>
                    <div>
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2 block">
                        Due: {dateObj.toLocaleDateString()}
                      </span>
                      <h3 className="font-serif text-xl mb-1">{assignment.title}</h3>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-bold">
                        {assignment.classes?.name}
                      </div>
                      <p className="text-sm text-foreground/80 mb-6">
                        {assignment.description}
                      </p>
                    </div>
                    
                    {isCompleted ? (
                      <div className="w-full text-center py-2 bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Completed
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleCompleteAssignment(assignment.id)}
                        className="w-full py-2 bg-gold text-onyx hover:bg-gold/90 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* My Classes */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm flex flex-col h-full">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 block">
              My Schedule
            </span>
            <h3 className="font-serif text-2xl mb-6">Enrolled Classes</h3>
            
            <div className="space-y-4 flex-grow overflow-y-auto max-h-[400px] pr-2">
              {myEnrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">You haven't enrolled in any classes yet.</p>
              ) : (
                myEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="p-4 border border-white/10 rounded-sm bg-black/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl text-gold">{enrollment.classes.name}</h4>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm ${
                        enrollment.status === 'active' ? 'bg-green-500/10 text-green-400' : 
                        enrollment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                        'bg-white/10 text-white'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-4">
                      <span>Level: {enrollment.classes.level}</span>
                      <span>Instrument: {enrollment.classes.instrument}</span>
                    </div>
                    {enrollment.classes.class_teachers && enrollment.classes.class_teachers.length > 0 && (
                      <div className="text-xs mt-2 text-white/70">
                        Instructor: {enrollment.classes.class_teachers[0].profiles?.full_name || 'Unknown'}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Classes */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm flex flex-col h-full">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 block">
              Course Catalog
            </span>
            <h3 className="font-serif text-2xl mb-6">Available Classes</h3>
            
            <div className="space-y-4 flex-grow overflow-y-auto max-h-[400px] pr-2">
              {availableClasses.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No new classes available right now.</p>
              ) : (
                availableClasses.map((cls) => (
                  <div key={cls.id} className="p-4 border border-white/10 rounded-sm bg-black/20">
                    <h4 className="font-serif text-xl text-gold mb-1">{cls.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{cls.description}</p>
                    
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-white/50">
                        {cls.class_teachers && cls.class_teachers.length > 0 ? (
                          <span>With {cls.class_teachers[0].profiles?.full_name}</span>
                        ) : (
                          <span>Instructor TBA</span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleEnroll(cls.id)}
                        className="px-4 py-2 border border-gold/50 text-gold hover:bg-gold hover:text-onyx text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
