const nodemailer = require("nodemailer");
const AdoptionRequest = require("../models/AdoptionRequest");
exports.handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, phone, id, petName } = req.body;

    if (!email || !phone || !id || !petName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a transporter using your email provider
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "c30f98c0bcac92",
        pass: "96636302b41055",
      },
    });

    // Create the email message
    const message = {
      from: "amityadav.it23@gmail.com",
      to: "amit09yadav12@gmail.com",
      subject: "Adoption Request",
      text: `Email: ${email}\nPhone: ${phone} contact them as soon as you can\nPet name is ${petName}\nThe Pet Id: ${id}`,
    };

    try {
      await AdoptionRequest.create({
        email,
        phone,
        productId: id,
        petName,
      });

      // Send the email
      await transporter.sendMail(message);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
