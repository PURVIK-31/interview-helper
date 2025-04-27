import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomInterviewCover() {
  const coverImages = [
    "/images/covers/interview-1.jpg",
    "/images/covers/interview-2.jpg",
    "/images/covers/interview-3.jpg",
    "/images/covers/interview-4.jpg",
    "/images/covers/interview-5.jpg",
  ];
  
  return coverImages[Math.floor(Math.random() * coverImages.length)];
} 