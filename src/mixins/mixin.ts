import { getCurrentInstance, ref } from "vue";
import { LocationQueryRaw } from "vue-router";
import { RouterName } from "@/enums";

interface routerOptions {
  path?: string;
  query?: LocationQueryRaw;
}

export default function () {
  const { proxy } = getCurrentInstance();

  function routerManager(routerName: string | number, options: routerOptions) {
    switch (routerName) {
      case RouterName.Images:
      case RouterName.Comment:
      case RouterName.User:
      case RouterName.Collect:
        proxy.$router.push({ path: options.path, query: options.query });
        break;
      case RouterName.Home:
      case RouterName.SignIn:
      case RouterName.SignOut:
      case RouterName.Info:
      case RouterName.ItemList:
      case RouterName.Fund:
      case RouterName.Error:
      default:
        proxy.$router.push({ path: options.path });
        break;
    }
  }

  function goBack(step = -1) {
    proxy.$router.go(step);
  }

  return {routerManager, goBack };
}
