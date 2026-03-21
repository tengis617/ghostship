"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Unique sprite images
const images = [
  "/images/logo-sprites/wind-01.png",
  "/images/logo-sprites/wind-02.png",
  "/images/logo-sprites/wind-03.png",
  "/images/logo-sprites/wind-04.png",
] as const;

// Animation sequence: neutral → right → neutral → left → deeper → back
const sequence = [0, 1, 0, 2, 3, 0];

const FRAME_DURATION = 300;

export function AnimatedLogo({ size = 144 }: { size?: number }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % sequence.length);
    }, FRAME_DURATION);
    return () => clearInterval(interval);
  }, []);

  const activeImage = sequence[step];

  return (
    <div
      className="ghost-float relative"
      style={{ width: size, height: size }}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? "GhostShip — pirate ghost mascot" : ""}
          width={size}
          height={size}
          priority={i === 0}
          className={`absolute inset-0 z-10 ${
            i === activeImage ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== 0}
        />
      ))}
    </div>
  );
}
