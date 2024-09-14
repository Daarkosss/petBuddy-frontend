import { useState, useEffect } from 'react';
import { Table, Select, Input, Button, Spin, Rate } from 'antd';
import { SorterResult, TablePaginationConfig, FilterValue, ColumnsType } from 'antd/es/table/interface';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { useTranslation } from 'react-i18next';
import Caretaker from '../models/Caretaker';

const CaretakerList = () => {
  const { t } = useTranslation();

  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 10,
    sortBy: undefined as string | undefined,
    sortDirection: undefined as string | undefined,
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
      setCaretakers(data.content.map((caretaker) => new Caretaker(caretaker)));
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : t('unknownError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCaretakers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingParams]);

  const mapSortDirection = (sorter: SorterResult<Caretaker>) => {
    if (sorter.order) {
      return sorter.order === 'ascend' ? 'ASC' : 'DESC';
    } else {
      return undefined;
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Caretaker> | SorterResult<Caretaker>[]
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    const isSorted = !!singleSorter.order;
    setPagingParams({
      page: (pagination.current || 1) - 1,
      size: pagination.pageSize || 10,
      sortBy: isSorted ? singleSorter.field as string : undefined,
      sortDirection: mapSortDirection(singleSorter),
    });
  };

  const handleSearch = () => {
    setPagingParams((prevParams) => ({
      ...prevParams,
      page: 0, // Reset to first page on search
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const columns: ColumnsType<Caretaker> = [
    {
      title: t('caretaker'),
      key: 'caretaker',
      render: (_: unknown, record: Caretaker) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://via.placeholder.com/150"
            alt="avatar"
            style={{ width: 150, height: 150, marginRight: 20 }}
          />
          <div>
            <h4>{record.accountData.name} {record.accountData.surname}</h4>
            <p>{record.address.city}, {record.address.voivodeship.toString()}</p>
            <p>{record.description}</p>
            <Button href={`/caretakers/${record.accountData.email}`} type="primary">
              {t('viewDetails')}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: t('rating'),
      dataIndex: 'avgRating',
      key: 'avgRating',
      sorter: true,
      render: (rating: number | null, record: Caretaker) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 5}}>
          {rating ? (
            <>
              <div style={{ display: 'flex', gap: 5 }}>
                <Rate disabled allowHalf value={rating} />
                <span>({record.numberOfRatings})</span>
              </div>
              <span style={{ marginLeft: 8 }}>{rating.toFixed(2)}</span>
            </>
          ) : (
            <>
              <Rate disabled allowHalf value={0} />
              <p>{t('noRatings')}</p>
            </>
          )}
        </div>
      ),
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
            placeholder={t('caretakerSearch.personalData')}
            value={filters.personalDataLike}
            onChange={(e) => handleSearchChange('personalDataLike', e.target.value)}
            style={{ width: 200, marginRight: 20 }}
            onKeyDown={handleKeyDown}
          />
          <Input
            placeholder={t('city')}
            value={filters.cityLike}
            onChange={(e) => handleSearchChange('cityLike', e.target.value)}
            style={{ width: 200, marginRight: 20 }}
            onKeyDown={handleKeyDown}
          />
          <Select
            placeholder={t('voivodeship')}
            style={{ width: 200, marginRight: 20 }}
            onChange={handleVoivodeshipChange}
            allowClear
            value={filters.voivodeship}
            onKeyDown={handleKeyDown}
          >
            <Select value="DOLNOSLASKIE">Dolnośląskie</Select>
            <Select value="KUJAWSKO_POMORSKIE">Kujawsko-Pomorskie</Select>
            <Select value="LUBELSKIE">Lubelskie</Select>
            <Select value="LUBUSKIE">Lubuskie</Select>
            <Select value="LODZKIE">Łódzkie</Select>
            <Select value="MALOPOLSKIE">Małopolskie</Select>
            <Select value="MAZOWIECKIE">Mazowieckie</Select>
            <Select value="OPOLSKIE">Opolskie</Select>
            <Select value="PODKARPACKIE">Podkarpackie</Select>
            <Select value="PODLASKIE">Podlaskie</Select>
            <Select value="POMORSKIE">Pomorskie</Select>
            <Select value="SLASKIE">Śląskie</Select>
            <Select value="SWIETOKRZYSKIE">Świętokrzyskie</Select>
            <Select value="WARMINSKO_MAZURSKIE">Warmińsko-Mazurskie</Select>
            <Select value="WIELKOPOLSKIE">Wielkopolskie</Select>
            <Select value="ZACHODNIOPOMORSKIE">Zachodniopomorskie</Select>
          </Select>
          <Select
            mode="multiple"
            placeholder={t('caretakerSearch.animalTypes')}
            style={{ width: 300 }}
            onChange={handleAnimalTypesChange}
            value={filters.animalTypes}
          >
            <Select value="DOG">{t('dog')}</Select>
            <Select value="CAT">{t('cat')}</Select>
            <Select value="BIRD">{t('bird')}</Select>
          </Select>
          <Button type="primary" onClick={handleSearch} style={{ marginLeft: 20 }}>
            {t('search')}
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
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default CaretakerList;
