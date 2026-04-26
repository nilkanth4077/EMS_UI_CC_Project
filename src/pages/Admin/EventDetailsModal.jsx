import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

const STATUS_STYLES = {
  APPROVED: "bg-success/10 text-success border-success/30",
  PENDING:  "bg-warning/10 text-warning border-warning/30",
  REJECTED: "bg-error/10 text-error border-error/30",
};

const ORG_TYPE_OPTIONS = ["COLLEGE_CLUB", "STARTUP", "NGO", "INDIVIDUAL"];

const ORG_TYPE_STYLES = {
  COLLEGE_CLUB: "bg-blue/10 text-blue border-blue/30",
  STARTUP:      "bg-green/10 text-green border-green/30",
  NGO:          "bg-purple/10 text-purple border-purple/30",
  INDIVIDUAL:   "bg-gray/10 text-gray border-gray/30",
};

const Field = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-textMuted uppercase tracking-wider font-poppins">
      <span className="text-primary">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surfaceSoft text-mtext text-sm font-poppins " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-textMuted/50";

const EventDetailsModal = ({ organizer, onClose, onUpdate }) => {
  const token = localStorage.getItem("token");

  const initial = {
    firstName:        organizer?.user?.firstName    ?? "",
    lastName:         organizer?.user?.lastName     ?? "",
    email:            organizer?.user?.email        ?? "",
    organizationName: organizer?.organizationName   ?? "",
    collegeName:      organizer?.collegeName        ?? "",
    city:             organizer?.city               ?? "",
    organizerType:    organizer?.organizerType      ?? "",
    status:           organizer?.status             ?? "PENDING",
  };

  const [form, setForm]       = useState(initial);
  const [loading, setLoading] = useState(false);

  // Reset if organizer prop changes
  useEffect(() => {
    setForm(initial);
  }, [organizer]);

  if (!organizer) return null;

  const isDirty = Object.keys(initial).some((k) => form[k] !== initial[k]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    if (!isDirty) return;
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BaseUrl}/admin/organizer/update/${organizer.id}`,
        {
          firstName:        form.firstName,
          lastName:         form.lastName,
          email:            form.email,
          organizationName: form.organizationName,
          collegeName:      form.collegeName,
          city:             form.city,
          organizerType:    form.organizerType,
          status:           form.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.statusCode === 200) {
        toast.success("Organizer updated successfully.");
        onUpdate?.({ ...organizer, ...form, user: { ...organizer.user, firstName: form.firstName, lastName: form.lastName, email: form.email } });
        onClose();
      }
    } catch {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-border font-poppins
                      flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surfaceSoft rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20
                            flex items-center justify-center text-primary font-semibold text-sm">
              {form.firstName?.[0]}{form.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-mtext font-semibold text-sm leading-tight">
                {form.firstName} {form.lastName}
              </h2>
              <p className="text-textMuted text-xs">{form.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs text-warning bg-warning/10 border border-warning/20
                               px-2 py-0.5 rounded-full animate-pulse">
                Unsaved changes
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-textMuted
                         hover:bg-border hover:text-mtext transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto no-scrollbar px-6 py-5 space-y-4">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            }>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={inputCls}
                placeholder="First name"
              />
            </Field>

            <Field label="Last Name" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            }>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={inputCls}
                placeholder="Last name"
              />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          }>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputCls}
              placeholder="Email address"
            />
          </Field>

          {/* Organization */}
          <Field label="Organization" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          }>
            <input
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              className={inputCls}
              placeholder="Organization name"
            />
          </Field>

          {/* College & City */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="College" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            }>
              <input
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
                className={inputCls}
                placeholder="College name"
              />
            </Field>

            <Field label="City" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            }>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputCls}
                placeholder="City"
              />
            </Field>
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Organizer Type" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            }>
              <select
                name="organizerType"
                value={form.organizerType}
                onChange={handleChange}
                className={`${inputCls} ${ORG_TYPE_STYLES[form.organizerType]} cursor-pointer`}
              >
               {ORG_TYPE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Status" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`${inputCls} ${STATUS_STYLES[form.status]} cursor-pointer`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Changed fields hint */}
          {isDirty && (
            <div className="rounded-lg bg-primary/5 border border-primary/15 px-3.5 py-2.5 text-xs text-primary space-y-1">
              <p className="font-medium">Changed fields:</p>
              <p className="text-textMuted leading-relaxed">
                {Object.keys(initial)
                  .filter((k) => form[k] !== initial[k])
                  .map((k) => k.replace(/([A-Z])/g, " $1").trim())
                  .join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-border bg-surfaceSoft rounded-b-2xl flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setForm(initial)}
            disabled={!isDirty}
            className="text-xs text-textMuted hover:text-mtext disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Reset changes
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-textLight border border-border
                         hover:bg-border transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={!isDirty || loading}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-primary
                         hover:bg-primaryDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                         flex items-center gap-2 min-w-[100px] justify-center"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;