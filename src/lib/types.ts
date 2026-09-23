export type Photo = {
  id: string;
  storage_path: string;
  url: string;
  owner_device_id: string;
  owner_name: string;
  owner_color: string;
  created_at: string;
  likes_count: number;
  liked_by_me: boolean;
};

export type PhotosResponse = {
  photos: Photo[];
};
