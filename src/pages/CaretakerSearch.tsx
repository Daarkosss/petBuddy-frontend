import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Rate, Tabs } from "antd";
import { TablePaginationConfig, ColumnsType } from "antd/es/table/interface";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import { CaretakerBasics } from "../models/Caretaker";
import {
  AccountDataDTO,
  CaretakerSearchFilters,
  OfferConfiguration,
} from "../types";
import CaretakerFilters from "../components/CaretakerFilters";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import MapWithCaretakers from "../components/MapWithCaretakers";

const CaretakerList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [caretakers, setCaretakers] = useState<CaretakerBasics[]>([]);
  const [followedCaretakers, setFollowedCaretakers] = useState<
    AccountDataDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  const [selectedTab, setSelectedTab] = useState<string>("list");

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

  const getFollowedCaretakers = async () => {
    const response = await api.getFollowedCaretakers();
    if (response) {
      setFollowedCaretakers(response);
    }
  };

  const loadFiltersFromSession = () => {
    const sessionFilters = sessionStorage.getItem("caretakerFilters");
    if (sessionFilters) {
      return JSON.parse(sessionFilters);
    } else {
      return {
        personalDataLike: "",
        cityLike: "",
        voivodeship: undefined,
        animals: [],
        availabilities: [],
      };
    }
  };

  const [filters, setFilters] = useState<CaretakerSearchFilters>(
    loadFiltersFromSession()
  );

  const [animalFilters, setAnimalFilters] = useState<
    Record<string, OfferConfiguration>
  >({});

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
        data.caretakers.content.map(
          (caretaker) => new CaretakerBasics(caretaker)
        )
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
    getFollowedCaretakers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingParams]);

  useEffect(() => {
    sessionStorage.setItem("caretakerFilters", JSON.stringify(filters));
  }, [filters]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagingParams({
      ...pagingParams,
      page: (pagination.current || 1) - 1,
      size: pagination.pageSize || 10,
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
      };

      const newAnimalFilters = {
        ...prevFilters,
        [animalType]: updatedConfigFull || null,
      };

      setFilters((prevFilters) => ({
        ...prevFilters,
        animals: Object.entries(newAnimalFilters).map(([type, config]) => ({
          animalType: type,
          offerConfiguration: config,
          amenities: config.amenities,
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
        offerConfiguration: newAnimalFilters[animalType],
        amenities: newAnimalFilters[animalType].amenities,
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
            <img
              src={
                record.accountData.profilePicture?.url ||
                "/images/default-avatar.png"
              }
              alt="avatar"
            />
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
              onClick={() => {
                if (
                  record.accountData.email === store.user.profile?.email &&
                  store.user.profile?.selected_profile === "CLIENT"
                ) {
                  navigate("/profile-client");
                } else {
                  navigate(`/profile-caretaker/${record.accountData.email}`);
                }
              }}
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

  const columnsFollowedCaretakers: ColumnsType<AccountDataDTO> = [
    {
      title: t("caretaker"),
      key: "caretaker",
      render: (_: unknown, record: AccountDataDTO) => (
        <div className="caretaker-list-item">
          <div className="profile-picture">
            <img
              src={record.profilePicture?.url || "/images/default-avatar.png"}
              alt="avatar"
            />
          </div>
          <div>
            <h4>
              {record.name} {record.surname}
            </h4>
            {/* <p>
              {record.address.city}, {record.address.voivodeship.toString()}
            </p> */}
            <Button
              className="view-details-button"
              type="primary"
              onClick={() => {
                if (
                  record.email === store.user.profile?.email &&
                  store.user.profile?.selected_profile === "CLIENT"
                ) {
                  navigate("/profile-client");
                } else {
                  navigate(`/profile-caretaker/${record.email}`);
                }
              }}
            >
              {t("viewDetails")}
            </Button>
          </div>
        </div>
      ),
    },
    // {
    //   title: t("rating"),
    //   dataIndex: "avgRating",
    //   key: "avgRating",
    //   render: (rating: number | null, record: AccountDataDTO) => (
    //     <div className="caretaker-rating">
    //       {rating ? (
    //         <>
    //           <div className="caretaker-rating-stars">
    //             <Rate disabled allowHalf value={rating} />
    //           </div>
    //           <span className="caretaker-rating-value">
    //             {rating.toFixed(2)}
    //           </span>
    //         </>
    //       ) : (
    //         <>
    //           <Rate disabled allowHalf value={0} />
    //           <p>{t("noRatings")}</p>
    //         </>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="caretaker-container">
      {selectedTab !== "followed" && (
        <CaretakerFilters
          filters={filters}
          animalFilters={animalFilters}
          onFiltersChange={setFilters}
          onAnimalFiltersChange={updateAnimalFilters}
          onAnimalTypesChange={handleAnimalTypesChange}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
        />
      )}
      <Tabs
        style={{ width: "100%" }}
        centered
        size="small"
        onChange={(tabKey) => {
          setSelectedTab(tabKey);
        }}
        items={[
          {
            key: "list",
            label: t("caretakerSearch.list"),
            children: (
              <div className="caretaker-content">
                <Table
                  loading={isLoading}
                  columns={columns}
                  locale={{
                    emptyText: t("caretakerSearch.noCaretakers"),
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
            ),
          },
          {
            key: "followed",
            label: t("caretakerSearch.followed"),
            children: (
              <div className="caretaker-content">
                <Table
                  loading={isLoading}
                  columns={columnsFollowedCaretakers}
                  locale={{
                    emptyText: t("caretakerSearch.noCaretakers"),
                  }}
                  dataSource={followedCaretakers}
                  rowKey={(record) => record.email}
                  scroll={{ x: "max-content" }}
                  onChange={handleTableChange}
                />
              </div>
            ),
          },
          {
            key: "map",
            label: t("caretakerSearch.map"),
            children: (
              <MapWithCaretakers caretakers={caretakers} center={mapCenter} />
            ),
          },
        ]}
      />
    </div>
  );
};

export default CaretakerList;
