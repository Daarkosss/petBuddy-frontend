import { LoadingOutlined, SearchOutlined, StopOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, List, Modal, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import store from "../../store/RootStore";
import { observer } from "mobx-react-lite";


const BlockedUsersIcon = observer(() => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    size: 2,
    current: 1,
    total: store.blocked.filteredUsers.length,
  });

  const handleOnPageChange = (page: number) => {
    setPagination({
      ...pagination,
      current: page,
    });
  };

  useEffect(() => {
    setPagination({
      ...pagination,
      total: store.blocked.filteredUsers.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.blocked.filteredUsers]);

  const handleUnblockUser = (userEmail: string) => {
    setIsLoading(true);
    store.blocked.unblockUser(userEmail).then(() => {
      setIsLoading(false);
      setIsModalOpen(false);
    });
  };

  return (
    <div className="blocked-users-wrapper">
      <StopOutlined
        style={{ fontSize: "23px" }}
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        title={t("blockedUsers")}
      >
        {isLoading ? (
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
                store.blocked.searchValue = e.target.value;
              }}
              onClear={() => {
                store.blocked.searchValue = "";
              }}
              allowClear
            />
            <List
              className="blocked-badge-list"
              itemLayout="vertical"
              dataSource={store.blocked.filteredUsers}
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
                        onConfirm={() => handleUnblockUser(item.email)}
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
    </div>
  );
});

export default BlockedUsersIcon;
