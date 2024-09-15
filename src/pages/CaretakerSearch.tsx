import { useState, useEffect } from 'react';
import { Table, Button, Spin, Rate } from 'antd';
import { SorterResult, TablePaginationConfig, FilterValue, ColumnsType } from 'antd/es/table/interface';
import { api } from '../api/api';
import { Header } from '../components/Header';
import { useTranslation } from 'react-i18next';
import Caretaker from '../models/Caretaker';
import { CaretakerSearchFilters, OfferConfiguration } from '../types';
import CaretakerFilters from '../components/CaretakerFilters';

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

  const [filters, setFilters] = useState<CaretakerSearchFilters>({
    personalDataLike: '',
    cityLike: '',
    voivodeship: undefined,
    animals: [],
  });

  const [animalFilters, setAnimalFilters] = useState<Record<string, OfferConfiguration[]>>({});

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
      sortBy: isSorted ? (singleSorter.field as string) : undefined,
      sortDirection: mapSortDirection(singleSorter),
    });
  };

  const handleSearch = () => {
    setPagingParams((prevParams) => ({
      ...prevParams,
      page: 0, // Reset to first page on search
    }));
  };

  const handleAnimalFilterChange = (animalType: string, updatedConfig: Partial<OfferConfiguration>) => {
    setAnimalFilters((prevFilters) => {
      const existingConfigs = prevFilters[animalType] || [{}];

      const updatedConfigs = existingConfigs.map((config) => ({
        ...config,
        ...updatedConfig,
        attributes: {
          ...config.attributes,
          ...updatedConfig.attributes,
        },
      }));

      const newAnimalFilters = {
        ...prevFilters,
        [animalType]: updatedConfigs,
      };

      setFilters((prevFilters) => ({
        ...prevFilters,
        animals: Object.keys(newAnimalFilters).map((type) => ({
          animalType: type,
          offerConfigurations: newAnimalFilters[type],
        })),
      }));

      return newAnimalFilters;
    });
  };

  const handleAnimalTypesChange = (selectedAnimalTypes: string[]) => {
    const newAnimalFilters: Record<string, OfferConfiguration[]> = {};
    selectedAnimalTypes.forEach((animalType) => {
      newAnimalFilters[animalType] = animalFilters[animalType] || [{}];
    });

    setAnimalFilters(newAnimalFilters);

    setFilters((prevFilters) => ({
      ...prevFilters,
      animals: selectedAnimalTypes.map((animalType) => ({
        animalType,
        offerConfigurations: newAnimalFilters[animalType],
      })),
    }));
  };

  const columns: ColumnsType<Caretaker> = [
    {
      title: t('caretaker'),
      key: 'caretaker',
      render: (_: unknown, record: Caretaker) => (
        <div className="caretaker-list-item">
          <img
            src="https://via.placeholder.com/150"
            alt="avatar"
          />
          <div>
            <h4>{record.accountData.name} {record.accountData.surname}</h4>
            <p>{record.address.city}, {record.address.voivodeship.toString()}</p>
            <p>{record.description.substring(0, 100)}{record.description.length > 100 && <span>...</span>}</p>
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
        <div className="caretaker-rating">
          {rating ? (
            <>
              <div className="caretaker-rating-stars">
                <Rate disabled allowHalf value={rating} />
                <span>({record.numberOfRatings})</span>
              </div>
              <span className="caretaker-rating-value">{rating.toFixed(2)}</span>
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
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="caretaker-container">
        <Spin spinning={isLoading} fullscreen />
        <CaretakerFilters
          filters={filters}
          animalFilters={animalFilters}
          onFiltersChange={setFilters}
          onAnimalFiltersChange={handleAnimalFilterChange}
          onAnimalTypesChange={handleAnimalTypesChange}
          onSearch={handleSearch}
        />
        <div className="caretaker-content">
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
    </div>
  );
};

export default CaretakerList;
