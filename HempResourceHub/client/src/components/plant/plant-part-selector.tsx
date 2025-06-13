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
      return <Shirt className="h-6 w-6 text-green-400" data-oid="qfq:gj8" />;
    if (name.includes("leaf") || name.includes("leaves"))
      return <Leaf className="h-6 w-6 text-green-400" data-oid="qfter75" />;
    if (name.includes("seed"))
      return <FileText className="h-6 w-6 text-green-400" data-oid="1rn-gmi" />;
    if (name.includes("flower"))
      return <Flower className="h-6 w-6 text-green-400" data-oid="6j-sxre" />;
    if (name.includes("root"))
      return <Trees className="h-6 w-6 text-green-400" data-oid="dpihad0" />;
    return <FlaskConical className="h-6 w-6 text-green-400" data-oid="58zo7o4" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-oid="cuq_u3l">
      {plantParts.map((part) => (
        <Link key={part.id} href={`/plant-part/${part.id}`} data-oid="gexpb6f">
          <div
            id={part.name.toLowerCase()}
            className={`flex items-center p-4 bg-gray-800 rounded-lg border ${
              activePart === part.id
                ? "border-green-400 shadow-lg shadow-green-500/20"
                : "border-gray-700"
            } hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer`}
            onClick={(e) => {
              // Allow the link to work but also update the active part
              e.preventDefault();
              onSelectPart(part.id);
              // Then navigate programmatically if needed
            }}
            data-oid="ujf69x1"
          >
            <div
              className="bg-green-500/10 rounded-full p-3 mr-4"
              data-oid="rmypw3z"
            >
              {getIconForPart(part.name)}
            </div>
            <div data-oid="oqdtcuc">
              <h4 className="font-heading font-medium text-gray-100" data-oid="s9a.jow">
                {part.name}
              </h4>
              <p className="text-sm text-gray-400" data-oid="ljf:j5m">
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
