import { useState, useEffect } from 'react';
import { Table, Select, Input, Button, Spin } from 'antd';
import { SorterResult, TablePaginationConfig, FilterValue, ColumnsType } from 'antd/es/table/interface';
import { api, CaretakerDTO } from '../api/api';
import { Header } from '../components/Header';

const { Option } = Select;

const CaretakerList = () => {
  const [caretakers, setCaretakers] = useState<CaretakerDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 10,
    sortBy: 'avgRating',
    sortDirection: 'DESC',
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    personalDataLike: '',
    cityLike: '',
    voivodeship: undefined as string | undefined,
    animalTypes: [] as string[],
  });

  const fetchCaretakers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCaretakers(pagingParams, filters);
      setCaretakers(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCaretakers();
  }, [pagingParams]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CaretakerDTO> | SorterResult<CaretakerDTO>[]
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setPagingParams({
      page: (pagination.current || 1) - 1,
      size: pagination.pageSize || 10,
      sortBy: singleSorter.field as string || 'avgRating',
      sortDirection: singleSorter.order === 'ascend' ? 'ASC' : 'DESC',
    });
  };

  const handleSearch = () => {
    setPagingParams((prevParams) => ({
      ...prevParams,
      page: 0, // Reset to first page on search
    }));
    fetchCaretakers();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const columns: ColumnsType<CaretakerDTO> = [
    {
      title: 'Caretaker',
      key: 'caretaker',
      render: (_: unknown, record: CaretakerDTO) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://via.placeholder.com/150"
            alt="avatar"
            style={{ width: 150, height: 150, marginRight: 20 }}
          />
          <div>
            <h4>{record.accountData.name} {record.accountData.surname}</h4>
            <p>{record.address.city}, {record.address.voivodeship}</p>
            <p>{record.description}</p>
            <Button href={`/caretakers/${record.accountData.email}`} type="primary">
              View Details
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'avgRating',
      key: 'avgRating',
      sorter: true,
      defaultSortOrder: pagingParams.sortDirection === 'ASC' ? 'ascend' : 'descend',
      render: (rating: number | null) => (rating ? rating.toFixed(1) : 'No ratings'),
    },
  ];

  const handleSearchChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleVoivodeshipChange = (value: string) => {
    setFilters({ ...filters, voivodeship: value });
  };

  const handleAnimalTypesChange = (value: string[]) => {
    setFilters({ ...filters, animalTypes: value });
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="caretaker-search">
        <Spin spinning={isLoading} fullscreen />
        <div className='filters'>
          <Input
            placeholder="Search by Name/Email"
            value={filters.personalDataLike}
            onChange={(e) => handleSearchChange('personalDataLike', e.target.value)}
            style={{ width: 200, marginRight: 20 }}
            onKeyDown={handleKeyDown}
          />
          <Input
            placeholder="Search by City"
            value={filters.cityLike}
            onChange={(e) => handleSearchChange('cityLike', e.target.value)}
            style={{ width: 200, marginRight: 20 }}
            onKeyDown={handleKeyDown}
          />
          <Select
            placeholder="Voivodeship"
            style={{ width: 200, marginRight: 20 }}
            onChange={handleVoivodeshipChange}
            value={filters.voivodeship}
            onKeyDown={handleKeyDown}
          >
            <Option value="DOLNOSLASKIE">Dolnośląskie</Option>
            <Option value="KUJAWSKO_POMORSKIE">Kujawsko-Pomorskie</Option>
            <Option value="LUBELSKIE">Lubelskie</Option>
            <Option value="LUBUSKIE">Lubuskie</Option>
            <Option value="LODZKIE">Łódzkie</Option>
            <Option value="MALOPOLSKIE">Małopolskie</Option>
            <Option value="MAZOWIECKIE">Mazowieckie</Option>
            <Option value="OPOLSKIE">Opolskie</Option>
            <Option value="PODKARPACKIE">Podkarpackie</Option>
            <Option value="PODLASKIE">Podlaskie</Option>
            <Option value="POMORSKIE">Pomorskie</Option>
            <Option value="SLASKIE">Śląskie</Option>
            <Option value="SWIETOKRZYSKIE">Świętokrzyskie</Option>
            <Option value="WARMINSKO_MAZURSKIE">Warmińsko-Mazurskie</Option>
            <Option value="WIELKOPOLSKIE">Wielkopolskie</Option>
            <Option value="ZACHODNIOPOMORSKIE">Zachodniopomorskie</Option>
          </Select>
          <Select
            mode="multiple"
            placeholder="Animal Types"
            style={{ width: 300 }}
            onChange={handleAnimalTypesChange}
            value={filters.animalTypes}
          >
            <Option value="DOG">Dog</Option>
            <Option value="CAT">Cat</Option>
            <Option value="BIRD">Bird</Option>
          </Select>
          <Button type="primary" onClick={handleSearch} style={{ marginLeft: 20 }}>
            Search
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={caretakers}
          rowKey={(record) => record.accountData.email}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default CaretakerList;
