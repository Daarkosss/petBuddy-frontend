import { useEffect, useState } from "react";
import { 
  Form, Input, Button, GetProp, Upload, UploadProps, UploadFile, Select, Card, Space, Alert, Skeleton,
  Spin
} from "antd";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { api } from "../api/api";
import { CaretakerDetailsDTO, CaretakerFormFields, Photo, UploadFileWithBlob } from "../types";
import Voivodeship from "../models/Voivodeship";
import store from "../store/RootStore";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const PHOTOS_LIMIT = 10;

const CaretakerForm = () => {
  const { t } = useTranslation();
  const [currentOfferPhotos, setCurrentOfferPhotos] = useState<UploadFileWithBlob[]>([]);
  const [newOfferPhotos, setNewOfferPhotos] = useState<UploadFile[]>([]);
  const [form] = Form.useForm<CaretakerFormFields>();
  const [isStarting, setIsStarting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const allowedSpecialKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
  
  useEffect(() => {
    if (store.user.profile?.email && store.user.profile?.hasCaretakerProfile) {
      api.getCurrentCaretakerDetails().then((data) => {
        form.setFieldsValue(data);
      })
    }
    setIsPhotosLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const updateCaretakerData = (data: CaretakerDetails) => {
    form.setFieldsValue(data);
    const initialPhotos: UploadFileWithBlob[] = data.offerPhotos.map((photo: Photo, index: number) => ({
      file: {
        uid: index.toString(),
        name: `Photo_${index + 1}`,
        status: "done",
        url: photo.url,
        thumbUrl: photo.url,
      },
      blob: photo.blob
    }));
    
    setCurrentOfferPhotos(initialPhotos);
    setNewOfferPhotos([]);
  }

  const handleNewPhoto: UploadProps["onChange"] = ({ fileList }) => {
    if (hasFilePhotoType(fileList[fileList.length - 1])) { // Check last added photo
      setNewOfferPhotos(fileList);
    } else {
      toast.error(t("error.wrongFileTypeForPhoto"));
    }
  };

  const handleFilePreview = async (file: UploadFile) => {
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

  const handleRemoveCurrentPhoto = (file: UploadFile) => {
    const updatedPhotos = currentOfferPhotos.filter((photo) => photo.file.uid !== file.uid);
    setCurrentOfferPhotos(updatedPhotos);
  };

  const renderSelectOptions = (options: Record<string, string>) => (
    Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ))
  );

  const handleZipCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDownForNumeric(e);

    const zipCode = form.getFieldValue(["address", "zipCode"]);
    if (zipCode && zipCode.length === 2 && !allowedSpecialKeys.includes(e.key)) {
      form.setFieldsValue({
        address: {
          ...form.getFieldValue("address"),
          zipCode: `${zipCode}-`,
        },
      });
    }
  };

  const handleKeyDownForNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    const isDigit = /[0-9]/.test(char);
    if (!isDigit && !allowedSpecialKeys.includes(char)) {
      e.preventDefault();
    }
  }

  const handleAddCaretaker = async (data: CaretakerFormFields) => {
    setIsLoading(true);
    try {
      await api.addCaretakerProfile(data, newOfferPhotos);
      toast.success(t("success.createCaretakerProfile"));
      store.user.hasCaretakerProfile = true;
      store.user.setSelectedProfile("CARETAKER");
      store.user.saveProfileToStorage(store.user.profile);
    } catch (error) {
      toast.error(t("error.createCaretakerProfile"));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditCaretaker = async (data: CaretakerFormFields) => {
    setIsLoading(true);
    try {
      const response = await api.editCaretakerProfile(
        data,
        newOfferPhotos, 
        currentOfferPhotos.map((photo) => photo.blob)
      );
      if (response) {
        updateCaretakerData(response);
      }
      toast.success(t("success.editCaretakerForm"));
    } catch (error) {
      toast.error(t("error.editCaretakerForm"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const formFields = form.getFieldsValue();
    if (store.user.profile?.hasCaretakerProfile) {
      handleEditCaretaker(formFields);
    } else {
      handleAddCaretaker(formFields);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const hasFilePhotoType = (file: UploadFile) => {
    const allowedFormats = ["image/jpeg", "image/webp", "image/png", "image/jpg"];
    console.log(file);
    if (!file.type || !allowedFormats.includes(file.type)) {
      return false;
    }
    return true;
  }

  return (
      <div className="caretaker-form-container">
        <Spin size="large" spinning={isStarting}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} onLoad={() => setIsStarting(false)}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Card title={t("address")}>
                <div className="card-grid-row">
                  <Form.Item
                    label={t("addressDetails.street")}
                    name={["address", "street"]}
                    rules={[{ required: true, message: t("validation.required") }]}
                  >
                    <Input
                      maxLength={150}
                      placeholder={t("placeholder.street")}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("addressDetails.streetNumber")}
                    name={["address", "streetNumber"]}
                    rules={[{ required: true, message: t("validation.required") }]}
                  >
                    <Input
                      maxLength={10}
                      placeholder={t("placeholder.streetNumber")}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("addressDetails.apartmentNumber")}
                    name={["address", "apartmentNumber"]}
                  >
                    <Input
                      maxLength={10}
                      placeholder={t("placeholder.apartmentNumber")}
                    />
                  </Form.Item>
                </div>

                <div className="card-grid-row">
                  <Form.Item
                    label={t("addressDetails.zipCode")}
                    name={["address", "zipCode"]}
                    rules={[
                      { required: true, message: t("validation.required") },
                      { pattern: /^[0-9]{2}-[0-9]{3}$/, message: t("validation.zipCodeFormat") }
                    ]}
                  >
                    <Input
                      maxLength={6}
                      onKeyDown={handleZipCodeKeyDown}
                      placeholder={t("placeholder.zipCode")}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("addressDetails.city")}
                    name={["address", "city"]}
                    rules={[{ required: true, message: t("validation.required") }]}
                  >
                    <Input
                      maxLength={50}
                      placeholder={t("placeholder.city")}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("addressDetails.voivodeship")}
                    name={["address", "voivodeship"]}
                    rules={[{ required: true, message: t("validation.required") }]}
                  >
                    <Select placeholder={t("placeholder.voivodeship")}>
                      {renderSelectOptions(Voivodeship.voivodeshipMap)}
                    </Select>
                  </Form.Item>
                </div>
              </Card>

              <Card title={t("personalData.contactDetails")}>
                <Form.Item
                  label={t("personalData.phoneNumber")}
                  name="phoneNumber"
                  rules={[
                    { required: true, message: t("validation.required") },
                    { pattern: /^([0-9]){9,14}$/, message: t("validation.phoneNumberFormat") },
                  ]}
                  style={{ width: "200px" }}
                >
                  <Input
                    maxLength={14}
                    placeholder={t("placeholder.phoneNumber")}
                    onKeyDown={handleKeyDownForNumeric}
                    addonBefore="+48"
                  />
                </Form.Item>
              </Card>

              <Card title={t("description")}>
                <Form.Item name="description">
                  <Input.TextArea
                    showCount
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    maxLength={1500}
                    placeholder={t("placeholder.description")}
                  />
                </Form.Item>
              </Card>

              <Card title={t("offerPhotos")}>
                <Skeleton loading={isPhotosLoading} paragraph={{ rows: 2 }}>
                  <Form.Item name="offerPhotos" label={t("currentPhotos")} hidden={currentOfferPhotos.length === 0}>
                    <Upload
                      listType="picture-card"
                      fileList={currentOfferPhotos.map((photo) => (photo.file))}
                      onRemove={handleRemoveCurrentPhoto}
                      onPreview={handleFilePreview}
                    />
                  </Form.Item>
                </Skeleton>
                <Form.Item 
                  name="newOfferPhotos"
                  label={t("newPhotos")} 
                  hidden={currentOfferPhotos.length >= PHOTOS_LIMIT}
                >
                  <ImgCrop 
                    beforeCrop={hasFilePhotoType}
                    rotationSlider
                    modalTitle={t("imageCropperTitle")}
                    modalOk={t("apply")}
                    modalCancel={t("cancel")}
                  >
                    <Upload
                      customRequest={dummyRequest}
                      listType="picture-card"
                      fileList={newOfferPhotos}
                      onChange={handleNewPhoto}
                      onPreview={handleFilePreview}
                      accept="image/*"
                    >
                      {currentOfferPhotos.length + newOfferPhotos.length < PHOTOS_LIMIT && `+ ${t("upload")}`}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
                {currentOfferPhotos.length + newOfferPhotos.length >= PHOTOS_LIMIT &&
                  <Alert
                    type="warning"
                    showIcon
                    message={t("photosLimitMessage")}
                    description={t("photosLimitDescription")}
                  />
                }
              </Card>
              <Button type="primary" htmlType="submit" className="submit-button" loading={isLoading}>
                {t("save")}
              </Button>
            </Space>
          </Form>
        </Spin>
      </div>
  );
};

export default CaretakerForm;
