import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { orderTitle, budget } = req.body;

        // Stripe requires amount in cents (multiply by 100)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Service Payment: ${orderTitle}`,
                            description: 'Payment for completed service on Teyzix',
                        },
                        unit_amount: budget * 100, // $50 becomes 5000 cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Return URLs after payment success/cancel
            success_url: 'http://localhost:5173/customer-dashboard?payment=success',
            cancel_url: 'http://localhost:5173/customer-dashboard?payment=cancel',
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ success: false, message: 'Payment initiation failed' });
    }
};