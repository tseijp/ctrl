import ctrl from "./index";
import { Config } from "./types";

export default function useCtrl<T extends Config>(config: T) {
  // const [ctrl] = useState(() => ctrl<T>(config), []);
  // return (ctrl.sub, ctrl.get, ctrl.get);
}
