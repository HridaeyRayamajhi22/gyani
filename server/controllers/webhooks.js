import { Webhook } from "svix";
import User from "../models/User.js";

// // API Controller functions to Manage clerk User with DB

// const clerkWebhooks = async (req, res) => {
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

// export default clerkWebhooks


const clerkWebhooks = async (req, res) => {
  try {
    console.log('✅ Webhook hit at /clerk');
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payload = req.body.toString('utf8');

    console.log('📦 Raw payload:', payload);

    const event = whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log('🎯 Verified event:', event.type);

    const { data, type } = event;

    switch (type) {
      case "user.created":
        console.log('👤 Creating user:', data.id);
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log('✅ User created');
        break;

      case "user.updated":
        console.log('🔄 Updating user:', data.id);
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log('✅ User updated');
        break;

      case "user.deleted":
        console.log('🗑️ Deleting user:', data.id);
        await User.findByIdAndDelete(data.id);
        console.log('✅ User deleted');
        break;

      default:
        console.log('⚠️ Unhandled event type:', type);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
 export default clerkWebhooks