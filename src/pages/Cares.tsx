import { useState, useEffect } from "react";
import { Table, Button, Spin } from "antd";
import {
  SorterResult,
  TablePaginationConfig,
  FilterValue,
  ColumnsType,
} from "antd/es/table/interface";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import { CareDTO } from "../types/care.types";

const CaresList = () => {
  const { t } = useTranslation();
  const [cares, setCares] = useState<CareDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchCares = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCares(pagingParams);
      if (data) {
        setCares(data.content);
        setPagination({
          current: data.pageable.pageNumber + 1,
          pageSize: data.pageable.pageSize,
          total: data.totalElements,
        });
      }
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
    fetchCares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingParams]);

  const mapSortDirection = (sorter: SorterResult<CareDTO>) => {
    if (sorter.order) {
      return sorter.order === "ascend" ? "ASC" : "DESC";
    } else {
      return undefined;
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CareDTO> | SorterResult<CareDTO>[]
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

  const columns: ColumnsType<CareDTO> = [
    {
      title: t("care.title"),
      key: "title",
      dataIndex: "submittedAt",
    },
  ];

  return (
    <div>
      <div className="caretaker-container">
        <Spin spinning={isLoading} fullscreen />
        <div className="caretaker-content">
          <Table
            columns={columns}
            locale={{
              emptyText: t("caretakerSearch.noCaretakers"),
              triggerDesc: t("caretakerSearch.triggerDesc"),
              triggerAsc: t("caretakerSearch.triggerAsc"),
              cancelSort: t("caretakerSearch.cancelSort"),
            }}
            dataSource={cares}
            rowKey={(record) => record.submittedAt}
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
          <Button
            type="primary"
            onClick={handleSearch}
            className="search-button"
          >
            {t("caretakerSearch.search")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaresList;
