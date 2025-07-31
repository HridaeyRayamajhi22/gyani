
// import { Webhook } from "svix";
// import User from "../models/User.js";
// import { Purchase } from "../models/Purchase.js";
// import Course from "../models/Course.js";
// import Stripe from "stripe";

// // API Controller functions to Manage clerk User with DB
// export const clerkWebhooks = async (req, res) => {
//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     await whook.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     const { data, type } = req.body;

//     switch (type) {
//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           imageUrl: data.image_url,
//         };
//         await User.create(userData);
//         res.json({});
//         break;
//       }

//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           imageUrl: data.image_url,
//         };
//         await User.findByIdAndUpdate(data.id, userData);
//         res.json({});
//         break;
//       }

//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         res.json({});
//         break;
//       }
//       default:
//         break;
//     }
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

// export const stripeWebhooks = async(request, response)=>{
   
//     const signature = request.headers['stripe-signature'];
//     let event;
//     try {
//       event = Stripe.webhooks.constructEvent(
//         request.body,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.sendStatus(400);
//     }

//       // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':{
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;
      
//       const session = await stripeInstance.checkout.sessions.list({
//          payment_intent: paymentIntentId
//       })

//         // 🔹 Debug log here
//       console.log('Session list:', session.data);

//       if (!session.data.length || !session.data[0].metadata.purchaseId) {
//         console.log('⚠️ No checkout session or purchaseId found for this payment');
//         break;
//       }

//       const {purchaseId} = session.data[0].metadata
//       const purchaseData = await Purchase.findById(purchaseId)
//       const userData = await User.findById(purchaseData.userId)
//       const courseData = await Course.findById(purchaseData.courseId.toString())
      
//       courseData.enrolledStudents.push(userData)
//       await courseData.save()

//       userData.enrolledCourses.push(courseData._id)
//       await userData.save()

//       purchaseData.status = 'completed'
//       await purchaseData.save()
//       break;
//     }

//     case 'payment_intent.payment_failed':{
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;
      
//       const session = await stripeInstance.checkout.sessions.list({
//          payment_intent: paymentIntentId
//       })

//       const {purchaseId} = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId)
//       purchaseData.status = 'failed'
//       await purchaseData.save()
       
//       break;
//     }
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({received: true});

//   }


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
    // req.body is a Buffer because of bodyParser.raw
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
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        console.log("💳 Session List:", sessionList.data);

        if (!sessionList.data.length || !sessionList.data[0].metadata?.purchaseId) {
          console.warn("⚠️ No checkout session or purchaseId found.");
          break;
        }

        const { purchaseId } = sessionList.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.warn(`⚠️ Purchase ${purchaseId} not found in DB.`);
          break;
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());

        if (!userData || !courseData) {
          console.warn("⚠️ User or Course not found.");
          break;
        }

        // Update DB
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();

        console.log(`✅ Purchase ${purchaseId} marked as completed`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (sessionList.data.length && sessionList.data[0].metadata?.purchaseId) {
          const { purchaseId } = sessionList.data[0].metadata;
          const purchaseData = await Purchase.findById(purchaseId);
          if (purchaseData) {
            purchaseData.status = "failed";
            await purchaseData.save();
            console.log(`❌ Purchase ${purchaseId} marked as failed`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.sendStatus(200); // Acknowledge to Stripe
  } catch (err) {
    console.error("❌ Error processing Stripe webhook:", err);
    res.sendStatus(500);
  }
};
