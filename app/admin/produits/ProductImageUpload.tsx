"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, Loader2 } from "lucide-react";

export default function ProductImageUpload({ initialUrl }: { initialUrl?: string }) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("Échec de l'upload. Vérifiez que le bucket product-images existe (supabase/schema.sql).");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setPreviewUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">Photo du produit</label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl bg-ds-gray border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {previewUrl ? (
            <Image src={previewUrl} alt="Aperçu" width={96} height={96} className="object-cover w-full h-full" />
          ) : (
            <ImagePlus size={24} className="text-gray-400" />
          )}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 bg-ds-gray hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
            {uploading ? "Envoi..." : previewUrl ? "Changer la photo" : "Ajouter une photo"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
          {error && <p className="text-ds-red text-xs mt-1.5">{error}</p>}
          {!previewUrl && !error && (
            <p className="text-xs text-gray-400 mt-1.5">Sans photo, une icône générique s&apos;affiche.</p>
          )}
        </div>
      </div>
      <input type="hidden" name="image_url" value={previewUrl} />
    </div>
  );
}
