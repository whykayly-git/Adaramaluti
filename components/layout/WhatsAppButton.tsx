import { siteConfig } from "@/lib/site-config";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hello Adaramaluti House of Fashion, I'd like to make an enquiry."
  );

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.53 1.36 5.06L2 22l5.19-1.44a9.9 9.9 0 0 0 4.85 1.24h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 1.67c2.21 0 4.28.86 5.84 2.42a8.19 8.19 0 0 1 2.42 5.82c0 4.55-3.71 8.25-8.26 8.25a8.3 8.3 0 0 1-4.21-1.15l-.3-.18-3.08.86.82-3-.2-.31a8.22 8.22 0 0 1-1.26-4.39c0-4.55 3.71-8.32 8.23-8.32Zm-4.78 4.6c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.72 4.19 3.71 2.07.82 2.49.66 2.94.62.45-.04 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.35-.76-1.84-.2-.48-.4-.42-.55-.42Z" />
      </svg>
    </a>
  );
}
