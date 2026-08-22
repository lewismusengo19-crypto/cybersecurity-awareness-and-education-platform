import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Image, ZoomIn, Download, X, Search, Maximize2 } from 'lucide-react';
import { ImageContent } from '../types';

export const GallerySection: React.FC = () => {
  const app = useApp();
  const [activeImage, setActiveImage] = useState<ImageContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownload = (img: ImageContent) => {
    app.logActivity('Download Content', `Downloaded infographic image: ${img.title_en}`);
    alert(app.translate(
      `Downloading Cybersecurity Infographic: "${app.translate(img.title_en, img.title_bm)}".\n(In production, this initiates a direct, secure local save of the asset.)`,
      `Sendani Ifipope pafya Kuicingilila: "${app.translate(img.title_en, img.title_bm)}".\n(Ifyo balumbula, ici cilatwala kusunga icipe muli foni yenu.)`
    ));
  };

  const filteredImages = app.images.filter(img => {
    const title = app.translate(img.title_en, img.title_bm).toLowerCase();
    const desc = app.translate(img.description_en, img.description_bm).toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="space-y-8 text-left animate-fade-in" id="gallery-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Image className="h-6 w-6 text-green-500" />
            <span>{app.translate('Cybersecurity Infographics Gallery', 'Ifipope fya Kuicingilila pa Intaneti')}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {app.translate('View, zoom, and download cybersecurity educational visual diagrams.', 'Moneni, kusheni icipope, no kusenda amashiwi ayalelondolola pafya kuicingilila.')}
          </p>
        </div>

        {/* Image Search bar */}
        <div className="relative max-w-sm w-full">
          <input
            id="gallery-search-input"
            type="text"
            placeholder={app.translate('Search gallery...', 'Fwayeni ifipope...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
          >
            {/* Image Preview Container */}
            <div className="relative overflow-hidden aspect-[4/3] bg-slate-950">
              <img
                src={img.url}
                alt={app.translate(img.title_en, img.title_bm)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Lightbox / Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  id={`zoom-img-${img.id}`}
                  onClick={() => setActiveImage(img)}
                  className="p-3 bg-white/15 hover:bg-white/20 text-white border border-white/20 rounded-full transition-transform transform scale-90 hover:scale-100 cursor-pointer"
                  title={app.translate('Zoom In', 'Mone Sana')}
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  id={`download-img-${img.id}`}
                  onClick={() => handleDownload(img)}
                  className="p-3 bg-green-600 hover:bg-green-500 text-white rounded-full transition-transform transform scale-90 hover:scale-100 cursor-pointer"
                  title={app.translate('Download', 'Futa')}
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Image info */}
            <div className="p-5 space-y-2">
              <h4 className="font-bold text-white text-base line-clamp-1">
                {app.translate(img.title_en, img.title_bm)}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {app.translate(img.description_en, img.description_bm)}
              </p>
              <div className="border-t border-slate-850 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{img.views + 42} {app.translate('views', 'abantambile')}</span>
                <span>{img.downloads + 12} {app.translate('downloads', 'abasendele')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX ZOOM MODAL */}
      {activeImage && (
        <div className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center p-4 backdrop-blur-md" id="gallery-lightbox">
          <button
            id="close-lightbox"
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 p-2 bg-slate-900 border border-slate-800 text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer z-50"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col md:flex-row bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Image display */}
            <div className="md:flex-1 bg-black max-h-[70vh] flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.url}
                alt=""
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>

            {/* Info details panel */}
            <div className="p-6 md:w-80 flex flex-col justify-between bg-slate-900 text-left border-t md:border-t-0 md:border-l border-slate-800">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-[10px] font-mono">
                  <span>CERTIFIED LESSON IMAGE</span>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  {app.translate(activeImage.title_en, activeImage.title_bm)}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {app.translate(activeImage.description_en, activeImage.description_bm)}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-6 mt-6 space-y-3">
                <button
                  id="lightbox-download-btn"
                  onClick={() => handleDownload(activeImage)}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>{app.translate('Download Infographic', 'Sendeni ICipope')}</span>
                </button>
                <p className="text-[10px] text-slate-500 text-center font-mono uppercase">
                  FREE TO SHARE & RE-DISTRIBUTE
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
