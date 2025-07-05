"use client"
import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function Feedback() {
    const [result, setResult] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", "1f8860a0-90d3-444b-84a4-080d6f3d68d3");
        formData.append("subject", "HOSTEL PROJECT- New Feedback Received");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Submitted Successfully");
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="w-full  px-[12%] py-10 scroll-mt-20  text-gray-900 transition-colors duration-200">
            <div className="text-center mb-20">

                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-wide mb-4">
                        Share your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600">Feedback</span>
                    </h1>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-600 to-teal-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
                        Found any discrepancies or need any features to be added? Want changes made or information updated? Contact us here!
                    </p>
                </div>

            </div>

            <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-auto gap-6 mt-10 mb-8">
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        required
                        className="flex-1 p-3 outline-none border-[0.5px] border-indigo-600 rounded-md focus:border-teal-600 bg-white text-gray-900 transition-colors duration-200"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="flex-1 p-3 outline-none border-[0.5px] border-indigo-600 rounded-md focus:border-teal-600 bg-white text-gray-900 transition-colors duration-200"
                    />
                </div>

                <textarea
                    name="message"
                    rows="6"
                    placeholder="Enter your feedback"
                    required
                    className="w-full p-4 outline-none border-[0.5px] border-indigo-600 rounded-md focus:border-teal-600 bg-white text-gray-900 transition-colors duration-200"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="my-2 py-3 px-8 w-max flex items-center justify-between gap-2 bg-indigo-50 border border-indigo-600 text-gray-900 rounded-full hover:bg-indigo-600/10 transition-all duration-300 disabled:opacity-50"
                >
                    {result || "Submit feedback"} <Send className="text-indigo-600 w-4 h-4"/>
                </button>
            </form>
        </div>
    );
}