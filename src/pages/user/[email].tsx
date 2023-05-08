import Green from "@/components/utils/Green";
import Loading from "@/components/utils/Loading";
import White from "@/components/utils/White";
import Yellow from "@/components/utils/Yellow";
import { api } from "@/utils/api";
import { RedirectToUserProfile, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const UserPage = () => {
  const clerkUser = useUser();
  const router = useRouter();

  const profileQuery = api.user.getUserData.useQuery({
    email: router.query.email as string,
  });

  if (
    !clerkUser.isLoaded ||
    profileQuery.isLoading ||
    profileQuery.isFetching ||
    !profileQuery.data
  ) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!clerkUser.isSignedIn || !clerkUser.user.publicMetadata.isAdmin) {
    return <RedirectToUserProfile />;
  }

  const score = Math.floor(profileQuery.data.user.score / 50);
  const avgScore = Math.floor(profileQuery.data.avg._avg.score! / 50);
  const maxScore = Math.floor(profileQuery.data.avg._max.score! / 50);
  const minScore = Math.floor(profileQuery.data.avg._min.score! / 50);
  const virusLevel = profileQuery.data.user.virusLevel;
  const avgVirusLevel = Math.floor(profileQuery.data.avg._avg.virusLevel!);
  const maxVirusLevel = profileQuery.data.avg._max.virusLevel!;
  const minVirusLevel = profileQuery.data.avg._min.virusLevel!;
  const levelCleared = profileQuery.data.user.levelCleared;
  const avgLevelCleared = Math.floor(profileQuery.data.avg._avg.levelCleared!);
  const maxLevelCleared = profileQuery.data.avg._max.levelCleared!;
  const minLevelCleared = profileQuery.data.avg._min.levelCleared!;

  return (
    <main className="h-screen w-screen overflow-y-auto p-8">
      <p>
        <span className="mr-4 text-xl text-dead-green">&gt;</span>
        <Green>Email:</Green> <White>{profileQuery.data.user.email}</White>
        <br />
        <span className="mr-4 text-xl text-dead-green">&gt;</span>
        <Green>Score:</Green> <White>{profileQuery.data.user.score}</White>
        <br />
        <span className="mr-4 text-xl text-dead-green">&gt;</span>
        <Green>Virus Level:</Green>{" "}
        <White>{profileQuery.data.user.virusLevel}</White>
        <br />
        <span className="mr-4 text-xl text-dead-green">&gt;</span>
        <Green>Levels Cleared:</Green>{" "}
        <White>{profileQuery.data.user.levelCleared}</White>
        <br />
      </p>
      <div className="my-2 text-2xl">Graphs</div>
      <div>
        <div className="flex ">
          <span className="mr-4 text-xl text-dead-green">&gt;</span>
          <div className="text-xl text-dead-white-more">Score</div>
        </div>
        <div className="flex ">
          <span className="mr-4 text-xl text-dead-green">&gt;</span>
          <p>
            [<White>{"==".repeat(maxScore)}</White>] Max Score
            <br />[<Green>{"==".repeat(score)}</Green>
            {"--".repeat(maxScore - score)}] Your Score
            <br />[<Yellow>{"==".repeat(avgScore)}</Yellow>
            {"--".repeat(maxScore - avgScore)}] Average Score
            <br />
          </p>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex ">
          <span className="mr-4 text-xl text-dead-green">&gt;</span>
          <div className="text-xl text-dead-white-more">Virus Level</div>
        </div>
        <div className="flex ">
          <span className="mr-4 text-xl text-dead-green">&gt;</span>
          <p>
            [<White>{"==".repeat(minVirusLevel)}</White>
            {"--".repeat(10 - minVirusLevel)}] Least Virus Level
            <br />[<Green>{"==".repeat(virusLevel)}</Green>
            {"--".repeat(10 - virusLevel)}] Your Virus Level
            <br />[<Yellow>{"==".repeat(avgVirusLevel)}</Yellow>
            {"--".repeat(10 - avgVirusLevel)}] Average Virus Level
            <br />
          </p>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex ">
          <span className="mr-4 text-xl text-dead-green">&gt;</span>
          <div className="text-xl text-dead-white-more">Levels Cleared</div>
        </div>
        <div className="flex ">
          <span className="mr-4 text-xl text-dead-green">&gt;</span>
          <p>
            [<White>{"==".repeat(maxLevelCleared)}</White>
            {"--".repeat(maxLevelCleared - maxLevelCleared)}] Max Levels Cleared
            <br />[<Green>{"==".repeat(levelCleared)}</Green>
            {"--".repeat(maxLevelCleared - levelCleared)}] Your Last Level
            Cleared
            <br />[<Yellow>{"==".repeat(avgLevelCleared)}</Yellow>
            {"--".repeat(maxLevelCleared - avgLevelCleared)}] Average Levels
            Cleared
            <br />
          </p>
        </div>
      </div>
    </main>
  );
};

export default UserPage;
