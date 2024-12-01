import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Rate, Tabs, Spin } from "antd";
import { TablePaginationConfig, ColumnsType } from "antd/es/table/interface";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import { CaretakerBasics } from "../models/Caretaker";
import {
  Availability,
  CaretakerSearchFilters,
  OfferConfiguration,
} from "../types";
import CaretakerFilters from "../components/CaretakerFilters";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import MapWithCaretakers from "../components/MapWithCaretakers";

const CaretakerList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [caretakers, setCaretakers] = useState<CaretakerBasics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>();

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 10,
    sortBy: "ratingScore" as string | undefined,
    sortDirection: "DESC" as string | undefined,
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState<CaretakerSearchFilters>(
    (location.state?.filters && {
      ...location.state.filters,
      availabilities: location.state?.filters?.availabilities.map(
        (value: Availability) => [value.availableFrom, value.availableTo]
      ),
    }) || {
      personalDataLike: "",
      cityLike: "",
      voivodeship: undefined,
      animals: [],
      availabilities: [],
    }
  );

  const [animalFilters, setAnimalFilters] = useState<
    Record<string, OfferConfiguration>
  >(() => {
    const animal = location.state?.filters?.animals?.[0];
    if (animal) {
      return { [animal.animalType]: animal.availabilities || [] };
    }
    return {};
  });

  const assignFiltersToAnimals = async () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      animals: prevFilters.animals?.map((animal) => ({
        ...animal,
        availabilities: prevFilters.availabilities,
      })),
    }));
  };

  const fetchCaretakers = async () => {
    setIsLoading(true);
    try {
      await assignFiltersToAnimals();
      const data = await api.getCaretakers(pagingParams, filters);
      setCaretakers(
        data.caretakers.content.map((caretaker) => new CaretakerBasics(caretaker))
      );
      setPagination({
        current: data.caretakers.pageable.pageNumber + 1,
        pageSize: data.caretakers.pageable.pageSize,
        total: data.caretakers.totalElements,
      });
      setMapCenter([data.cityLatitude, data.cityLongitude]);
    } catch (error) {
      toast.error(t("error.getCaretakers"));
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

  const handleTableChange = (pagination: TablePaginationConfig) => {

    setPagingParams({
      ...pagingParams,
      page: (pagination.current || 1) - 1,
      size: pagination.pageSize || 10
    });
  };

  const handleSearch = () => {
    setPagingParams((prevParams) => ({
      ...prevParams,
      page: 0, // Reset to first page on search
    }));
  };

  const handleSortChange = (sortBy: string, sortDirection: string) => {
    setPagingParams({
      ...pagingParams,
      sortBy: sortBy,
      sortDirection: sortDirection,
    });
  };

  const updateAnimalFilters = (
    animalType: string,
    updatedConfig: Partial<OfferConfiguration>
  ) => {
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
          <div className="profile-picture">
            <img src={record.accountData.profilePicture?.url || "/default-avatar.png"} alt="avatar" />
          </div>
          <div>
            <h4>
              {record.accountData.name} {record.accountData.surname}
            </h4>
            <p>
              {record.address.city}, {record.address.voivodeship.toString()}
            </p>
            <Button
              className="view-details-button"
              type="primary"
              onClick={() =>
                navigate(`/profile-caretaker/${record.accountData.email}`)
              }
            >
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
      render: (rating: number | null, record: CaretakerBasics) => (
        <div className="caretaker-rating">
          {rating ? (
            <>
              <div className="caretaker-rating-stars">
                <Rate disabled allowHalf value={rating} />
                <span>({record.numberOfRatings})</span>
              </div>
              <span className="caretaker-rating-value">
                {rating.toFixed(2)}
              </span>
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

  return (
    <div className="caretaker-container">
      <CaretakerFilters
        filters={filters}
        animalFilters={animalFilters}
        onFiltersChange={setFilters}
        onAnimalFiltersChange={updateAnimalFilters}
        onAnimalTypesChange={handleAnimalTypesChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
      />
      <Tabs 
        style={{width: "100%"}} 
        centered 
        size="small"
        items={[
          {
            key: "list",
            label: t("caretakerSearch.list"),
            children: <div className="caretaker-content">
              <Table
                loading={isLoading}
                columns={columns}
                locale={{
                  emptyText: t("caretakerSearch.noCaretakers"),
                  triggerDesc: t("triggerDesc"),
                  triggerAsc: t("triggerAsc"),
                  cancelSort: t("cancelSort"),
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
                  },
                }}
                scroll={{ x: "max-content" }}
                onChange={handleTableChange}
              />
            </div>
          },
          {
            key: "map",
            label: t("caretakerSearch.map"),
            children: <MapWithCaretakers caretakers={caretakers} center={mapCenter} />
          },
        ]}
      />
    </div>
  );
};

export default CaretakerList;
