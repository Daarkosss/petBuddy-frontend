import { observer } from "mobx-react-lite";
import store from "../store/RootStore";
import cx from "classnames";

const SplashScreen = observer(() => {
  return (
    <div className={cx("splash-screen", { done: !store.isStarting })}>
      <div className="spinner">
        <img src="/pet_buddy_logo.svg"/>
      </div>
    </div>
  )
}); 

export default SplashScreen;
