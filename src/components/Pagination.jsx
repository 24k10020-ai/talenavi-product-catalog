import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const handleSelectPage = (page) => {
    if (page === "..." || page === currentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pagination">
      <button
        type="button"
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => handleSelectPage(currentPage - 1)}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="page-dots">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`page-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => handleSelectPage(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => handleSelectPage(currentPage + 1)}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default Pagination;