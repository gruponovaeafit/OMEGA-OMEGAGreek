"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Loading() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/email');
    },3500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="background">
      <img 
        src="https://novaeafit.blob.core.windows.net/omega-2025/LOGO-GRANDE.svg" 
        alt="Logo NOVA" 
        className="w-80 h-auto animate-breathing -ml-6"
      />
    </div>
  );
}
