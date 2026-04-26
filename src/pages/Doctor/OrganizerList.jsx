import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";
import OrganizerDetailsModal from "./OrganizerDetailsModal";

const STATUS_STYLES = {
  APPROVED: "bg-success/10 text-success border border-success/20",
  PENDING:  "bg-warning/10 text-warning border border-warning/20",
  REJECTED: "bg-error/10 text-error border border-error/20",
};

const STATUS_DOT = {
  APPROVED: "bg-success",
  PENDING:  "bg-warning",
  REJECTED: "bg-error",
};

const OrganizerList = ({ organizers, setOrganizers }) => {
  const [selectedOrg, setSelectedOrg] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (!token || !userString) {
    toast.error("Please login first.");
    navigate("/login");
    return null;
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BaseUrl}/admin/delete/organizer`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id },
      });
      if (response.data.statusCode === 200) {
        toast.success("Organizer removed successfully.");
        setOrganizers((prev) => prev.filter((o) => o.id !== id));
      }
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleStatusChange = async (id, status) => {
  try {
    const res = await axios.patch(
      `${BaseUrl}/admin/organizer/update/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.statusCode === 200) {
      toast.success(status === "APPROVED" ? "Approved!" : "Rejected.");
      setOrganizers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
  } catch {
    toast.error("Action failed.");
  }
};

  if (organizers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-14 h-14 rounded-full bg-surfaceSoft border border-border flex items-center justify-center">
          <svg className="w-6 h-6 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p className="text-textMuted font-poppins text-sm">No organizers found</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop Table ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="min-w-full bg-surface font-poppins text-sm">
          <thead>
            <tr className="bg-primary text-white">
              {["#", "Organizer", "Organisation", "Status", "Approval", "Manage"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left font-medium tracking-wide text-xs uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {organizers.map((item) => (
              <tr key={item.id} className="hover:bg-surfaceSoft transition-colors duration-150 group">
                {/* # */}
                <td className="px-5 py-3.5 text-textMuted font-medium">{item.id}</td>

                {/* Organizer */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primaryLight/20 border border-primaryLight/30
                                    flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                      {item.user?.firstName?.[0]}{item.user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-mtext font-medium leading-tight">
                        {item.user?.firstName} {item.user?.lastName}
                      </p>
                      <p className="text-textMuted text-xs mt-0.5">{item.user?.email}</p>
                    </div>
                  </div>
                </td>

                {/* Organisation */}
                <td className="px-5 py-3.5 text-mtext">{item.organizationName}</td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[item.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status]}`} />
                    {item.status}
                  </span>
                </td>

                {/* Approval */}
                <td className="px-5 py-3.5">
                  {item.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(item.id, "APPROVED")}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-success/10 text-success
                                   border border-success/20 hover:bg-success hover:text-white transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, "REJECTED")}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error
                                   border border-error/20 hover:bg-error hover:text-white transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-textMuted text-xs">—</span>
                  )}
                </td>

                {/* Manage */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrg(item)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary
                                 border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error
                                 border border-error/20 hover:bg-error hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden flex flex-col gap-3 font-poppins">
        {organizers.map((item) => (
          <div key={item.id}
            className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-3">

            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primaryLight/20 border border-primaryLight/30
                                flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                  {item.user?.firstName?.[0]}{item.user?.lastName?.[0]}
                </div>
                <div>
                  <p className="text-mtext font-semibold text-sm leading-tight">
                    {item.user?.firstName} {item.user?.lastName}
                  </p>
                  <p className="text-textMuted text-xs mt-0.5">{item.user?.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLES[item.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status]}`} />
                {item.status}
              </span>
            </div>

            {/* Organisation */}
            <div className="flex items-center gap-2 text-xs text-textLight bg-surfaceSoft rounded-lg px-3 py-2">
              <svg className="w-3.5 h-3.5 text-textMuted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{item.organizationName}</span>
            </div>

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
              <button
                onClick={() => setSelectedOrg(item)}
                className="flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary
                           border border-primary/20 hover:bg-primary hover:text-white transition-colors text-center"
              >
                Details
              </button>

              {item.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleStatusChange(item.id, "APPROVED")}
                    className="flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-medium bg-success/10 text-success
                               border border-success/20 hover:bg-success hover:text-white transition-colors text-center"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, "REJECTED")}
                    className="flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-medium bg-error/10 text-error
                               border border-error/20 hover:bg-error hover:text-white transition-colors text-center"
                  >
                    Reject
                  </button>
                </>
              )}

              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-medium bg-error/10 text-error
                           border border-error/20 hover:bg-error hover:text-white transition-colors text-center"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOrg && (
        <OrganizerDetailsModal
          organizer={selectedOrg}
          onUpdate={(updated) => {
            setOrganizers((prev) =>
              prev.map((o) => (o.id === updated.id ? updated : o))
            );
            setSelectedOrg(null);
          }}
          onClose={() => setSelectedOrg(null)}
        />
      )}
    </>
  );
};

export default OrganizerList;