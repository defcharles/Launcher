import { Stellar } from "@/stellar";
import { useAuthStore } from "@/zustand/AuthStore";
import BuildStore, { IBuild } from "@/zustand/BuildStore";
import { useRoutingStore } from "@/zustand/RoutingStore";
import { useToastStore } from "@/zustand/ToastStore";
import { window } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import { join } from "@tauri-apps/api/path";
import { sendNotification } from "@tauri-apps/plugin-notification";

export const handlePlay = async (selectedPath: string) => {
  const authState = useAuthStore.getState();
  const buildstate = BuildStore.getState();
  const { addToast } = useToastStore.getState();

  const path = selectedPath.replace("/", "\\");
  const access_token = authState.jwt;

  if (!access_token) {
    addToast("You are not authenticated!", "error");
    return false;
  }

  const exe = await join(
    selectedPath,
    "FortniteGame",
    "Binaries",
    "Win64",
    "FortniteClient-Win64-Shipping.exe"
  );

  const exists = (await invoke("check_file_exists", { path: exe }).catch(
    () => false
  )) as boolean;
  if (!exists) {
    addToast("Build does not exist / is corrupted!", "error");
    return false;
  }

  const build: IBuild | undefined = buildstate.builds.get(selectedPath);
  if (!build) {
    addToast(`Build with path ${selectedPath} not found!`, "error");
    return false;
  }

  try {
    BuildStore.setState((state) => {
      const builds = new Map(state.builds);
      const b = builds.get(selectedPath);
      if (b) {
        builds.set(selectedPath, { ...b, loading: true, open: false });
      }
      return { builds };
    });

    console.log(`launching ${build.version}...`);
    sendNotification({
      title: `Starting ${build.version}`,
      body: `This may take a while so please wait while the game loads!`,
      sound: "ms-winsoundevent:Notification.Default",
    });

    const Routing = useRoutingStore.getState();
    const r = Routing.Routes.get("oauth");
    let result = false;

    await Stellar.Requests.get<{ code: string }>((r?.url ?? "") + "/exchange", {
      Authorization: `bearer ${access_token}`,
    }).then(async (res) => {
      if (res.ok) {
        result = true;

        BuildStore.setState((state) => {
          const builds = new Map(state.builds);
          const b = builds.get(selectedPath);
          if (b) {
            builds.set(selectedPath, { ...b, loading: false, open: true });
          }
          return { builds };
        });

        await invoke("launch", {
          code: res.data.code,
          path: path,
        });

        window.getCurrentWindow().minimize();
      } else {
        console.log(res.data);
        addToast("Failed to authenticate with server", "error");
      }
    });

    return result;
  } catch (error) {
    console.error(`error launching ${build.version}:`, error);
    addToast(`Failed to launch ${build.version}!`, "error");

    BuildStore.setState((state) => {
      const builds = new Map(state.builds);
      const b = builds.get(selectedPath);
      if (b) {
        builds.set(selectedPath, { ...b, loading: false, open: false });
      }
      return { builds };
    });

    return false;
  }
};