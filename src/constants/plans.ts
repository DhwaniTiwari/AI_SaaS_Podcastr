export const plans = [
    {
        _id: 1,
        name: "Free",
        description: "For creators just staring out.",
        img: "/icons/free-plan.svg",
        price: 0,
        credits: 2,
        maxDuration: 5, // minutes
        features: [
            "2 episodes / month",
            "Up to 5 minutes per episode",
            "Basic AI voice",
            "Watermark included",
            "No commercial use",
        ],
    },
    {
        _id: 2,
        name: "Pro",
        description: "For serious monthly creators",
        img: "/icons/pro-plan.svg",
        price: 399,
        credits: 20,
        maxDuration: 20, // minutes
        features: [
            "20 episodes / month",
            "Up to 20 minutes per episode",
            "High-quality AI voices",
            "No watermark",
            "MP3 + WAV download",
            "Commercial use allowed"
        ],
    },
    {
        _id: 3,
        name: "Enterprise",
        description: "For teams and agencies.",
        img: "/icons/enterprise-plan.svg",
        price: "Custom",
        credits: "Unlimited",
        maxDuration: "Unlimited",
        features: [
            "Custom pricing",
            "Higher / unlimited usage",
            "Team access",
            "API access",
            "Priority support"
        ],
    },
];
