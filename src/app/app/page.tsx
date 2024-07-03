"use client";
import React from "react";
import App from "../../App";
import { ReactFlowProvider } from "reactflow";

const Page = () => {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
};

export default Page;
