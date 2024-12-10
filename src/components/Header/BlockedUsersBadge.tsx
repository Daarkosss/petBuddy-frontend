import { LoadingOutlined, StopOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Input, List, Modal, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useTranslation } from "react-i18next";
import { AccountDataDTO } from "../../types";

const { Search } = Input;

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    size: 5,
    current: 1,
    total: 0,
  });

  const getBlockedUsers = async (userDataLike?: string) => {
    await api.getBlockedUsers().then((data) => {
      if (data !== undefined) {
        setBlockedUsers([...data.content]);
        setPagination({
          size: data.pageable.pageSize,
          current: data.pageable.pageNumber + 1,
          total: data.totalElements,
        });
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const gBlockedUsers = async () => {
      await getBlockedUsers();
    };
    gBlockedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReload]);

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
            <Search
              placeholder={t("placeholder.inputSearchedText")}
              onSearch={getBlockedUsers}
              enterButton
              loading={isLoading}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => {
                setSearchValue(null);
                getBlockedUsers(undefined);
              }}
              allowClear
            />
            <List
              className="blocked-badge-list"
              itemLayout="vertical"
              dataSource={users}
              locale={{ emptyText: t("noData") }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.size,
                total: pagination.total,
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
