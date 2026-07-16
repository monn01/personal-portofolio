"use client";

import { CustomCursor } from "./CustomCursor";
import { NetworkBackground } from "./NetworkBackground";
import { Preloader } from "./Preloader";
import { ScrollProgress } from "./ScrollProgress";
import { VisitTracker } from "./VisitTracker";

export function ClientEffects() {
  return (
    <>
      <Preloader />
      <NetworkBackground />
      <CustomCursor />
      <ScrollProgress />
      <VisitTracker />
    </>
  );
}
