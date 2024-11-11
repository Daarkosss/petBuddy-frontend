import { GetProp, UploadFile, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const hasFilePhotoType = (file: UploadFile) => {
  const allowedFormats = [
    "image/jpeg",
    "image/webp",
    "image/png",
    "image/jpg",
  ];
  if (!file.type || !allowedFormats.includes(file.type)) {
    return false;
  }
  return true;
};

export const handleFilePreview = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as FileType);
      reader.onload = () => resolve(reader.result as string);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dummyRequest = ({ onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};