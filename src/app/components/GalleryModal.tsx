import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GalleryImage {
  url?: string;
  title?: string;
  description?: string;
}



interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: GalleryImage[];
}

export function GalleryModal({ isOpen, onClose, title, images }: GalleryModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => openLightbox(index)}
                      className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <ImageWithFallback
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold text-lg">{image.title}</h3>
                          {image.description && (
                            <p className="text-sm text-gray-200">{image.description}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lightbox for enlarged image */}
          <AnimatePresence>
            {selectedImageIndex !== null && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeLightbox}
                  className="fixed inset-0 bg-black/90 z-[60]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                >
                  <button
                    onClick={closeLightbox}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                  >
                    <X className="w-8 h-8 text-white" />
                  </button>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                      >
                        <ChevronLeft className="w-8 h-8 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                      >
                        <ChevronRight className="w-8 h-8 text-white" />
                      </button>
                    </>
                  )}

                  <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                    <motion.div
                      key={selectedImageIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="relative max-w-full max-h-full"
                    >
                      <ImageWithFallback
                        src={images[selectedImageIndex].url}
                        alt={images[selectedImageIndex].title}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                        <h3 className="text-white text-xl font-bold mb-1">
                          {images[selectedImageIndex].title}
                        </h3>
                        {images[selectedImageIndex].description && (
                          <p className="text-gray-200 text-sm">
                            {images[selectedImageIndex].description}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs mt-2">
                          {selectedImageIndex + 1} / {images.length}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
