import { createClient } from "@supabase/supabase-js";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov"]);

export type StorageMedia = {
  type: "image" | "video";
  src: string;
  title: string;
};

function getExtension(filename: string) {
  const extension = filename.split(".").pop();
  return extension ? extension.toLowerCase() : "";
}

function getMediaType(filename: string): StorageMedia["type"] | null {
  const extension = getExtension(filename);

  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }

  return null;
}

function getMediaTitle(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_\s]+/, "")
    .replace(/[-_]+/g, " ");
}

export async function getStorageMedia(folderPath: string): Promise<StorageMedia[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceBucket = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_BUCKET;

  if (!supabaseUrl || !supabaseAnonKey || !serviceBucket) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data, error } = await supabase.storage
    .from(serviceBucket)
    .list(folderPath, {
      limit: 100,
      sortBy: {
        column: "name",
        order: "asc",
      },
    });

  if (error || !data) {
    return [];
  }

  return data
    .filter((file) => file.name && !file.name.startsWith("."))
    .sort((first, second) =>
      first.name.localeCompare(second.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    )
    .map((file): StorageMedia | null => {
      const type = getMediaType(file.name);

      if (!type) {
        return null;
      }

      const filePath = `${folderPath}/${file.name}`;
      const { data: publicUrlData } = supabase.storage
        .from(serviceBucket)
        .getPublicUrl(filePath);

      return {
        type,
        src: publicUrlData.publicUrl,
        title: getMediaTitle(file.name),
      };
    })
    .filter((mediaItem): mediaItem is StorageMedia => mediaItem !== null);
}
