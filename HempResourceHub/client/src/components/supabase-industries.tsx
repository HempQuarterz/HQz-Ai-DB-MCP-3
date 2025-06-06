import React, { useState, useEffect } from "react";
import supabase from "../lib/supabase-client";
import { Industry } from "../types/schema";

export default function SupabaseIndustries() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIndustries() {
      try {
        const { data, error } = await supabase
          .from("industries")
          .select("*")
          .order("name");

        if (error) throw error;

        setIndustries(data || []);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching industries:", err);
        setError(err.message || "Failed to fetch industries");
        setLoading(false);
      }
    }

    fetchIndustries();
  }, []);

  return (
    <div
      className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md"
      data-oid="v8jr0sd"
    >
      <h2 className="text-2xl font-bold mb-4" data-oid="33l:pw_">
        Industries from Supabase
      </h2>

      {loading && (
        <p className="text-gray-500" data-oid="qa8.w4c">
          Loading industries...
        </p>
      )}

      {error && (
        <div
          className="p-4 bg-red-50 text-red-700 rounded-md mb-4"
          data-oid="wvnpvoz"
        >
          <p className="font-bold" data-oid="bf8p8gr">
            Error:
          </p>
          <p data-oid="ltpnn.v">{error}</p>
        </div>
      )}

      {!loading && !error && industries.length === 0 && (
        <p className="text-gray-500" data-oid="f424nhd">
          No industries found. Please create some in your Supabase database.
        </p>
      )}

      {industries.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-oid="-hor36c"
        >
          {industries.map((industry) => (
            <div
              key={industry.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              data-oid="p180cck"
            >
              <h3 className="text-lg font-semibold" data-oid="xkv13wf">
                {industry.name}
              </h3>
              {industry.description && (
                <p className="text-sm text-gray-600 mt-1" data-oid="uwyfb6u">
                  {industry.description}
                </p>
              )}
              {industry.icon_name && (
                <p className="text-xs text-gray-500 mt-2" data-oid="_khyxq3">
                  Icon: {industry.icon_name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t" data-oid="n6._:nv">
        <h3 className="text-lg font-semibold mb-2" data-oid="o0sx1h0">
          Add New Industry
        </h3>
        <form
          className="flex flex-col md:flex-row gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const description = formData.get("description") as string;
            const icon_name = formData.get("icon_name") as string;

            if (!name) return;

            try {
              setLoading(true);
              const { error } = await supabase
                .from("industries")
                .insert([{ name, description, icon_name }]);

              if (error) throw error;

              // Refetch the industries
              const { data, error: fetchError } = await supabase
                .from("industries")
                .select("*")
                .order("name");

              if (fetchError) throw fetchError;

              setIndustries(data || []);

              // Reset the form
              e.currentTarget.reset();
            } catch (err: any) {
              console.error("Error adding industry:", err);
              setError(err.message || "Failed to add industry");
            } finally {
              setLoading(false);
            }
          }}
          data-oid="539a.nv"
        >
          <input
            type="text"
            name="name"
            placeholder="Industry Name"
            className="flex-1 px-3 py-2 border rounded"
            required
            data-oid="h8:jt7y"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            className="flex-1 px-3 py-2 border rounded"
            data-oid="p:54uad"
          />

          <input
            type="text"
            name="icon_name"
            placeholder="Icon Name"
            className="flex-1 px-3 py-2 border rounded"
            data-oid="o24olrp"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
            data-oid="3-l6ovd"
          >
            {loading ? "Adding..." : "Add Industry"}
          </button>
        </form>
      </div>
    </div>
  );
}
