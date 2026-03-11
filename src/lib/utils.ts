export const calculateFare = (distance: number): number => {
  const basePrice = 5;
  const pricePerKm = 2;
  return basePrice + distance * pricePerKm;
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateBookingReference = (): string => {
  return "BK" + Date.now().toString().slice(-6);
};
