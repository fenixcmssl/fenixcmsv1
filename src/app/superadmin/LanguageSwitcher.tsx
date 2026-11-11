"use client";
import { setSystemLocale } from '../actions/locale';
import { useTransition } from 'react';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isPending, startTransition] = useTransition();
  
  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      // Cambia el idioma y recarga la misma URL exacta donde está el usuario
      setSystemLocale(nextLocale, window.location.pathname + window.location.search);
    });
  };

  return (
    <select 
      value={currentLocale} 
      onChange={changeLanguage} 
      disabled={isPending}
      style={{ 
        backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #374151', 
        padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', 
        outline: 'none', cursor: 'pointer', fontWeight: 'bold' 
      }}
    >
      <option value="es">🇪🇸 ES</option>
      <option value="en">🇬🇧 EN</option>
      <option value="it">🇮🇹 IT</option>
      <option value="fr">🇫🇷 FR</option>
      <option value="pt">🇵🇹 PT</option>
      <option value="de">🇩🇪 DE</option>
    </select>
  );
}
