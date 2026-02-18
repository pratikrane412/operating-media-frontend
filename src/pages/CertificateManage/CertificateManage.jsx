import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import CertificateTemplate from "../../components/CertificateTemplate/CertificateTemplate";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  RotateCcw,
  Download,
  X,
  Award,
  Plus,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import "./CertificateManage.css";
import CertificateDrawer from "../../components/CertificateDrawer/CertificateDrawer";

const CertificateManage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const componentRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Refs
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://operating-media-backend.onrender.com/api/certificates/list/",
        {
          params: { page, size: pageSize, search },
        },
      );
      setCertificates(res.data.results || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.total_count || 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search]);

  // Drag-to-scroll logic
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const stopDragging = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Note the property name change
  });

  const openPreview = (item) => {
    setSelectedCert(item);
    setIsPreviewOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCert(null);
    setIsDrawerOpen(true);
  };

  // 3. Function to open for Edit
  const handleEdit = (item) => {
    setSelectedCert(item);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        await axios.delete(
          `https://operating-media-backend.onrender.com/api/certificates/${id}/delete/`,
        );
        alert("Deleted successfully");
        fetchData(); // Refresh table
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = Math.max(1, startPage); i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div id="certificate-management-portal">
      <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />

      <main className="cert-m-viewport">
        {/* FILTERS */}
        <div className="cert-m-filter-section">
          <div className="cert-m-filter-head">
            <Filter size={16} /> <span>CERTIFICATE CONTROLS</span>
          </div>
          <div className="cert-m-filter-grid">
            <div className="cert-m-group">
              <label>QUICK SEARCH</label>
              <div className="cert-m-search-input-wrapper">
                <Search size={14} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Student name or ID..."
                />
              </div>
            </div>

            <div className="cert-m-actions">
              <button
                className="cert-m-reset"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button className="cert-m-new-btn" onClick={handleAddNew}>
                <Plus size={14} /> NEW CERTIFICATE
              </button>
            </div>
          </div>
        </div>

        {/* DATA CONTAINER */}
        <div className="cert-m-data-container">
          <div className="cert-m-toolbar">
            <div className="cert-m-entries">
              Show{" "}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setPage(1);
                }}
              >
                <option value="50">50</option>
                <option value="100">100</option>
              </select>{" "}
              entries
            </div>
            <div className="cert-m-stats">
              <Award size={16} color="#003873" />
              <span>
                Total Issued: <strong>{totalCount}</strong>
              </span>
            </div>
          </div>

          <div
            className="cert-m-table-scroll"
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
          >
            <table className="cert-m-table">
              <thead>
                <tr>
                  <th width="80">ID</th>
                  <th width="200">CERTIFICATE ID</th>
                  <th width="300">STUDENT NAME</th>
                  <th width="150">ISSUE DATE</th>
                  <th width="400">COURSE NAME</th>
                  <th width="100" className="text-center">
                    RATING
                  </th>
                  <th width="180" className="text-center">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="cert-m-loader">
                      Syncing certificate records...
                    </td>
                  </tr>
                ) : (
                  certificates.map((item) => (
                    <tr key={item.id}>
                      <td className="cert-m-txt-small">#{item.id}</td>
                      <td className="cert-m-id-bold">{item.certificate_id}</td>
                      <td className="cert-m-name-bold">{item.name}</td>
                      <td className="cert-m-txt-small">{item.date}</td>
                      <td className="cert-m-course-txt">{item.course}</td>
                      <td className="text-center">
                        <span
                          className={`cert-m-rating ${item.rating >= 9 ? "high" : ""}`}
                        >
                          {item.rating}
                        </span>
                      </td>
                      <td className="text-center">
                        <div
                          className="cert-m-action-flex"
                          ref={openMenuId === item.id ? menuRef : null}
                        >
                          {/* VIEW BUTTON */}
                          <button
                            className="cert-m-round-btn"
                            onClick={() => openPreview(item)}
                          >
                            <Eye size={16} />
                          </button>
                          {isPreviewOpen && (
                            <div className="cert-preview-modal-overlay">
                              <div className="cert-preview-modal-content">
                                <div className="modal-header">
                                  <h3>Certificate Preview</h3>
                                  <div className="header-btns">
                                    <button
                                      onClick={handlePrint}
                                      className="btn-print"
                                    >
                                      <Download size={14} /> Download PDF
                                    </button>
                                    <button
                                      onClick={() => setIsPreviewOpen(false)}
                                      className="btn-close-modal"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>
                                </div>

                                <div className="modal-body">
                                  <CertificateTemplate
                                    ref={componentRef}
                                    data={selectedCert}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* DROPDOWN BUTTON */}
                          <div className="cert-m-dropdown-rel">
                            <button
                              className={`cert-m-round-btn ${openMenuId === item.id ? "active" : ""}`}
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === item.id ? null : item.id,
                                )
                              }
                            >
                              <MoreHorizontal size={16} strokeWidth={1.5} />
                            </button>

                            {openMenuId === item.id && (
                              <div className="cert-m-dropdown-menu">
                                <button
                                  className="cert-m-drop-item"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit size={14} /> Edit Record
                                </button>
                                <div className="cert-m-drop-divider"></div>
                                <button
                                  className="cert-m-drop-item delete"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 size={14} /> Delete Record
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="cert-m-footer">
            <span className="cert-m-showing">
              Showing page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
              <span className="cert-m-sep">|</span>
              Total Certificates: <strong>{totalCount}</strong>
            </span>

            <div className="cert-m-pagination">
              <button
                className="cert-m-nav"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="cert-m-nav"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  className={`cert-m-num ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="cert-m-nav"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="cert-m-nav"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
          <CertificateDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onUpdate={fetchData}
            editData={selectedCert}
          />
        </div>
      </main>
    </div>
  );
};

export default CertificateManage;
