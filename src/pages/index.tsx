import TerminalWrapper from "@/components/Terminal";
import TerminalInput from "@/components/TerminalInput";
import Green from "@/components/utils/Green";
import Loading from "@/components/utils/Loading";
import Red from "@/components/utils/Red";
import White from "@/components/utils/White";
import Yellow from "@/components/utils/Yellow";
import useTerminal from "@/hooks/terminal.hook";
import { api } from "@/utils/api";
import { useClerk, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const DIRECTORIES: any = {
  type: "folder",
  children: {
    home: {
      type: "folder",
      children: {
        virus: {
          type: "folder",
          children: {
            "openMe!": {
              type: "folder",
              children: {
                "0000000000100010.txt": {
                  type: "file",
                  contents: ".1641007",
                },
                "1111111110001010.txt": {
                  type: "file",
                  contents: ".6673609",
                },
                "help.txt": {
                  type: "file",
                  contents:
                    "When you convert binary to decimal(2's complement), combine all 4 numbers available, use the 2 numbers and you'll know where I live, you'll know what to search for, you'll be able!",
                },
              },
            },
            "lol.txt": {
              type: "file",
              contents: "looooollllll",
            },
          },
        },
        "openMe!": {
          type: "folder",
          children: {
            "key.txt": {
              type: "file",
              contents: "Aparecium!",
            },
          },
        },
        movies: {
          type: "folder",
          children: {
            "titanic.mp4": {
              type: "file",
            },
          },
        },
      },
    },
    downloads: {
      type: "folder",
      children: {
        "virus.exe": {
          type: "file",
        },
      },
    },
    "solution.txt": {
      type: "file",
      contents: "Bark!",
    },
    ".solution.txt": {
      type: "hidden",
      contents: "arvadekadava",
    },
  },
};

const Home: NextPage = () => {
  const { signOut } = useClerk();
  const clerkUser = useUser();
  const router = useRouter();

  const leaderboardQuery = api.user.getLeaderboard.useQuery();

  const profileQuery = api.user.get.useQuery({
    email: clerkUser.user!.primaryEmailAddress!.emailAddress,
  });
  const rankQuery = api.user.getRank.useQuery({
    email: clerkUser.user!.primaryEmailAddress!.emailAddress,
  });
  const saveGameMutation = api.user.saveGame.useMutation();

  const terminalActions = useTerminal({
    initialValue: [
      <div key={0}>
        Help me recover my <span className="text-dead-green">System</span>!
      </div>,
      "Enter `help` to view list of commands.",
    ],
    showAsError: (item) => <div className="text-dead-error">{item}</div>,
  });

  const {
    terminalItems,
    addTerminalItem,
    addTerminalError,
    addInputItem,
    clearTerminal,
  } = terminalActions;

  const [appState, setAppState] = useState<"default" | "game">("default");
  const [gameLevel, setGameLevel] = useState(0);
  const virusLimit = 10;
  const [virusLevel, setVirusLevel] = useState(1);
  const [pwd, setPWD] = useState("");
  const [mapFileOpened, setMapFileOpened] = useState({
    one: false,
    two: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  if (
    !clerkUser.isLoaded
    // profileQuery.isLoading ||
    // profileQuery.isFetching ||
    // rankQuery.isLoading ||
    // rankQuery.isFetching ||
    // leaderboardQuery.isLoading ||
    // leaderboardQuery.isFetching
  )
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );

  const showVirusLevel = (currLevel: number) => {
    setVirusLevel(currLevel);
    addTerminalItem(
      <div>
        <Yellow>current virus level: </Yellow>
        <White>[</White>
        <Red>{"==".repeat(currLevel)}</Red>
        <Green>{"--".repeat(virusLimit - currLevel)}</Green>
        <White>]</White>{" "}
        <Yellow>{Math.floor((currLevel * 100) / virusLimit)} %</Yellow>
      </div>
    );
    if (currLevel == virusLimit) {
      setAppState("default");
      addTerminalItem(
        <div>
          <Red>:</Red>You Lost!
        </div>
      );
      addTerminalItem(<Green>====== Game Over =====</Green>);
      saveGameMutation.mutate({
        virusLevel: currLevel,
        email: clerkUser.user!.primaryEmailAddress!.emailAddress,
        increment: gameLevel * 100 - Math.floor((currLevel * 100) / virusLimit),
        levelCleared: gameLevel,
      });
    }
  };

  const defaultCommandsMap: { [key: string]: () => Promise<void> } = {
    help: async () => {
      addTerminalItem(
        <div>
          Welcome to <White>Dead</White>
          <Green>Hunt</Green>!
          <br />
          List of commands:-
          <br />
          <Green>1-</Green> `<White>help</White>` <Green>-&gt;</Green> Displays
          list of possible commands.
          <br />
          <Green>2-</Green> `<White>clear</White>` <Green>-&gt;</Green> Clears
          the terminal.
          <br />
          <Green>3-</Green> `<White>logout</White>` <Green>-&gt;</Green> Logs
          you out of the app.
          <br />
          <Green>4-</Green> `<White>leaderboard</White>` <Green>-&gt;</Green>{" "}
          Displays the leaderboard.
          <br />
          <Green>5-</Green> `<White>rank</White>` <Green>-&gt;</Green> Displays
          your rank
          <br />
          <Green>6-</Green> `<White>play</White>` <Green>-&gt;</Green> Start
          your game!
          <br />
        </div>
      );
    },
    clear: async () => {
      clearTerminal();
    },
    "": async () => {},
    logout: async () => {
      await signOut();
    },
    rank: async () => {
      const { data: rank, isSuccess } = await rankQuery.refetch();
      if (isSuccess)
        addTerminalItem(
          <div>
            Your Rank: <Green>{rank}</Green>
          </div>
        );
    },
    restart: async () => {
      clearTerminal();
      const profile = await profileQuery.refetch();
      if (!profile.isSuccess) return;
      addTerminalItem(
        <Green>
          ====== Restarting Game - Previous Score({profile.data.score}) =====
        </Green>
      );
      setGameLevel(0);
      setPWD("");
      saveGameMutation.mutate({
        virusLevel: 1,
        email: clerkUser.user!.primaryEmailAddress!.emailAddress,
        increment: -profile.data.score,
        levelCleared: 0,
      });
      setAppState("game");
      setMapFileOpened({ one: false, two: false });
      addTerminalItem(
        <p>
          <Green>:</Green> Hello dear helper!
          <br />
          <Green>:</Green> My system which contains crucial documents related to
          world peace was hacked by some anonymous hacker!!!
          <br />
          <Green>:</Green> I have given remote access of my system to your{" "}
          <Green>Linux</Green>
          terminal.
          <br />
          <Green>:</Green> Please help me get rid of the virus before the hacker
          is able to access those documents.
          <br />
          <Green>:</Green> Luckily my system has a key which can disable the
          virus. But the hacker is a little playful and has hidden the key in
          his little puzzles and clues.
          <br />
          <Green>:</Green> The stake of the world is now in your hands! Good
          luck!
        </p>
      );

      addTerminalItem(
        <p>
          <Red>:</Red> Haha! I see he hired an online helper!
          <br />
          <Red>:</Red> Let&apos;s see if you can solve my riddles...
          <br />
          <Red>:</Red> All your efforts are gonna go waste.
          <br />
          <Red>:</Red> I don&apos;t really think you can even get close to
          defeating me... To make things easier for you, I will give hints when
          you ask for them. But remember, everything comes at a cost.
          <br />
          <Red>:</Red> Let&apos;s test your skills!! HahaHa!
          <br />
          <Red>:</Red> Starting clue:{" "}
          <White>
            &quot;Why do you wanna go home? Why are you in such a hurry?
            Can&apos;t find what you&apos;re looking for? Maybe you wanna change
            the directory?&quot;
          </White>
        </p>
      );
      showVirusLevel(1);
    },
    play: async () => {
      clearTerminal();
      const profile = await profileQuery.refetch();
      if (!profile.isSuccess) return;
      let actualVirusLevel = 1;
      let actualLevelCleared = 0;
      if (profile.data.levelCleared >= 6) {
        addTerminalItem(
          <div>
            <White>
              You have already cleared all levels. Your score ={" "}
              {profile.data.score}
            </White>
            <br />
            Use `restart` to play again.
          </div>
        );
        return;
      } else if (profile.data.virusLevel === virusLimit) {
        addTerminalItem(
          <Green>
            ====== Restarting Game - Previous Score({profile.data.score}) =====
          </Green>
        );
        setGameLevel(0);
        setMapFileOpened({ one: false, two: false });
        setPWD("");
        saveGameMutation.mutate({
          virusLevel: 1,
          email: clerkUser.user!.primaryEmailAddress!.emailAddress,
          increment: -profile.data.score,
          levelCleared: 0,
        });
      } else {
        addTerminalItem(
          <Green>
            ====== Game Started - Level: {profile.data.levelCleared} =====
          </Green>
        );
        setGameLevel(profile.data.levelCleared);
        actualLevelCleared = profile.data.levelCleared;
        actualVirusLevel = profile.data.virusLevel;
      }
      setAppState("game");
      if (actualLevelCleared === 0) {
        addTerminalItem(
          <p>
            <Green>:</Green> Hello dear helper!
            <br />
            <Green>:</Green> My system which contains crucial documents related
            to world peace was hacked by some anonymous hacker!!!
            <br />
            <Green>:</Green> I have given remote access of my system to your{" "}
            <Green>Linux</Green>
            terminal.
            <br />
            <Green>:</Green> Please help me get rid of the virus before the
            hacker is able to access those documents.
            <br />
            <Green>:</Green> Luckily my system has a key which can disable the
            virus. But the hacker is a little playful and has hidden the key in
            his little puzzles and clues.
            <br />
            <Green>:</Green> The stake of the world is now in your hands! Good
            luck!
          </p>
        );

        addTerminalItem(
          <p>
            <Red>:</Red> Haha! I see he hired an online helper!
            <br />
            <Red>:</Red> Let&apos;s see if you can solve my riddles...
            <br />
            <Red>:</Red> All your efforts are gonna go waste.
            <br />
            <Red>:</Red> I don&apos;t really think you can even get close to
            defeating me... To make things easier for you, I will give hints
            when you ask for them. But remember, everything comes at a cost.
            <br />
            <Red>:</Red> Let&apos;s test your skills!! HahaHa!
            <br />
            <Red>:</Red> Starting clue:{" "}
            <White>
              &quot;Why do you wanna go home? Why are you in such a hurry?
              Can&apos;t find what you&apos;re looking for? Maybe you wanna
              change the directory?&quot;
            </White>
          </p>
        );
      }
      showVirusLevel(actualVirusLevel);
    },
    leaderboard: async () => {
      const { data: users, isSuccess } = await leaderboardQuery.refetch();
      if (isSuccess)
        addTerminalItem(
          <p>
            <div className="text-underline w-full text-center">
              ========== <Yellow>Leaderboard</Yellow> ==========
            </div>
            <table>
              <thead>
                <tr>
                  <th>
                    <White>Rank</White>
                  </th>
                  <th className="px-8">
                    <White>Email</White>
                  </th>
                  <th>
                    <White>Score</White>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => {
                  return (
                    <tr key={i}>
                      <td>{i}.</td>
                      <td className="px-8">
                        <White>{user.email}</White>
                      </td>
                      <td className="text-end">
                        <Green>{user.score}</Green>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </p>
        );
    },
  };

  const adminCommandsMap: { [key: string]: (cmd: string) => Promise<void> } = {
    visit: async (cmd: string) => {
      const email = cmd.split(" ")[1] as string;
      await router.push(`/user/${email}`);
    },
  };
  const gameCommandsMap: { [key: string]: (cmd: string) => Promise<void> } = {
    exit: async () => {
      addTerminalItem(<Green>====== Game Paused =====</Green>);
      setAppState("default");
    },
    hint: async () => {
      if (gameLevel === 0) {
        addTerminalItem(
          <div>
            <Green>Hint: </Green>
            <White>Shout &quot;help&quot;!</White>
          </div>
        );
        showVirusLevel(virusLevel + 1);
      } else if (gameLevel === 1) {
        addTerminalItem(
          <div>
            <Green>Hint: </Green>
            <White>What cute animal displays file contents ? </White>
          </div>
        );
        showVirusLevel(virusLevel + 1);
      } else if (gameLevel === 2 || gameLevel === 3) {
        addTerminalItem(
          <div>
            <Green>Hint: </Green>
            <White>What Hills? </White>
          </div>
        );
        showVirusLevel(virusLevel + 1);
      } else if (gameLevel === 4) {
        addTerminalItem(
          <div>
            <Green>Hint: </Green>
            <White>I am more of a dog person! </White>
          </div>
        );
        showVirusLevel(virusLevel + 1);
      }
    },
    help: async () => {
      addTerminalItem(
        <p>
          List of commands:-
          <br />
          <Green>1-</Green> `<Yellow>help</Yellow>` <Green>-&gt;</Green>{" "}
          Displays list of possible commands.
          <br />
          <Green>2-</Green> `<Yellow>hint</Yellow>` <Green>-&gt;</Green> Get a
          hint.
          <br />
          <Green>3-</Green> `<Yellow>clear</Yellow>` <Green>-&gt;</Green> Clears
          the terminal
          <br />
          <Green>4-</Green> `<Yellow>ls</Yellow>` <Green>-&gt;</Green> Displays
          list of files & directories.
          <br />
          <Green>5-</Green> `<Yellow>cd [directory name]</Yellow>`{" "}
          <Green>-&gt;</Green> Change directory
          <br />
          <Green>6-</Green> `<Yellow>cd ..</Yellow>` <Green>-&gt;</Green> Go
          back to previous directory
          <br />
          <Green>7-</Green> `<Yellow>pwd</Yellow>` <Green>-&gt;</Green> Display
          the current directory.
          <br />
        </p>
      );
    },
    pwd: async () => {
      addTerminalItem(<div>{pwd}</div>);
    },
    ls: async (cmd: string) => {
      const nested = pwd.split("/");
      let currPath = DIRECTORIES;
      for (const item of nested) {
        if (
          item.length &&
          currPath.type === "folder" &&
          currPath.children[item] &&
          currPath.children[item].type === "folder"
        )
          currPath = currPath.children[item];
        else break;
      }
      if (pwd === "" && cmd.split(" ")[1] === "-a" && gameLevel < 4) {
        setGameLevel(4);
        addTerminalItem(<Green>====== Level 4 Cleared =====</Green>);
        saveGameMutation.mutate({
          virusLevel: virusLevel,
          email: clerkUser.user!.primaryEmailAddress!.emailAddress,
          increment: 400 - Math.floor((virusLevel * 100) / virusLimit),
          levelCleared: 4,
        });
      }
      if (currPath.type === "folder")
        addTerminalItem(
          <div>
            {Object.keys(currPath.children).map((v, i) => {
              if (currPath.children[v].type === "hidden") {
                if (cmd.split(" ")[1] === "-a")
                  return (
                    <div key={i}>
                      <White>{v}</White>
                    </div>
                  );
                else return <></>;
              }
              return (
                <div key={i}>
                  {currPath.children[v].type === "folder" ? (
                    <Yellow>{v}</Yellow>
                  ) : (
                    v
                  )}
                </div>
              );
            })}
          </div>
        );
    },
    cd: async (cmd: string) => {
      const path = cmd.split(" ")[1] as string;
      if (!path) return;

      let newPath = pwd;
      if (path === ".." && pwd != "") {
        const x = pwd.split("/");
        x.pop();
        newPath = x.join("/");
      } else if (path === "/") newPath = "";
      else if (path[0] === "/") {
        if (pwd === "") newPath = path.slice(1);
        else newPath = pwd + "/" + path.slice(1);
      } else {
        if (pwd === "") newPath = path;
        else newPath = pwd + "/" + path;
      }

      const nested = newPath.split("/");
      newPath = "";
      const pathArray = [];
      let currPath = DIRECTORIES;
      for (const item of nested) {
        if (
          item.length &&
          currPath.type === "folder" &&
          currPath.children[item] &&
          currPath.children[item].type === "folder"
        ) {
          currPath = currPath.children[item];
          pathArray.push(item);
        } else break;
      }
      newPath = pathArray.join("/");

      if (newPath.split("/")[0] === "home" && gameLevel === 0) {
        setGameLevel(1);
        addTerminalItem(<Green>====== Level 1 Cleared =====</Green>);
        saveGameMutation.mutate({
          virusLevel: virusLevel,
          email: clerkUser.user!.primaryEmailAddress!.emailAddress,
          increment: 100 - Math.floor((virusLevel * 100) / virusLimit),
          levelCleared: 1,
        });
      }
      if (newPath === "home/virus") {
        showVirusLevel(virusLevel + 1);
      }
      addTerminalItem(<div>{newPath}</div>);
      setPWD(newPath);
    },
    clear: async () => {
      clearTerminal();
    },
    cat: async (cmd: string) => {
      const path = cmd.split(" ")[1] as string;
      if (!path) return;

      let filePath = pwd;

      if (path[0] === "/") {
        if (pwd === "") filePath = path.slice(1);
        else filePath = pwd + "/" + path.slice(1);
      } else {
        if (pwd === "") filePath = path;
        else filePath = pwd + "/" + path;
      }

      const nested = filePath.split("/");
      filePath = "";
      const pathArray = [];
      let currPath = DIRECTORIES;
      for (const item of nested) {
        if (
          item.length &&
          currPath.type === "folder" &&
          currPath.children[item]
        ) {
          currPath = currPath.children[item];
          pathArray.push(item);
        } else break;
      }
      if (currPath.type !== "file" || !currPath.contents) return;
      filePath = pathArray.join("/");

      if (
        filePath === "home/virus/openMe!/1111111110001010.txt" &&
        gameLevel < 3 &&
        !mapFileOpened.one
      ) {
        setMapFileOpened((_) => ({ ..._, one: true }));
        const newGameLevel = gameLevel + 1;
        setGameLevel(newGameLevel);
        addTerminalItem(
          <Green>====== Level {newGameLevel} Cleared =====</Green>
        );
        saveGameMutation.mutate({
          virusLevel: virusLevel,
          email: clerkUser.user!.primaryEmailAddress!.emailAddress,
          increment: 200 - Math.floor((virusLevel * 100) / virusLimit),
          levelCleared: newGameLevel,
        });
      } else if (
        filePath === "home/virus/openMe!/0000000000100010.txt" &&
        gameLevel < 3 &&
        !mapFileOpened.two
      ) {
        setMapFileOpened((_) => ({ ..._, two: true }));
        const newGameLevel = gameLevel + 1;
        setGameLevel(newGameLevel);
        addTerminalItem(
          <Green>====== Level {newGameLevel} Cleared =====</Green>
        );
        saveGameMutation.mutate({
          virusLevel: virusLevel,
          email: clerkUser.user!.primaryEmailAddress!.emailAddress,
          increment: 200 - Math.floor((virusLevel * 100) / virusLimit),
          levelCleared: newGameLevel,
        });
      }

      addTerminalItem(
        <div>
          {filePath}
          <br />
          {currPath.contents}
        </div>
      );
    },
    dog: async (cmd: string) => {
      const path = cmd.split(" ")[1] as string;
      if (!path) return;

      let filePath = pwd;

      if (path[0] === "/") {
        if (pwd === "") filePath = path.slice(1);
        else filePath = pwd + "/" + path.slice(1);
      } else {
        if (pwd === "") filePath = path;
        else filePath = pwd + "/" + path;
      }

      const nested = filePath.split("/");
      filePath = "";
      const pathArray = [];
      let currPath = DIRECTORIES;
      for (const item of nested) {
        if (
          item.length &&
          currPath.type === "folder" &&
          currPath.children[item]
        ) {
          currPath = currPath.children[item];
          pathArray.push(item);
        } else break;
      }
      if (currPath.type !== "hidden" || !currPath.contents) return;
      filePath = pathArray.join("/");

      if (filePath === ".solution.txt" && gameLevel < 5) {
        setGameLevel(5);
        addTerminalItem(<Green>====== Level 5 Cleared =====</Green>);
        saveGameMutation.mutate({
          virusLevel: virusLevel,
          email: clerkUser.user!.primaryEmailAddress!.emailAddress,
          increment: 300 - Math.floor((virusLevel * 100) / virusLimit),
          levelCleared: 5,
        });
      }

      addTerminalItem(
        <div>
          {filePath}
          <br />
          {currPath.contents}
        </div>
      );
    },
    avadakedavra: async () => {
      setGameLevel(6);

      saveGameMutation.mutate({
        virusLevel: virusLevel,
        email: clerkUser.user!.primaryEmailAddress!.emailAddress,
        increment: 400 - Math.floor((virusLevel * 100) / virusLimit),
        levelCleared: 6,
      });
      addTerminalItem(
        <div>
          <Green>====== Level 6 Cleared =====</Green>
          <br />
          <White>The virus has been killed!</White>
          <br />
          System Restored successfully!
          <br />
          <Green>====== Game Finished! =====</Green>
        </div>
      );

      setAppState("default");
    },
  };

  return (
    <>
      <Head>
        <title>DeadHunt</title>
        <meta name="description" content="DeadHunt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TerminalWrapper inputRef={inputRef} terminalItems={terminalItems}>
        <TerminalInput
          inputRef={inputRef}
          terminalActions={terminalActions}
          keyActionMap={{}}
          appState={appState}
          stateInputTypeMap={{
            default: "text",
          }}
          stateActionMap={{
            default: async (e, value) => {
              addInputItem(value);
              addTerminalItem(value);
              if (!defaultCommandsMap[value]) {
                const mainCmd = value.split(" ")[0]!;
                if (
                  clerkUser.user?.publicMetadata.isAdmin &&
                  adminCommandsMap[mainCmd]
                ) {
                  adminCommandsMap[mainCmd]!(value);
                } else addTerminalError("Command not found :/ . Use `help`. ");
              } else defaultCommandsMap[value]!();
            },
            game: async (e, value) => {
              addInputItem(value);
              addTerminalItem(value);
              const mainCmd = value.split(" ")[0]!;
              if (gameCommandsMap[mainCmd]) gameCommandsMap[mainCmd]!(value);
            },
          }}
        />
      </TerminalWrapper>
    </>
  );
};

export default Home;
