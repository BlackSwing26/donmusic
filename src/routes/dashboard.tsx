import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import lessonMaterials from "../assets/lesson-materials.jpg";
import performanceHighlight from "../assets/performance-highlight.jpg";
import galleryPiano from "../assets/gallery-piano.jpg";
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

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Student");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<EnrollmentData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    
    setCurrentUserId(session.user.id);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', session.user.id)
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
      .eq('student_id', session.user.id);

    if (enrollments && !enrollError) {
      setMyEnrollments(enrollments as unknown as EnrollmentData[]);
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
              <div className="text-3xl font-serif text-gold">0</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Practice Hrs
              </div>
            </div>
          </div>
        </div>

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
