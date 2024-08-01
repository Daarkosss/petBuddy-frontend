import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Header';

interface CaregiverFormProps {
  onSubmit: (formData: FormData) => void;
}

const CaretakerForm: React.FC<CaregiverFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();

  const [location, setLocation] = useState('');
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [description, setDescription] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState<Date | null>(null);
  const [availabilityEnd, setAvailabilityEnd] = useState<Date | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleAnimalTypeChange = (type: string) => {
    if (animalTypes.includes(type)) {
      setAnimalTypes(animalTypes.filter(t => t !== type));
    } else {
      setAnimalTypes([...animalTypes, type]);
    }
  };

  const handlePriceChange = (type: string, price: number) => {
    setPrices({ ...prices, [type]: price });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    if (availabilityStart) formData.append('availabilityStart', availabilityStart.toISOString());
    if (availabilityEnd) formData.append('availabilityEnd', availabilityEnd.toISOString());

    animalTypes.forEach(type => {
      formData.append('animalTypes', type);
      formData.append(`price_${type}`, prices[type].toString());
    });

    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    onSubmit(formData);
  };

  return (
    <div>
      <Header />
      <div className='form-container'>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="location" className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.location')}</Form.Label>
            <Form.Control
              type="text"
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
                type="checkbox"
                label={t('caretakerForm.smallDog')}
                onChange={() => handleAnimalTypeChange('smallDog')}
                checked={animalTypes.includes('smallDog')}
                className='form-check'
              />
              {animalTypes.includes('smallDog') && (
                <Form.Control
                  type="number"
                  pattern="/^\d+(\.\d{0,2})?$/"
                  value={prices['smallDog'] || ''}
                  onChange={(e) => handlePriceChange('smallDog', parseFloat(e.target.value))}
                  placeholder={t('caretakerForm.priceFor', { type: t('caretakerForm.smallDog') })}
                  className='form-control price-input'
                />
              )}
            </div>
            <div className='animal-type'>
              <Form.Check
                type="checkbox"
                label={t('caretakerForm.mediumDog')}
                onChange={() => handleAnimalTypeChange('mediumDog')}
                checked={animalTypes.includes('mediumDog')}
                className='form-check'
              />
              {animalTypes.includes('mediumDog') && (
                <Form.Control
                  pattern="\d+(\.\d{2})?"
                  value={prices['mediumDog'] || ''}
                  onChange={(e) => handlePriceChange('mediumDog', parseFloat(e.target.value))}
                  placeholder={t('caretakerForm.priceFor', { type: t('caretakerForm.mediumDog') })}
                  className='form-control price-input'
                />
              )}
            </div>
            <div className='animal-type'>
              <Form.Check
                type="checkbox"
                label={t('caretakerForm.cat')}
                onChange={() => handleAnimalTypeChange('cat')}
                checked={animalTypes.includes('cat')}
                className='form-check'
              />
              {animalTypes.includes('cat') && (
                <Form.Control
                  type="number"
                  value={prices['cat'] || ''}
                  onChange={(e) => handlePriceChange('cat', parseFloat(e.target.value))}
                  placeholder={t('caretakerForm.priceFor', { type: t('caretakerForm.cat') })}
                  className='form-control price-input'
                />
              )}
            </div>
          </Form.Group>

          <Form.Group controlId="description" className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.description')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('caretakerForm.enterDescription')}
              className='form-label form-text-area'
            />
          </Form.Group>

          <Form.Group controlId="availability" className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.availabilityCalendar')}</Form.Label>
            <div>
              <Form.Label className='form-label'>{t('caretakerForm.startDate')}</Form.Label>
              <DatePicker
                selected={availabilityStart}
                onChange={(date: Date | null) => setAvailabilityStart(date)}
                className='form-control'
              />
            </div>
            <div>
              <Form.Label className='form-label'>{t('caretakerForm.endDate')}</Form.Label>
              <DatePicker
                selected={availabilityEnd}
                onChange={(date: Date | null) => setAvailabilityEnd(date)}
                className='form-control'
              />
            </div>
          </Form.Group>

          <Form.Group controlId="images" className='form-group'>
            <Form.Label className='form-label'>{t('caretakerForm.uploadImages')}</Form.Label>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>{t('caretakerForm.dragDrop')}</p>
            </div>
            <div className='images-list'>
              {images.map((file, index) => (
                <div key={index}>{file.name}</div>
              ))}
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            {t('caretakerForm.submit')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CaretakerForm;
