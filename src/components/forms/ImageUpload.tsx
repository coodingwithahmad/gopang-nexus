"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  bucket?: string;
  folder?: string;
}

export function ImageUpload({ name, defaultValue, bucket = "media", folder = "uploads" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(defaultValue || "");
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error uploading image";
      console.error("Upload error:", err);
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to pass the URL to the parent form */}
      <input type="hidden" name={name} value={imageUrl} />

      {error && <div className="text-sm text-destructive">{error}</div>}

      {imageUrl ? (
        <div className="relative w-full max-w-sm rounded-lg border border-border overflow-hidden group">
          <div className="relative aspect-video w-full bg-muted">
            <Image 
              src={imageUrl} 
              alt="Uploaded image" 
              fill 
              className="object-cover" 
              unoptimized // since we don't know remote patterns
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="bg-destructive text-destructive-foreground p-2 rounded-full hover:scale-105 transition-transform"
              title="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full max-w-sm">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin text-muted-foreground mb-3" size={28} />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <UploadCloud className="text-muted-foreground mb-3" size={28} />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (Max 5MB)</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
