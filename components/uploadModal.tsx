"use client";
import uniqid from "uniqid";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/types_db"; // This is the file you shared

// Remove this manual interface! It is no longer needed.
// interface DatabaseSong {
//   id: string;
//   user_id: string;
//   title: string;
//   author: string;
//   song_path: string | null;
//   song_url: string | null;
//   image_path: string;
//   created_at: string;
// }

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  // STEP 1: Tell useSupabaseClient to use your generated Database type
  const supabaseClient = useSupabaseClient<Database>();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      songUrl: "",
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
  try {
    setIsLoading(true);

    if (!user) {
      toast.error("You must be logged in to upload.");
      return;
    }

    const uniqueID = uniqid(); // This unique ID is still useful for file names
    const imageFile = values.image?.[0];
    const songFile = values.song?.[0];
    const songUrl: string | null = values.songUrl || null;

    if (!imageFile) {
      toast.error("Please select an image.");
      return;
    }

    if (!songFile && !songUrl) {
      toast.error("Please provide either an MP3 file or a song URL.");
      return;
    }

    // Upload MP3 file
    let songPath: string | null = null;
    if (songFile) {
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${uniqueID}.mp3`, songFile, { cacheControl: "3600", upsert: false });

      if (songError) {
        console.error("Song upload error:", songError);
        toast.error("Failed to upload song file.");
        return;
      }

      songPath = songData.path;
    }

    // Upload image
    const { data: imageData, error: imageError } = await supabaseClient.storage
      .from("images")
      .upload(`image-${uniqueID}.png`, imageFile, { cacheControl: "3600", upsert: false });

    if (imageError) {
      console.error("Image upload error:", imageError);
      toast.error("Failed to upload image.");
      return;
    }

    const imagePath = imageData.path;

    // The single, correct change is here:
    const { error: dbError } = await supabaseClient
      .from("songs")
      .insert({
        // REMOVED: id: Number(uniqueID),
        user_id: user.id,
        title: String(values.title),
        author: String(values.author),
        song_path: songPath,
        song_url: songUrl,
        image_path: imagePath,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Database insert error:", dbError.message);
      toast.error("Failed to save song in database.");
      return;
    }

    toast.success("Song uploaded successfully!");
    reset();
    uploadModal.onClose();
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Modal
      title="Add a song"
      description="Upload an MP3 file or paste a song URL"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />

        <div>
          <div className="pb-1">Select an MP3 file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song")}
          />
        </div>

        <div>
          <div className="pb-1">Or paste a song URL</div>
          <Input
            id="songUrl"
            disabled={isLoading}
            {...register("songUrl")}
            placeholder="https://example.com/song.mp3"
          />
        </div>

        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>

        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;