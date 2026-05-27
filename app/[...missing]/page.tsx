import { notFound, redirect } from "next/navigation";

type MissingRoutePageProps = {
  params: Promise<{
    missing?: string[];
  }>;
};

export default async function MissingRoutePage({
  params
}: MissingRoutePageProps) {
  const { missing = [] } = await params;
  const firstSegment = missing[0] ?? "";
  const lastSegment = missing[missing.length - 1] ?? "";

  if (
    firstSegment === "_next" ||
    firstSegment === "api" ||
    firstSegment === "assets" ||
    lastSegment.includes(".")
  ) {
    notFound();
  }

  redirect("/");
}
