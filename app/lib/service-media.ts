import { type Service, type ServiceMedia } from "./services";
import { getStorageMedia } from "./storage-media";

export async function getServiceMedia(service: Service): Promise<ServiceMedia[]> {
  const media = await getStorageMedia(service.mediaFolder);

  if (media.length === 0) {
    return service.fallbackMedia;
  }

  return media.map((mediaItem): ServiceMedia => ({
    ...mediaItem,
    alt:
      mediaItem.type === "image"
        ? `${service.alt} - ${mediaItem.title}`
        : undefined,
  }));
}
