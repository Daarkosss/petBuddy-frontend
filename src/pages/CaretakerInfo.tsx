import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDropzone } from 'react-dropzone';
import 'react-dropzone-uploader/dist/styles.css';

interface CaregiverFormProps {
  onSubmit: (formData: FormData) => void;
}

const CaregiverForm: React.FC<CaregiverFormProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<Date | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
    setImages([...images, ...acceptedFiles]);
  };

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
    if (availability) formData.append('availability', availability.toISOString());

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
          <DatePicker
            selected={availability}
            onChange={(date: Date) => setAvailability(date)}
            className="form-control"
          />
        </Form.Group>

        <Form.Group controlId="images">
          <Form.Label>Upload Images</Form.Label>
          <div {...useDropzone({ onDrop: handleDrop })}>
            <p>Drag & drop some files here, or click to select files</p>
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
