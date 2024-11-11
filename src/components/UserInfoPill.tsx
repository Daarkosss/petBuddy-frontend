import { Avatar, Typography } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { AccountDataDTO } from "../types";

const { Text } = Typography;

interface UserInfoCardProps {
  user: AccountDataDTO;
  isLink: boolean;
  showAvatar?: boolean
}

const UserInfoPill: React.FC<UserInfoCardProps> = ({ user, isLink, showAvatar=true }) => {

  return (
    <div className="user-info-pill">
      {showAvatar && 
        <Avatar 
          size={40}
          icon={!user.profilePicture && <UserOutlined />}
          src={user.profilePicture && user.profilePicture.url} 
        />
      }
      {isLink ?
        <Link to={`/profile-caretaker/${user.email}`} style={{ textDecoration: "none"}}>
          {user.name} {user.surname}
        </Link> :
        <Text>
          {user.name} {user.surname}
        </Text>
      }
    </div>
  );
};

export default UserInfoPill;
