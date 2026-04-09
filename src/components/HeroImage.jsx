import React from 'react';
import { Upload } from 'lucide-react';

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function HeroImage({ currentDate, uploadedImage, setUploadedImage, extractColor, accentColor }) {
    const month = currentDate.getMonth();
    const year  = currentDate.getFullYear();

    const accent = accentColor || '#2563eb';

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setUploadedImage(ev.target.result);
                localStorage.setItem('calendar_custom_image', ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative w-full overflow-hidden rounded-t-xl group h-44 sm:h-56 md:h-72">
            {/* Photo */}
            <img
                src={uploadedImage || `https://picsum.photos/seed/${year}${month}/1200/700`}
                crossOrigin="anonymous"
                onLoad={(e) => extractColor(e.target)}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Calendar Cover"
            />

            {/* Upload button */}
            <label className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-full cursor-pointer transition opacity-0 group-hover:opacity-100 shadow-lg z-20">
                <Upload size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {/* Blue chevron / mountain-peak shape at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: '64px' }}>
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* left solid triangle */}
                    <polygon points="0,20 0,8 30,20" fill={accent} opacity="1" />
                    {/* main chevron peak */}
                    <polygon points="0,20 50,0 100,20" fill={accent} opacity="1" />
                    {/* full bottom bar */}
                    <rect x="0" y="15" width="100" height="5" fill={accent} />
                </svg>
            </div>

            {/* Month / Year badge — sits on top of the chevron bottom-right */}
            <div className="absolute bottom-0 right-0 z-20 pr-5 pb-2 text-right pointer-events-none">
                <p className="text-white text-sm font-light leading-none tracking-widest drop-shadow" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{year}</p>
                <h1 className="text-white text-3xl md:text-4xl font-black uppercase leading-none tracking-tight drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    {MONTH_NAMES[month]}
                </h1>
            </div>
        </div>
    );
}
