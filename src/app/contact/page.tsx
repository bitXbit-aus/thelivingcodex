"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SacredButton from "@/components/SacredButton";
import SectionIntro from "@/components/SectionIntro";
import DisclaimerBox from "@/components/DisclaimerBox";
import { Send, Mail, MessageSquare, Heart, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    newsletter: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, String(value));
    });

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (res.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-center"
        >
          <CheckCircle className="mx-auto h-12 w-12 text-[#d4a853]" />
          <h2 className="mt-6 text-2xl font-light tracking-wide text-[#f5f0e8]">
            Message received.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#7a7a8a]">
            Thank you for reaching out. Your message has entered the field and will
            be responded to in accordance with natural timing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SacredButton href="/" variant="primary" size="md">
              Return Home
            </SacredButton>
            <SacredButton href="/portal/" variant="outline" size="md">
              Visit Portal
            </SacredButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionIntro
          title="Contact / Connect"
          subtitle="Reach out. Collaborate. Offer support. The Codex grows through connection."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-5"
            data-netlify="true"
            name="contact"
            method="POST"
          >
            <input type="hidden" name="form-name" value="contact" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                  Name
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Subject
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] outline-none transition-colors focus:border-[#d4a853]"
              >
                <option value="">Select a subject</option>
                <option value="collaborate">Collaborate on the Codex</option>
                <option value="node">Offer a Node Activation</option>
                <option value="support">Support the Codex</option>
                <option value="scroll">Submit a Scroll</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Message
              </label>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-3 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="Your message..."
              />
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 accent-[#d4a853]"
              />
              <span className="text-xs text-[#7a7a8a]">
                Subscribe to the Codex newsletter for updates, new scrolls, and node
                activations.
              </span>
            </label>

            <div className="pt-2">
              <SacredButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </SacredButton>
            </div>
          </motion.form>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-[rgba(212,168,83,0.08)] bg-[#12141c]/60 p-5">
              <Mail className="h-4 w-4 text-[#d4a853]" />
              <h4 className="mt-2 text-xs font-medium text-[#f5f0e8]">Email</h4>
              <p className="mt-1 text-[11px] text-[#7a7a8a]">
                connect@thelivingcodex.online
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(212,168,83,0.08)] bg-[#12141c]/60 p-5">
              <MessageSquare className="h-4 w-4 text-[#d4a853]" />
              <h4 className="mt-2 text-xs font-medium text-[#f5f0e8]">Community</h4>
              <p className="mt-1 text-[11px] text-[#7a7a8a]">
                Connect through the portal and scroll submissions.
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(212,168,83,0.08)] bg-[#12141c]/60 p-5">
              <Heart className="h-4 w-4 text-[#d4a853]" />
              <h4 className="mt-2 text-xs font-medium text-[#f5f0e8]">Support</h4>
              <p className="mt-1 text-[11px] text-[#7a7a8a]">
                Patronage and contribution options coming in Phase 8.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-10">
          <DisclaimerBox>
            The Living Codex respects your privacy. Your information is not sold
            and is not used for advertising. It <em>is</em> processed on our
            behalf by our hosting provider, Netlify, which handles form
            submissions and file storage, and submission notices may be emailed
            to the Library steward so they can be reviewed. Your information is
            not shared with anyone else except where required by law. You may
            request a copy or deletion of your data at any time by writing to us
            through this page; pending sigil originals are deleted within 30 days
            of a moderation decision.
          </DisclaimerBox>
        </div>
      </div>
    </div>
  );
}
