import { Link } from "wouter";
import { PlantPart } from "@shared/schema";
import {
  Shirt,
  Building2,
  FileText,
  Leaf,
  Trees,
  Flower,
  FlaskConical,
} from "lucide-react";

interface PlantPartSelectorProps {
  plantParts: PlantPart[];
  activePart: number | null;
  onSelectPart: (id: number) => void;
}

const PlantPartSelector = ({
  plantParts,
  activePart,
  onSelectPart,
}: PlantPartSelectorProps) => {
  // Function to get an icon based on part name
  const getIconForPart = (partName: string) => {
    const name = partName.toLowerCase();
    if (name.includes("stalk"))
      return <Shirt className="h-6 w-6 text-primary" data-oid="8w9kl4d" />;
    if (name.includes("leaf") || name.includes("leaves"))
      return <Leaf className="h-6 w-6 text-primary" data-oid="tv_04jx" />;
    if (name.includes("seed"))
      return <FileText className="h-6 w-6 text-primary" data-oid="sc2268a" />;
    if (name.includes("flower"))
      return <Flower className="h-6 w-6 text-primary" data-oid="46n6w8r" />;
    if (name.includes("root"))
      return <Trees className="h-6 w-6 text-primary" data-oid="rq-v6x5" />;
    return <FlaskConical className="h-6 w-6 text-primary" data-oid="r02l1o-" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-oid="i6e2_d1">
      {plantParts.map((part) => (
        <Link key={part.id} href={`/plant-part/${part.id}`} data-oid="x6bkb02">
          <div
            id={part.name.toLowerCase()}
            className={`flex items-center p-4 bg-white rounded-lg border ${
              activePart === part.id
                ? "border-primary shadow-md"
                : "border-neutral-light"
            } hover:border-primary hover:shadow-md transition-all cursor-pointer`}
            onClick={(e) => {
              // Allow the link to work but also update the active part
              e.preventDefault();
              onSelectPart(part.id);
              // Then navigate programmatically if needed
            }}
            data-oid="1dgztd7"
          >
            <div
              className="bg-primary/10 rounded-full p-3 mr-4"
              data-oid="vudpfxr"
            >
              {getIconForPart(part.name)}
            </div>
            <div data-oid="i857-id">
              <h4 className="font-heading font-medium" data-oid="s9tsg3r">
                {part.name}
              </h4>
              <p className="text-sm text-neutral-dark" data-oid="ax7d9-r">
                {part.description.length > 30
                  ? part.description.substring(0, 30) + "..."
                  : part.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PlantPartSelector;
