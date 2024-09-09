import { useCardano } from "@/contexts/CardanoContext";
import React from "react";

export default function Home() {
  const { address } = useCardano();

  return (
    <>
      {address === null ? (
        <div>Conectate primero</div>
      ) : (
        <div>Inicia una campaã</div>
      )}
    </>
  );
}
