import React from "react";
import { Icon, Uploader } from "rsuite";
import { FileType } from "rsuite/lib/Uploader";
import { PostImage } from "../../types/Post";

interface ImageUploaderProps {
  list: FileType[];
  onChange: (list: FileType[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  list,
  onChange,
}) => {
  return (
    <Uploader
      multiple
      listType="picture"
      fileList={list}
      autoUpload={false}
      onChange={onChange}
    >
      <button type="button">
        <Icon icon="camera-retro" size="lg" />
      </button>
    </Uploader>
  );
};
