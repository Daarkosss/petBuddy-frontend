import { useState } from 'react';
import { Form, Input, Button, GetProp, Upload, UploadProps, UploadFile, Select, Card, Space } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Header';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CaretakerForm = () => {
  const { t } = useTranslation();

  const [description, setDescription] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    city: '',
    zipCode: '',
    voivodeship: '',
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
  });

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
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

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('phoneNumber', phoneNumber);

    Object.entries(address).forEach(([key, value]) => {
      formData.append(`address[${key}]`, value);
    });

    // fileList.forEach((file, index) => {
    //   if (file.originFileObj) {
    //     formData.append(`image_${index}`, file.originFileObj);
    //   }
    // });

    // onSubmit(formData);
  };

  return (
    <div>
      <Header />
      <div className='caretaker-form-container'>
        <Form layout='vertical' onFinish={handleSubmit}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title={t('address')}>
              <div className='card-grid-row'>
                <Form.Item label={t('addressDetails.street')} name='street'>
                  <Input
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    placeholder={t('placeholder.street')}
                  />
                </Form.Item>
                <Form.Item label={t('addressDetails.buildingNumber')} name='buildingNumber'>
                  <Input
                    value={address.buildingNumber}
                    onChange={(e) => handleAddressChange('buildingNumber', e.target.value)}
                    placeholder={t('placeholder.buildingNumber')}
                  />
                </Form.Item>
                <Form.Item label={t('addressDetails.apartmentNumber')} name='apartmentNumber'>
                  <Input
                    value={address.apartmentNumber}
                    onChange={(e) => handleAddressChange('apartmentNumber', e.target.value)}
                    placeholder={t('placeholder.apartmentNumber')}
                  />
                </Form.Item>
              </div>

              <div className='card-grid-row'>
                <Form.Item label={t('addressDetails.zipCode')} name='zipCode'>
                  <Input
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    placeholder={t('placeholder.zipCode')}
                  />
                </Form.Item>
                <Form.Item label={t('addressDetails.city')} name='city'>
                  <Input
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder={t('placeholder.city')}
                  />
                </Form.Item>
                <Form.Item label={t('addressDetails.voivodeship')} name='voivodeship'>
                  <Select
                    value={address.voivodeship}
                    onChange={(value) => handleAddressChange('voivodeship', value)}
                    placeholder={t('placeholder.voivodeship')}
                  >
                    {renderSelectOptions({
                      DOLNOSLASKIE: 'Dolnośląskie',
                      KUJAWSKO_POMORSKIE: 'Kujawsko-Pomorskie',
                      LUBELSKIE: 'Lubelskie',
                      LUBUSKIE: 'Lubuskie',
                      LODZKIE: 'Łódzkie',
                      MALOPOLSKIE: 'Małopolskie',
                      MAZOWIECKIE: 'Mazowieckie',
                      OPOLSKIE: 'Opolskie',
                      PODKARPACKIE: 'Podkarpackie',
                      PODLASKIE: 'Podlaskie',
                      POMORSKIE: 'Pomorskie',
                      SLASKIE: 'Śląskie',
                      SWIETOKRZYSKIE: 'Świętokrzyskie',
                      WARMINSKO_MAZURSKIE: 'Warmińsko-Mazurskie',
                      WIELKOPOLSKIE: 'Wielkopolskie',
                      ZACHODNIOPOMORSKIE: 'Zachodniopomorskie',
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Card>

            <Card title={t('personalData.contactDetails')}>
              <Form.Item label={t('personalData.phoneNumber')} name='phoneNumber' style={{ width: '200px' }}>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t('placeholder.phoneNumber')}
                />
              </Form.Item>
            </Card>

            <Card title={t('description')}>
              <Form.Item name='description'>
                <Input.TextArea
                  autoSize={{
                    minRows: 2,
                    maxRows: 4,
                  }}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('placeholder.description')}
                />
              </Form.Item>
            </Card>

            <Card title={t('uploadImages')}>
              <Form.Item name='images'>
                <ImgCrop rotationSlider>
                  <Upload
                    listType='picture-card'
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    accept='image/*'
                  >
                    {fileList.length < 5 && `+ ${t('upload')}`}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Card>

            <Button type='primary' htmlType='submit'>
              {t('save')}
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default CaretakerForm;
