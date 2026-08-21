import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isLandingPage(pathname: string | null): boolean {
  if (!pathname || pathname === "/") return false;
  
  if (pathname.startsWith("/landing")) return true;
  
  // Root-level dynamic slugs (not part of the standard temple pages)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) {
    const standardRootPaths = [
      "about", "activities", "admin", "annual-report", "api", "blog", "calendar", 
      "checkout", "contact", "csr-support-for-iskcon", "darshans", "dashboard", 
      "donation", "donor-care", "guest-house", "location", "menu", "new", 
      "new-bhakta-program", "pooja-booking", "privacy", "seo-panel", "services", 
      "signin", "signup", "songs", "terms-and-conditions", "unsubscribe", 
      "volunteer", "wave-city-temple", "accounts"
    ];
    return !standardRootPaths.includes(segments[0]);
  }
  
  return false;
}
