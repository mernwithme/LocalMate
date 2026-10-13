import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const sendBookingEmailToProducer = async ({
  service,
  provider,
  bookingDate,
  timeSlot,
  address,
  notes,
  customer = { name: 'Valued Client', email: 'client@localmate.com', phone: 'N/A' },
}) => {
  const templateParams = {
    producer_name: provider?.name || 'Service Producer',
    producer_email: provider?.email || 'provider@localmate.com',
    client_name: customer?.name || 'Client',
    client_email: customer?.email || 'client@localmate.com',
    client_phone: customer?.phone || 'N/A',
    service_title: service?.title || 'LocalMate Service',
    service_category: service?.category || 'General Service',
    booking_date: bookingDate,
    time_slot: timeSlot,
    service_address: address,
    special_notes: notes || 'None',
    total_price: `₹${service?.price || 0}`,
  };

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || PUBLIC_KEY === 'your_public_key_here') {
    console.warn('[EmailJS] Keys not configured. Simulating email dispatch to producer:', templateParams);
    toast.success(`[Demo] Notification email dispatched to producer ${templateParams.producer_name}!`, {
      duration: 4000,
    });
    return { success: true, simulated: true, params: templateParams };
  }

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('[EmailJS] Email sent successfully to producer:', response);
    toast.success(`Notification email sent to ${templateParams.producer_name}!`);
    return { success: true, response };
  } catch (error) {
    console.error('[EmailJS] Failed to send email to producer:', error);
    toast.error('Could not send email via EmailJS (falling back to in-app notification).');
    return { success: false, error };
  }
};

export const sendDirectEmailToProducer = async ({
  producerName,
  producerEmail,
  clientName,
  clientEmail,
  subject,
  message,
}) => {
  const templateParams = {
    producer_name: producerName || 'Producer',
    producer_email: producerEmail || 'provider@localmate.com',
    client_name: clientName || 'Client',
    client_email: clientEmail || 'client@localmate.com',
    subject: subject || 'Direct Client Inquiry - LocalMate',
    message: message,
  };

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || PUBLIC_KEY === 'your_public_key_here') {
    console.warn('[EmailJS] Keys not configured. Simulating direct email to producer:', templateParams);
    toast.success(`[Demo] Email sent to producer ${producerName}!`, {
      duration: 4000,
    });
    return { success: true, simulated: true, params: templateParams };
  }

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    toast.success(`Message emailed to ${producerName}!`);
    return { success: true, response };
  } catch (error) {
    console.error('[EmailJS] Direct mail error:', error);
    toast.error('Failed to deliver email to producer.');
    return { success: false, error };
  }
};
