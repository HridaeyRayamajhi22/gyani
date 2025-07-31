// import { Webhook } from "svix";
// import Stripe from "stripe";
// import User from "../models/User.js";
// import { Purchase } from "../models/Purchase.js";
// import Course from "../models/Course.js";

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// // -------------------- Clerk Webhook --------------------
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
//         res.status(200).json({});
//         break;
//       }

//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address, // fixed
//           name: data.first_name + " " + data.last_name,
//           imageUrl: data.image_url,
//         };
//         await User.findByIdAndUpdate(data.id, userData);
//         res.status(200).json({});
//         break;
//       }

//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         res.status(200).json({});
//         break;
//       }

//       default:
//         res.status(200).json({ received: true });
//     }
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // -------------------- Stripe Webhook --------------------
// export const stripeWebhooks = async (request, response) => {
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   let event;

//   // Stripe sends raw buffer, not JSON
//   const sig = request.headers["stripe-signature"];

//   try {
//     event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
//     return response.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case "payment_intent.succeeded": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       if (!session.data.length || !session.data[0].metadata.purchaseId) {
//         console.log("No metadata or session found for this payment intent");
//         break;
//       }

//       const { purchaseId } = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId);
//       if (!purchaseData) {
//         console.log(`Purchase ${purchaseId} not found`);
//         break;
//       }

//       purchaseData.status = "Completed";
//       await purchaseData.save();
//       console.log(`✅ Purchase ${purchaseId} marked as Completed`);
//       break;
//     }

//     case "payment_intent.payment_failed": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       if (session.data.length && session.data[0].metadata.purchaseId) {
//         const { purchaseId } = session.data[0].metadata;
//         const purchaseData = await Purchase.findById(purchaseId);
//         if (purchaseData) {
//           purchaseData.status = "Failed";
//           await purchaseData.save();
//           console.log(`❌ Purchase ${purchaseId} marked as Failed`);
//         }
//       }
//       break;
//     }

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   response.json({ received: true });
// };



import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import Stripe from "stripe";

// API Controller functions to Manage clerk User with DB

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
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(request, response)=>{
      const event = request.body;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = Stripe.webhooks.constructEvent(
        request.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }

      // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      
      const session = await stripeInstance.checkout.sessions.list({
         payment_intent: paymentIntentId
      })

      const {purchaseId} = session.data[0].metadata
      const purchaseData = await Purchase.findById(purchaseId)
      const userData = await User.findById(purchaseData.userId)
      const courseData = await Course.findById(purchaseData.courseId.toString())
      
      courseData.enrolledStudents.push(userData)
      await courseData.save()

      userData.enrolledCourses.push(courseData._id)
      await userData.save()


      purchaseData.status = 'Completed'
      await purchaseData.save()
      break;
    }

    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      
      const session = await stripeInstance.checkout.sessions.list({
         payment_intent: paymentIntentId
      })

      const {purchaseId} = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId)
      purchaseData.status = 'Failed'
      await purchaseData.save()
       
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});

  }}
