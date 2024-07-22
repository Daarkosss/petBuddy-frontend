import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDropzone } from 'react-dropzone';

interface CaregiverFormProps {
  onSubmit: (formData: FormData) => void;
}

const CaregiverForm: React.FC<CaregiverFormProps> = ({ onSubmit }) => {
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
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or district"
          />
        </Form.Group>

        <Form.Group controlId="animalTypes">
          <Form.Label>Types of animals you care for</Form.Label>
          <Form.Check
            type="checkbox"
            label="Small Dog"
            onChange={() => handleAnimalTypeChange('smallDog')}
            checked={animalTypes.includes('smallDog')}
          />
          <Form.Check
            type="checkbox"
            label="Medium Dog"
            onChange={() => handleAnimalTypeChange('mediumDog')}
            checked={animalTypes.includes('mediumDog')}
          />
          <Form.Check
            type="checkbox"
            label="Cat"
            onChange={() => handleAnimalTypeChange('cat')}
            checked={animalTypes.includes('cat')}
          />
        </Form.Group>

        {animalTypes.map((type) => (
          <Form.Group controlId={`price_${type}`} key={type}>
            <Form.Label>Price for {type}</Form.Label>
            <Form.Control
              type="number"
              value={prices[type] || ''}
              onChange={(e) => handlePriceChange(type, parseFloat(e.target.value))}
              placeholder={`Enter price for ${type}`}
            />
          </Form.Group>
        ))}

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description about yourself"
          />
        </Form.Group>

        <Form.Group controlId="availability">
          <Form.Label>Availability Calendar</Form.Label>
          <div>
            <Form.Label>Start Date</Form.Label>
            <DatePicker
              selected={availabilityStart}
              onChange={(date: Date | null) => setAvailabilityStart(date)}
              className="form-control"
            />
          </div>
          <div>
            <Form.Label>End Date</Form.Label>
            <DatePicker
              selected={availabilityEnd}
              onChange={(date: Date | null) => setAvailabilityEnd(date)}
              className="form-control"
            />
          </div>
        </Form.Group>

        <Form.Group controlId="images">
          <Form.Label>Upload Images</Form.Label>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag & drop some files here, or click to select files</p>
          </div>
          <div>
            {images.map((file, index) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CaregiverForm;
