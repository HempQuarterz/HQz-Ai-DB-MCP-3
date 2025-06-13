import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const ProductPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: ProductPaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show page 1
    pages.push(1);

    // If current page is more than 3, add ellipsis after page 1
    if (currentPage > 3) {
      pages.push("ellipsis1");
    }

    // Add preceding page if not page 1 or 2
    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }

    // Add current page if not page 1
    if (currentPage !== 1) {
      pages.push(currentPage);
    }

    // Add next page if not last page or second-to-last page
    if (currentPage < totalPages - 1) {
      pages.push(currentPage + 1);
    }

    // If current page is less than totalPages - 2, add ellipsis before last page
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis2");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex items-center justify-between" data-oid="ijy90oi">
      <div className="flex-1 flex justify-between sm:hidden" data-oid=":73fquq">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          data-oid="8bi:for"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          data-oid=".y-03qw"
        >
          Next
        </Button>
      </div>

      <div
        className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        data-oid="qg5643."
      >
        <div data-oid="wpr6p58">
          <p className="text-sm text-gray-300" data-oid="oyte9hv">
            Showing{" "}
            <span className="font-medium" data-oid="8-daaqo">
              {startItem}
            </span>{" "}
            to{" "}
            <span className="font-medium" data-oid="sk2wc:s">
              {endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium" data-oid="yd:16.s">
              {totalItems}
            </span>{" "}
            results
          </p>
        </div>

        <div data-oid="p-u4xj9">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
            data-oid="mqi.nan"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-green-500/50"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              data-oid="2lhojhp"
            >
              <span className="sr-only" data-oid="915pooh">
                Previous
              </span>
              <ChevronLeft className="h-5 w-5" data-oid="xriyltm" />
            </Button>

            {pageNumbers.map((page, index) => {
              if (page === "ellipsis1" || page === "ellipsis2") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400"
                    data-oid="g4u6ugw"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-green-500/20 border-green-400 text-green-400"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-green-500/50"
                  }`}
                  onClick={() => onPageChange(page as number)}
                  data-oid="yy0-a.7"
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-green-500/50"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              data-oid="703z7:3"
            >
              <span className="sr-only" data-oid="mxbhpf.">
                Next
              </span>
              <ChevronRight className="h-5 w-5" data-oid="pv7jk0p" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductPagination;
