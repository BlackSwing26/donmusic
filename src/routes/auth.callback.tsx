import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const handleEmailVerify = async () => {
      // Supabase PKCE flow typically puts the code in the hash or search params
      const hash = window.location.hash;
      const search = window.location.search;
      const params = new URLSearchParams(search || hash.replace('#', '?'));
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          toast.error("Verification failed: " + error.message);
          setStatus("Verification failed.");
          setTimeout(() => navigate({ to: "/login" }), 3000);
        } else {
          toast.success("Email verified successfully! Welcome to DonMusic.");
          navigate({ to: "/dashboard" });
        }
      } else {
        // If there's an error in the URL (e.g. error_description)
        const errorDesc = params.get("error_description");
        if (errorDesc) {
          toast.error(errorDesc);
          setStatus("Verification failed.");
        } else {
          // If no code is present but session exists, they are already verified
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              navigate({ to: "/dashboard" });
            } else {
              setStatus("No verification code found. Please check your email link again.");
            }
          });
        }
      }
    };

    handleEmailVerify();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-6">
      <div className="w-full max-w-md bg-slate-custom/30 p-8 border border-white/5 rounded-sm text-center">
        <h1 className="font-serif text-3xl mb-4 text-gold">Authenticating</h1>
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
