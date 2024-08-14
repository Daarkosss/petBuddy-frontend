import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Header';
import DatePicker, { Value } from 'react-multi-date-picker';
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";

interface CaregiverFormProps {
  onSubmit: (formData: FormData) => void;
}

const CaretakerForm: React.FC<CaregiverFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();

  const [location, setLocation] = useState('');
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<Value[][]>();
  const [images, setImages] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleAnimalTypeChange = (type: string) => {
    if (animalTypes.includes(type)) {
      setAnimalTypes(animalTypes.filter((t) => t !== type));
    } else {
      setAnimalTypes([...animalTypes, type]);
    }
  };

  const handlePriceChange = (type: string, price: string) => {
    if (/^\d*\.?\d{0,2}$/.test(price) || price === '') {
      setPrices({ ...prices, [type]: price });
    }
  };

  const validatePrices = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    animalTypes.forEach((type) => {
      if (!prices[type] || !/^\d+(\.\d{1,2})?$/.test(prices[type])) {
        isValid = false;
        newErrors[type] = t('caretakerForm.invalidPrice');
      }
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePrices()) {
      const formData = new FormData();
      formData.append('location', location);
      formData.append('description', description);

      animalTypes.forEach((type) => {
        formData.append('animalTypes', type);
        formData.append(`price_${type}`, prices[type]);
      });

      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      onSubmit(formData);
    }
  };

  return (
    <div>
      <Header />
      <div className='caretaker-form-container'>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='location' className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.location')}</Form.Label>
            <Form.Control
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('caretakerForm.enterCity')}
              className='form-control'
            />
          </Form.Group>

          <Form.Group className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.animalTypes')}</Form.Label>
            <div className='animal-type'>
              <Form.Check
                type='checkbox'
                label={t('caretakerForm.smallDog')}
                onChange={() => handleAnimalTypeChange('smallDog')}
                checked={animalTypes.includes('smallDog')}
                className='form-check'
              />
              {animalTypes.includes('smallDog') && (
                <div className='price-container'>
                  <Form.Control
                    type='text'
                    value={prices['smallDog'] || ''}
                    onChange={(e) => handlePriceChange('smallDog', e.target.value)}
                    placeholder={t('caretakerForm.priceFor', { type: t('caretakerForm.smallDog') })}
                    className='form-control price-input'
                  />
                </div>
              )}
            </div>
            <div className='animal-type'>
              <Form.Check
                type='checkbox'
                label={t('caretakerForm.mediumDog')}
                onChange={() => handleAnimalTypeChange('mediumDog')}
                checked={animalTypes.includes('mediumDog')}
                className='form-check'
              />
              {animalTypes.includes('mediumDog') && (
                <div className='price-container'>
                  <Form.Control
                    type='text'
                    value={prices['mediumDog'] || ''}
                    onChange={(e) => handlePriceChange('mediumDog', e.target.value)}
                    placeholder={t('caretakerForm.priceFor', { type: t('caretakerForm.mediumDog') })}
                    className='form-control price-input'
                  />
                </div>
              )}
            </div>
            <div className='animal-type'>
              <Form.Check
                type='checkbox'
                label={t('caretakerForm.cat')}
                onChange={() => handleAnimalTypeChange('cat')}
                checked={animalTypes.includes('cat')}
                className='form-check'
              />
              {animalTypes.includes('cat') && (
                <div className='price-container'>
                  <Form.Control
                    type='text'
                    value={prices['cat'] || ''}
                    onChange={(e) => handlePriceChange('cat', e.target.value)}
                    placeholder={t('caretakerForm.priceFor', { type: t('caretakerForm.cat') })}
                    className='form-control price-input'
                  />
                </div>
              )}
            </div>
          </Form.Group>

          <Form.Group controlId='description' className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.description')}</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('caretakerForm.enterDescription')}
              className='form-label form-text-area'
            />
          </Form.Group>

          <Form.Group controlId='availability' className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.availabilityCalendar')}</Form.Label>
            <DatePicker
              value={availability}
              onChange={setAvailability}
              multiple
              range
              format='DD-MM-YYYY'
              plugins={[
                weekends(),
                <DatePanel sort="date" style={{ width: 150 }} />
              ]}
            />
          </Form.Group>

          <Form.Group controlId='images' className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.uploadImages')}</Form.Label>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>{t('caretakerForm.dragDrop')}</p>
            </div>
            <div className='images-list'>
              {images.map((file, index) => (
                <div key={index} className="image-item">
                  <img src={URL.createObjectURL(file)} alt={`preview-${index}`} />
                </div>
              ))}
            </div>
          </Form.Group>

          <Button variant='primary' type='submit'>
            {t('caretakerForm.submit')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CaretakerForm;
