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
    <div className="mt-8 flex items-center justify-between" data-oid="4g_6gun">
      <div className="flex-1 flex justify-between sm:hidden" data-oid="83qu421">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          data-oid="8.:.b13"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          data-oid="l9r9sho"
        >
          Next
        </Button>
      </div>

      <div
        className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        data-oid="-gxgi:t"
      >
        <div data-oid="yymer6w">
          <p className="text-sm text-neutral-dark" data-oid="i.89_pf">
            Showing{" "}
            <span className="font-medium" data-oid=".nsehn3">
              {startItem}
            </span>{" "}
            to{" "}
            <span className="font-medium" data-oid="u8kkp8y">
              {endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium" data-oid=":co3qwu">
              {totalItems}
            </span>{" "}
            results
          </p>
        </div>

        <div data-oid="hxpyk.b">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
            data-oid="cn-a35:"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-light bg-white text-sm font-medium text-neutral-dark hover:bg-neutral-lightest"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              data-oid="9-r-5j0"
            >
              <span className="sr-only" data-oid="m4fc0x0">
                Previous
              </span>
              <ChevronLeft className="h-5 w-5" data-oid=".8r8co_" />
            </Button>

            {pageNumbers.map((page, index) => {
              if (page === "ellipsis1" || page === "ellipsis2") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-neutral-light bg-white text-sm font-medium text-neutral-dark"
                    data-oid="fdn8jej"
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
                      ? "z-10 bg-primary/5 border-primary text-primary"
                      : "bg-white border-neutral-light text-neutral-dark hover:bg-neutral-lightest"
                  }`}
                  onClick={() => onPageChange(page as number)}
                  data-oid="ld.0l6z"
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-light bg-white text-sm font-medium text-neutral-dark hover:bg-neutral-lightest"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              data-oid=":a7t6_j"
            >
              <span className="sr-only" data-oid="w6a-ckn">
                Next
              </span>
              <ChevronRight className="h-5 w-5" data-oid="gp0lnd3" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductPagination;
