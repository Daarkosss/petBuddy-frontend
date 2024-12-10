import {
  LoadingOutlined,
  SearchOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Input, List, Modal, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useTranslation } from "react-i18next";
import { AccountDataDTO } from "../../types";

interface BlockedUsersBadgeProps {
  handleBlockUnblockUser: (
    userEmail: string,
    option: string,
    onSuccess?: () => void
  ) => void;
  triggerReload: boolean;
}

const BlockedUsersBadge: React.FC<BlockedUsersBadgeProps> = ({
  handleBlockUnblockUser,
  triggerReload,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [users, setBlockedUsers] = useState<AccountDataDTO[]>([]);
  const [filteredBlockedUsers, setFilteredBlockedUsers] = useState<
    AccountDataDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //to remember last provided input in case we unblock user after filtering
  const [searchedValue, setSearchedValue] = useState<string>("");

  const [pagination, setPagination] = useState({
    size: 2,
    current: 1,
    total: filteredBlockedUsers.length,
  });

  const getBlockedUsers = async () => {
    await api.getBlockedUsers().then((data) => {
      if (data !== undefined) {
        setBlockedUsers([...data]);
        handleFilter(searchedValue, data);
      }
      setIsLoading(false);
    });
  };

  const handleOnPageChange = (page: number) => {
    setPagination({
      ...pagination,
      current: page,
    });
  };

  const handleFilter = (searchValue: string, usersArray: AccountDataDTO[]) => {
    if (searchValue !== "") {
      const loweredSearchedValue = searchValue.toLocaleLowerCase();
      setFilteredBlockedUsers([
        ...usersArray.filter(
          (blockedUser) =>
            blockedUser.email.toLocaleLowerCase().match(loweredSearchedValue) ||
            blockedUser.name.toLocaleLowerCase().match(loweredSearchedValue) ||
            blockedUser.surname.toLocaleLowerCase().match(loweredSearchedValue)
        ),
      ]);
    } else {
      setFilteredBlockedUsers([...usersArray]);
    }
  };

  useEffect(() => {
    const gBlockedUsers = async () => {
      await getBlockedUsers();
    };
    gBlockedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReload]);

  useEffect(() => {
    setPagination({
      ...pagination,
      total: filteredBlockedUsers.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBlockedUsers]);

  return (
    <Badge count={0} overflowCount={0} className="notification-badge">
      <StopOutlined
        style={{ fontSize: "24px" }}
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        title={t("blockedUsers")}
      >
        {isLoading === true ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <LoadingOutlined />
          </div>
        ) : (
          <div className="blocked-badge-modal-content-container">
            <Input
              addonAfter={<SearchOutlined />}
              placeholder={t("placeholder.inputSearchedText")}
              onChange={(e) => {
                setSearchedValue(e.target.value);
                handleFilter(e.target.value, users);
              }}
              onClear={() => {
                setSearchedValue("");
                setFilteredBlockedUsers([...users]);
              }}
              allowClear
            />
            <List
              className="blocked-badge-list"
              itemLayout="vertical"
              dataSource={filteredBlockedUsers}
              locale={{ emptyText: t("noData") }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.size,
                total: pagination.total,
                onChange: handleOnPageChange,
              }}
              renderItem={(item) => (
                <List.Item
                  className="blocked-badge-list-item"
                  extra={
                    <div className="blocked-badge-extra">
                      <Popconfirm
                        title={t("sureToUnblock")}
                        onConfirm={() => {
                          handleBlockUnblockUser!(
                            item.email,
                            "unblockUser",
                            () => getBlockedUsers()
                          );
                        }}
                        okText={t("yes")}
                        cancelText={t("no")}
                      >
                        <Button
                          type="primary"
                          className="blocked-action-button"
                        >
                          {t("unblockUser")}
                        </Button>
                      </Popconfirm>
                    </div>
                  }
                  style={{ display: "flex", flexDirection: "row" }}
                  onClick={() => {}}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.profilePicture?.url}
                        icon={
                          item.profilePicture?.url ? null : <UserOutlined />
                        }
                        size={50}
                      />
                    }
                    title={
                      <div className="blocked-badge-title">
                        {item.name} {item.surname}
                      </div>
                    }
                    description={item.email}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </Badge>
  );
};

export default BlockedUsersBadge;
