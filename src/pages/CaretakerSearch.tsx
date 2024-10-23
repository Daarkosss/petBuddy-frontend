import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Button, Spin, Rate } from "antd";
import { SorterResult, TablePaginationConfig, FilterValue, ColumnsType } from "antd/es/table/interface";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import { CaretakerBasics } from "../models/Caretaker";
import { Availability, CaretakerSearchFilters, OfferConfiguration } from "../types";
import CaretakerFilters from "../components/CaretakerFilters";
import store from "../store/RootStore";

const CaretakerList = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [caretakers, setCaretakers] = useState<CaretakerBasics[]>([]);
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

  const [filters, setFilters] = useState<CaretakerSearchFilters>(
    location.state?.filters && {
      ...location.state.filters,
      availabilities: location.state?.filters?.availabilities.map(
        (value: Availability) => [value.availableFrom, value.availableTo]
      ) 
    } || {
    personalDataLike: "",
    cityLike: "",
    voivodeship: undefined,
    animals: [],
    availabilities: [],
  });

  const [animalFilters, setAnimalFilters] = useState<Record<string, OfferConfiguration>>(
    () => {
      const animal = location.state?.filters?.animals?.[0];
      if (animal) {
        return { [animal.animalType]: animal.availabilities || [] };
      }
      return {};
    }
  );

  const assignFiltersToAnimals = async () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      animals: prevFilters.animals?.map((animal) => ({
        ...animal,
        availabilities: prevFilters.availabilities?.map((dateRange) => ({
          availableFrom: dateRange[0]?.toString() || "",
          availableTo: dateRange[1]?.toString() || "",
        })),
      })),
    }))
    console.log("hej", filters);
  }
  
  const fetchCaretakers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await assignFiltersToAnimals();
      console.log(filters);
      const data = await api.getCaretakers(pagingParams, filters);
      setCaretakers(data.content.map((caretaker) => new CaretakerBasics(caretaker)));
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : t("unknownError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    store.selectedMenuOption = "caretakerSearch";
  }, []);

  useEffect(() => {
    fetchCaretakers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingParams]);

  const mapSortDirection = (sorter: SorterResult<CaretakerBasics>) => {
    if (sorter.order) {
      return sorter.order === "ascend" ? "ASC" : "DESC";
    } else {
      return undefined;
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CaretakerBasics> | SorterResult<CaretakerBasics>[]
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

  const updateAnimalFilters = (animalType: string, updatedConfig: Partial<OfferConfiguration>) => {
    setAnimalFilters((prevFilters) => {
      const existingConfig = prevFilters[animalType] || {};
      const updatedConfigFull = {
        ...existingConfig,
        ...updatedConfig,
        attributes: {
          ...existingConfig.attributes,
          ...updatedConfig.attributes,
        },
      };

      const newAnimalFilters = {
        ...prevFilters,
        [animalType]: updatedConfigFull,
      };

      setFilters((prevFilters) => ({
        ...prevFilters,
        animals: Object.entries(newAnimalFilters).map(([type, config]) => ({
          animalType: type,
          offerConfigurations: [config],
        })),
      }));

      return newAnimalFilters;
    });
  };

  const handleAnimalTypesChange = (selectedAnimalTypes: string[]) => {
    const newAnimalFilters: Record<string, OfferConfiguration> = {};
    selectedAnimalTypes.forEach((animalType) => {
      newAnimalFilters[animalType] = animalFilters[animalType] || {};
    });

    setAnimalFilters(newAnimalFilters);

    setFilters((prevFilters) => ({
      ...prevFilters,
      animals: selectedAnimalTypes.map((animalType) => ({
        animalType,
        offerConfigurations: [newAnimalFilters[animalType]],
      })),
    }));
  };

  const columns: ColumnsType<CaretakerBasics> = [
    {
      title: t("caretaker"),
      key: "caretaker",
      render: (_: unknown, record: CaretakerBasics) => (
        <div className="caretaker-list-item">
          <img src="https://via.placeholder.com/150" alt="avatar" />
          <div>
            <h4>{record.accountData.name} {record.accountData.surname}</h4>
            <p>{record.address.city}, {record.address.voivodeship.toString()}</p>
            <Button className="view-details-button" type="primary">
              {t("viewDetails")}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: t("rating"),
      dataIndex: "avgRating",
      key: "avgRating",
      sorter: true,
      render: (rating: number | null, record: CaretakerBasics) => (
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
              <p>{t("noRatings")}</p>
            </>
          )}
        </div>
      ),
    },
  ];

  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="caretaker-container">
        <Spin spinning={isLoading} fullscreen />
        <CaretakerFilters
          filters={filters}
          animalFilters={animalFilters}
          onFiltersChange={setFilters}
          onAnimalFiltersChange={updateAnimalFilters}
          onAnimalTypesChange={handleAnimalTypesChange}
          onSearch={handleSearch}
        />
        <div className="caretaker-content">
          <Table
            columns={columns}
            locale={{ 
              emptyText: t("caretakerSearch.noCaretakers"),
              triggerDesc: t("caretakerSearch.triggerDesc"),
              triggerAsc: t("caretakerSearch.triggerAsc"),
              cancelSort: t("caretakerSearch.cancelSort"),
            }}
            dataSource={caretakers}
            rowKey={(record) => record.accountData.email}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              locale: {
                items_per_page: t("perPage"),
              }
            }}
            scroll={{ x: "max-content" }}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CaretakerList;
