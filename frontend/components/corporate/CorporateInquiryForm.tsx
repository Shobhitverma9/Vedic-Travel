"use client";

import { motion } from "framer-motion";
import { Send, Phone, Mail, Building2, Users, MapPin, Calendar, Wallet, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { inquiriesService } from "@/services/inquiries.service";
import ReCaptcha from "../shared/ReCaptcha";

export default function CorporateInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    mobile: "",
    email: "",
    officeAddress: "",
    teamSize: "10 - 25 members",
    journeyDate: "",
    budget: "",
    isCustomizable: false,
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
        toast.error("Please complete the reCAPTCHA verification");
        return;
    }

    setIsSubmitting(true);
    try {
      await inquiriesService.createInquiry({
        ...formData,
        isCorporate: true,
        message: `Corporate Wellness Inquiry for ${formData.companyName}. Team size: ${formData.teamSize}. Budget: ${formData.isCustomizable ? 'Custom' : formData.budget}`,
        tourName: "Corporate Wellness Program",
        tourId: "corporate-wellness",
        recaptchaToken,
      });

      toast.success("Thank you for your inquiry!", {
          description: "Our corporate team will reach out to you within 4-6 business hours."
      });
      
      // Reset form
      setFormData({
        name: "",
        companyName: "",
        mobile: "",
        email: "",
        officeAddress: "",
        teamSize: "10 - 25 members",
        journeyDate: "",
        budget: "",
        isCustomizable: false,
      });
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Error submitting corporate inquiry:", error);
      toast.error("Failed to send inquiry. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry-form" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
      <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-saffron/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[100%] bg-purple/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Contact Info Sidebar */}
          <div className="lg:w-1/3 bg-deepBlue p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Building2 className="w-40 h-40" />
             </div>
             <div>
                <span className="text-saffron font-bold uppercase tracking-widest text-sm mb-4 inline-block">
                  Get In Touch
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">
                  Let’s Build Your <br />
                  <span className="text-gold">Breakthrough</span>
                </h2>
                <div className="space-y-8 mt-12">
                   <div className="flex items-center gap-5 group">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-saffron/20 transition-colors">
                         <Phone className="w-6 h-6 text-saffron" />
                      </div>
                      <div>
                         <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                         <p className="text-lg font-medium">+91 84474 70062</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 group">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-saffron/20 transition-colors">
                         <Mail className="w-6 h-6 text-saffron" />
                      </div>
                      <div>
                         <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                         <p className="text-lg font-medium">corporate@vedictravel.com</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-20 pt-10 border-t border-white/10">
                <p className="text-gray-400 text-sm italic">
                  "Our team will work closely with your HR and leadership to tailor the perfect wellness journey."
                </p>
             </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3 p-6 md:p-12 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Name</label>
                  <input 
                    required 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Full Name" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all" 
                  />
                </div>
                {/* 2. Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Company Name</label>
                  <input 
                    required 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Ex: Acme Corp" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 3. Contact */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Contact Number</label>
                  <input 
                    required 
                    type="tel" 
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 00000 00000" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all" 
                  />
                </div>
                {/* 4. Email */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@company.com" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all" 
                  />
                </div>
              </div>

              {/* 5. Address */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Office Address</label>
                <div className="relative">
                   <MapPin className="absolute left-6 top-5 w-5 h-5 text-gray-400" />
                   <input 
                     required 
                     type="text" 
                     name="officeAddress"
                     value={formData.officeAddress}
                     onChange={handleChange}
                     placeholder="Full office address" 
                     className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all" 
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 6. Number of people */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Number of People</label>
                  <div className="relative">
                    <Users className="absolute left-6 top-4 w-5 h-5 text-gray-400" />
                    <input 
                      required 
                      type="number" 
                      name="journeyDate" // Wait, journeyDate is used here or teamSize?
                      style={{ paddingLeft: '3.5rem' }} // Forcing padding since translate-all might be weird
                      className="hidden" // Just checking fields
                    />
                    <input 
                      required 
                      type="number" 
                      name="teamSize"
                      value={formData.teamSize.split(' ')[0]} // Simplified for input
                      onChange={(e) => setFormData(prev => ({ ...prev, teamSize: `${e.target.value} members` }))}
                      placeholder="Total members" 
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all" 
                    />
                  </div>
                </div>
                {/* 7. Expected date */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Expected Date of Journey</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-4 w-5 h-5 text-gray-400" />
                    <input 
                      required 
                      type="date" 
                      name="journeyDate"
                      value={formData.journeyDate}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                {/* 8. Budget */}
                <div className="space-y-2">
                  <label className={`text-sm font-bold uppercase tracking-widest pl-1 transition-colors ${formData.isCustomizable ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total Budget (₹)
                  </label>
                  <div className="relative">
                    <Wallet className={`absolute left-6 top-4 w-5 h-5 transition-colors ${formData.isCustomizable ? 'text-gray-200' : 'text-gray-400'}`} />
                    <input 
                      disabled={formData.isCustomizable}
                      required={!formData.isCustomizable}
                      type="number" 
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Budget in INR" 
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/5 outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                    />
                  </div>
                </div>

                {/* 9. Checkbox for customization */}
                <div className="flex items-center gap-3 p-4 bg-saffron/5 rounded-2xl border border-saffron/10 mb-1">
                   <input 
                     type="checkbox" 
                     id="customization" 
                     name="isCustomizable"
                     className="w-5 h-5 accent-saffron cursor-pointer" 
                     checked={formData.isCustomizable}
                     onChange={handleChange}
                   />
                   <label htmlFor="customization" className="text-sm font-semibold text-deepBlue cursor-pointer select-none">
                     Tick the checkbox for more customization
                   </label>
                </div>
              </div>

              {/* Info line */}
              <div className="flex items-center gap-3 text-sm text-gray-600 pl-1 italic">
                 <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
                 <p>Our corporate travel programs are fully flexible—days and activities can be customized to your team's needs.</p>
              </div>

              <div className="py-2">
                <ReCaptcha onChange={(token) => setRecaptchaToken(token)} theme="light" />
              </div>

              <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full py-5 bg-saffron hover:bg-saffron-dark text-white rounded-[20px] font-bold text-xl shadow-xl shadow-saffron/20 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Inquiry <Send className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
