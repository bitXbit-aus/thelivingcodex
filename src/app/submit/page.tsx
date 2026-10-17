"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SacredButton from "@/components/SacredButton";
import SectionIntro from "@/components/SectionIntro";
import DisclaimerBox from "@/components/DisclaimerBox";
import { categories } from "@/data/scrolls";
import { CheckCircle, Send, Feather } from "lucide-react";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    title: "",
    category: categories[0],
    frequency: "",
    content: "",
    crystal: "",
    element: "",
    ally: "",
    privacy: "public",
    consent: false,
    futureArchive: false,
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
            Your scroll has entered the field.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#7a7a8a]">
            Thank you for adding your remembrance to The Living Codex. Your words
            are now part of the morphic resonance chamber. They will be reviewed
            for the public archive according to your chosen settings.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SacredButton href="/scrolls/" variant="primary" size="md">
              Explore Scrolls
            </SacredButton>
            <SacredButton href="/portal/" variant="outline" size="md">
              Return to Portal
            </SacredButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionIntro
          title="Submit a Scroll"
          subtitle="Your remembrance, declaration, ceremony, dream, or transmission. Cast it into the field."
        />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
          data-netlify="true"
          name="scroll-submission"
          method="POST"
        >
          <input type="hidden" name="form-name" value="scroll-submission" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Name or Soul Name *
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="How you wish to be known"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="For follow-up only"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Location (optional)
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Scroll Title *
              </label>
              <input
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="The title of your scroll"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] outline-none transition-colors focus:border-[#d4a853]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Frequency Tag (optional)
              </label>
              <input
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="e.g. 528 Hz"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Element (optional)
              </label>
              <select
                name="element"
                value={form.element}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] outline-none transition-colors focus:border-[#d4a853]"
              >
                <option value="">Select element</option>
                <option value="Earth">Earth</option>
                <option value="Water">Water</option>
                <option value="Fire">Fire</option>
                <option value="Air">Air</option>
                <option value="Aether">Aether</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
              Written Remembrance *
            </label>
            <textarea
              required
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={8}
              className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-3 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
              placeholder="Write your scroll here... invocation, declaration, ceremony report, dream, light language, healing protocol, or prayer."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Crystal Ally (optional)
              </label>
              <input
                name="crystal"
                value={form.crystal}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="e.g. Clear Quartz"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Plant / Animal / Element Ally (optional)
              </label>
              <input
                name="ally"
                value={form.ally}
                onChange={handleChange}
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
                placeholder="e.g. Oak, Wolf, Rain"
              />
            </div>
          </div>

          {/* Privacy options */}
          <div className="rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4 space-y-3">
            <p className="text-[10px] tracking-widest uppercase text-[#d4a853]">
              Visibility
            </p>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={form.privacy === "public"}
                onChange={handleChange}
                className="h-4 w-4 accent-[#d4a853]"
              />
              <span className="text-xs text-[#c8c4b8]">
                I wish this to be considered for public archive
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={form.privacy === "private"}
                onChange={handleChange}
                className="h-4 w-4 accent-[#d4a853]"
              />
              <span className="text-xs text-[#c8c4b8]">
                I wish this to be private
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="futureArchive"
                checked={form.futureArchive}
                onChange={handleChange}
                className="h-4 w-4 accent-[#d4a853]"
              />
              <span className="text-xs text-[#c8c4b8]">
                I wish this to be permanently stored in the future archive (Arweave)
              </span>
            </label>
          </div>

          {/* Consent */}
          <div>
            <label className="flex items-start gap-3">
              <input
                required
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 accent-[#d4a853]"
              />
              <span className="text-xs leading-relaxed text-[#7a7a8a]">
                I confirm that this submission is my own work or that I have permission
                to share it. I understand that public submissions may be featured in the
                Living Codex archive. I consent to the processing of this information in
                accordance with the Codex privacy practices.
              </span>
            </label>
          </div>

          <DisclaimerBox>
            Submissions are moderated before appearing in the public archive. The Living
            Codex reserves the right to decline submissions that violate natural law,
            promote harm, or do not align with the field's intention.
          </DisclaimerBox>

          <div className="pt-2">
            <SacredButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              Cast Into the Field
            </SacredButton>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
