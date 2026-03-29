import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    customerName,
    customerEmail,
    address,
    total,
    items,
    targetEmail = "demickenbarnard2@gmail.com",
  } = req.body;

  if (!customerName || !customerEmail || !address || !items || items.length === 0) {
    return res.status(400).json({ error: "Missing order data" });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("Email not sent: SMTP not configured");
    return res.status(200).json({ success: false, message: "SMTP not configured in env. No mail sent." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const itemsHtml = items.map(item => `
      <li><strong>${item.name}</strong> x${item.quantity} @ R${item.price.toFixed(2)} = R${(item.price * item.quantity).toFixed(2)}</li>
    `).join("\n");

    const info = await transporter.sendMail({
      from: `${customerName} <${smtpUser}>`,
      to: targetEmail,
      subject: `New order from ${customerName}`,
      html: `
        <h2>New Checkout Order</h2>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Total:</strong> R${total.toFixed(2)}</p>
        <h3>Items</h3>
        <ul>${itemsHtml}</ul>
      `,
    });

    return res.status(200).json({ success: true, message: "Email sent", info });
  } catch (err) {
    console.error("Send email error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
