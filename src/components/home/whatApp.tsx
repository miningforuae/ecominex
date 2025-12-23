import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = ({ phoneNumber = '+18079074455' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Open WhatsApp function
  const openWhatsApp = () => {
    // Format phone number (remove any non-numeric characters)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}`;
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={openWhatsApp}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 z-50"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-9 w-9" />
        </button>
      )}
    </>
  );
};

export default FloatingWhatsApp;