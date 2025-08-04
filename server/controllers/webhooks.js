import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import Stripe from "stripe";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------- Clerk Webhooks -----------------
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        console.log(`Unhandled Clerk event: ${type}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- Stripe Webhooks -----------------
export const stripeWebhooks = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Stripe Event Received:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (!session.metadata?.purchaseId) {
          console.warn("⚠️ No purchaseId in metadata");
          break;
        }

        const purchaseId = session.metadata.purchaseId;
        const purchaseData = await Purchase.findById(purchaseId);

        if (!purchaseData) {
          console.warn(`⚠️ Purchase ${purchaseId} not found in DB.`);
          break;
        }

        // Fetch user & course
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        if (!userData || !courseData) {
          console.warn("⚠️ User or Course not found.");
          break;
        }

        // Enroll user
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        // Update purchase status
        purchaseData.status = "completed";
        await purchaseData.save();

        console.log(`✅ Purchase ${purchaseId} marked as completed`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error processing Stripe webhook:", err);
    res.sendStatus(500);
  }
};
