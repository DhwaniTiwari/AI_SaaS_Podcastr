"use client";

import { plans } from "@/constants/plans";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import useRazorpay from "react-razorpay";

const Plans = () => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const createSubscription = useAction(api.razorpay.createSubscription);
    const [Razorpay] = useRazorpay();

    const handleSubscription = async (plan: any) => {
        if (plan.name === "Free") {
            toast.info("You are already on the Free plan.");
            return;
        }
        if (plan.name === "Enterprise") {
            toast.info("Please contact support for Enterprise plan.");
            return;
        }

        // Pro Plan
        try {
            setIsLoading(true);
            const subscription = await createSubscription({ planType: 'pro' });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key for client
                subscription_id: subscription.id,
                name: "Podcastr",
                description: "Pro Plan Subscription",
                handler: (response: any) => {
                    toast.success("Subscription successful!");
                    // The webhook will update the DB. 
                    // We could also optimistic update or poll.
                },
                theme: {
                    color: "#F97316"
                }
            };

            const rzp1 = new Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.log("Subscription Error", error);
            toast.error("Error initiating subscription");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="flex flex-col gap-8">
            <h1 className="text-20 font-bold text-white-1">Plans & Pricing</h1>
            <div className="flex flex-col gap-5 lg:flex-row">
                {plans.map((plan) => (
                    <div key={plan._id} className="w-full rounded-[20px] border border-black-4 bg-black-1 p-8 lg:w-1/3">
                        <div className="flex items-center justify-between pb-8 border-b border-black-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-20 font-bold text-white-1">{plan.name}</h2>
                                <p className="text-14 font-normal text-white-3">{plan.description}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <h1 className="text-32 font-bold text-white-1">
                                {typeof plan.price === 'number' ? `₹${plan.price}` : plan.price}
                            </h1>
                            {typeof plan.price === 'number' && <span className="text-14 font-normal text-white-3">/ month</span>}
                        </div>

                        <div className="mt-8 flex flex-col gap-4">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Image
                                        src="/icons/check.svg"
                                        width={24}
                                        height={24}
                                        alt="check"
                                    />
                                    <p className="text-base font-normal text-white-2">{feature}</p>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="mt-8 w-full bg-orange-1 font-extrabold text-white-1 hover:bg-black-1"
                            onClick={() => handleSubscription(plan)}
                            disabled={isLoading}
                        >
                            {isLoading && plan.name === 'Pro' ? <Loader className="animate-spin" /> : 'Choose Plan'}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Plans;
