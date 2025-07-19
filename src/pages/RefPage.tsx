import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AuthModal from "@/components/modals/AuthModal";

const RefPage: React.FC = () => {
  const { id }   = useParams<{ id?: string }>();  
  const { search }  = useLocation();                     
  const navigate    = useNavigate();

  const [open, setOpen] = useState(true);                
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    let c = id;

    if (!c) {
      const q = new URLSearchParams(search);
      c = q.get("ref") || undefined;
    }

    if (!c) c = sessionStorage.getItem("gigpesa_referrer") || undefined;

    if (c) {
      sessionStorage.setItem("gigpesa_referrer", c);
      setCode(c);
    }

    // if (id) navigate("/register", { replace: true });
  }, [id, search, navigate]);

  const handleClose = () => {
    setOpen(false);   
    navigate("/"); 
  };

  return (
    id &&
    <AuthModal
      type="register"
      open={open}
      onClose={handleClose}
      referrerCode={code ?? undefined}
    />
    
  );
};

export default RefPage;
