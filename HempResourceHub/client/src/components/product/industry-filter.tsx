import { Industry } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface IndustryFilterProps {
  industries: Industry[];
  selectedIndustry: number | null;
  onSelectIndustry: (id: number | null) => void;
}

const IndustryFilter = ({
  industries,
  selectedIndustry,
  onSelectIndustry,
}: IndustryFilterProps) => {
  return (
    <div className="mb-8" data-oid=":.dh0uw">
      <div className="border-b border-neutral-light" data-oid="o87d0ba">
        <nav
          className="-mb-px flex space-x-8 overflow-x-auto"
          aria-label="Tabs"
          data-oid="qfbkwc1"
        >
          <Button
            variant="link"
            className={`whitespace-nowrap py-4 px-1 border-b-2 ${
              selectedIndustry === null
                ? "border-primary text-primary"
                : "border-transparent text-neutral-medium hover:text-primary hover:border-primary"
            }`}
            onClick={() => onSelectIndustry(null)}
            data-oid="bqrx5v1"
          >
            All Industries
          </Button>

          {industries.map((industry) => (
            <Button
              key={industry.id}
              variant="link"
              className={`whitespace-nowrap py-4 px-1 border-b-2 ${
                selectedIndustry === industry.id
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-medium hover:text-primary hover:border-primary"
              }`}
              onClick={() => onSelectIndustry(industry.id)}
              data-oid="4_wv4im"
            >
              {industry.name}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default IndustryFilter;
