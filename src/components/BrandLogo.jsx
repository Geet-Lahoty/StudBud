import { useState } from "react";

const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida/AEtjO1Vr2GYOM7QSrHw5pgriFAX6jrJrSfK6U3-0JIXdpEPiQBWOlcimQfO3hx2PgzlnAQGbV7azPaQvjTDxuvPDCD9pKi3WyTkXUK8XxKLaMVHKtzPYktIXRaY3G_m5ZnHqVh4CyYN0Tdqpt7nRlzVcsqrGJz2j-0XgqFgOstQkCX4VXh34HTwTSz1fhNvGv29lveWVtP_CWdo0x-7XlZMN7D7f59GJdfetDyQxVvq9NWezTswrF80gDzZWFBw";

export default function BrandLogo({ className = "h-9 w-auto", alt = "stud bud Exam Mastery System" }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="flex items-center gap-2 font-editorial-heading text-xl font-bold tracking-tight text-primary">
        <span className="w-8 h-8 rounded bg-primary text-surface flex items-center justify-center font-serif text-sm font-bold border border-outline-variant shadow-xs">
          sb
        </span>
        <span className="tracking-tight">
          stud<span className="text-secondary italic ml-1">bud</span>
        </span>
      </div>
    );
  }

  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      className={`${className} object-contain`}
      onError={() => setImageError(true)}
      loading="eager"
    />
  );
}
