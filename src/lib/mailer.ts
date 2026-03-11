import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      ...options,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

export const sendBookingConfirmation = async (
  email: string,
  bookingDetails: { pickupLocation: string; dropLocation: string; fare?: number }
) => {
  const html = `
    <h2>Booking Confirmation</h2>
    <p>Your booking has been confirmed.</p>
    <p><strong>Pickup:</strong> ${bookingDetails.pickupLocation}</p>
    <p><strong>Drop:</strong> ${bookingDetails.dropLocation}</p>
    <p><strong>Fare:</strong> $${bookingDetails.fare || "Pending"}</p>
    <p>Thank you for using our service!</p>
  `;

  return sendEmail({
    to: email,
    subject: "Booking Confirmation",
    html,
  });
};

export const sendBookingUpdate = async (email: string, status: string) => {
  const html = `
    <h2>Booking Update</h2>
    <p>Your booking status has been updated to: <strong>${status}</strong></p>
  `;

  return sendEmail({
    to: email,
    subject: "Booking Update",
    html,
  });
};
