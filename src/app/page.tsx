"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Loading() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/registration');
    }, 5000); 
    return () => clearTimeout(timer); 
  }, [router]); 

    return (
      <div className="background min-h-screen flex flex-col justify-center items-center py-4">
        <img src="/Logo.svg" alt="" className="w-40 h-auto"/>
      </div>
    )
}