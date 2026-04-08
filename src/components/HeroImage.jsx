import React from 'react';
import { Upload } from 'lucide-react';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function HeroImage({ 
    currentDate, 
    uploadedImage, 
    setUploadedImage, 
    extractColor 
}) {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
           const reader = new FileReader();
           reader.onload = (ev) => {
               setUploadedImage(ev.target.result);
               localStorage.setItem('calendar_custom_image', ev.target.result);
           }
           reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-48 sm:h-64 md:h-80 w-full relative overflow-hidden group print:hidden bg-slate-200 dark:bg-slate-900 rounded-t-xl shadow-inner">
             <img 
               src={uploadedImage || `https://picsum.photos/seed/${currentYear}${currentMonth}/1200/600`}
               crossOrigin="anonymous"
               onLoad={(e) => extractColor(e.target)}
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               alt="Calendar Cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
             
             {/* Upload Overlay */}
             <label className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-full cursor-pointer transition flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg">
               <Upload size={20} />
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
             </label>

             <div className="absolute bottom-6 left-6 text-white text-shadow-md z-10 pointer-events-none">
                 <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-1 drop-shadow-lg">
                     {MONTH_NAMES[currentMonth]}
                 </h1>
                 <p className="text-xl md:text-2xl font-light opacity-90 tracking-widest drop-shadow-md">{currentYear}</p>
             </div>
        </div>
    );
}
