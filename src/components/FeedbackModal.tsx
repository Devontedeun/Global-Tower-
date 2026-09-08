import React, { useState } from "react";
import { MessageSquare, X, Send, CheckCircle2 } from "lucide-react";
import { Storage } from "../lib/storage";
import { FeedbackItem } from "../types";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<"bug" | "feature" | "content" | "general">("feature");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(Storage.getUser().email || "");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      type,
      title,
      description,
      userEmail: email,
      status: "new",
      date: new Date().toISOString().split("T")[0]
    };

    Storage.addFeedback(newFeedback);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B18]/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#E5E0D5]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#2D2D2D] text-xl">Ministry Feedback</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#8A8478] hover:text-[#2D2D2D] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#C5A059] mx-auto" />
            <h4 className="font-serif font-bold text-[#2D2D2D] text-lg">Thank You for Your Feedback!</h4>
            <p className="text-xs text-[#7A7468] max-w-xs mx-auto font-sans leading-relaxed">
              Your suggestion or report has been submitted to our ministry administration team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1.5 font-serif">Feedback Type</label>
              <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
                {(["feature", "content", "bug", "other"] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2 rounded-full capitalize transition-all cursor-pointer ${
                      type === t
                        ? "bg-[#C5A059] text-white shadow-2xs font-bold"
                        : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1.5 font-serif">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of your feedback or inquiry..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all placeholder:text-[#AAA498] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1.5 font-serif">Details</label>
              <textarea
                rows={4}
                required
                placeholder="Share your thoughts, suggestions, or describe any issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all placeholder:text-[#AAA498] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1.5 font-serif">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all placeholder:text-[#AAA498] font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E0D5]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#7A7468] hover:bg-[#F9F7F2] rounded-full cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
