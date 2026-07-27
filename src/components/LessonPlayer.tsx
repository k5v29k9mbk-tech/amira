"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import MuxPlayer from "@mux/mux-player-react";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { useRouter } from "@/i18n/navigation";
import { btnGhost, btnPrimary } from "@/lib/ui";

export function LessonPlayer({
  playbackId,
  token,
  title,
  poster,
}: {
  playbackId: string;
  token: string | null;
  title: string;
  poster: string;
}) {
  const t = useTranslations("learn");

  if (!playbackId) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center border border-line bg-surface bg-cover bg-center p-6 text-center text-sm text-muted"
        style={{ backgroundImage: `linear-gradient(rgba(11,11,12,.82), rgba(11,11,12,.82)), url(${poster})` }}
      >
        {t("videoSoon")}
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={token ? { playback: token } : undefined}
      metadata={{ video_title: title }}
      streamType="on-demand"
      accentColor="#b8974f"
      className="aspect-video w-full"
    />
  );
}

export function CompleteButton({
  courseSlug,
  lessonId,
  done,
  nextHref,
}: {
  courseSlug: string;
  lessonId: string;
  done: boolean;
  nextHref: string | null;
}) {
  const t = useTranslations("learn");
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug, lessonId, done: !done }),
    });
    setPending(false);
    router.refresh();
    if (!done && nextHref) router.push(nextHref);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={done ? btnGhost : btnPrimary}
    >
      {done ? (
        <CheckCircle size={17} weight="fill" className="text-accent" />
      ) : (
        <Circle size={17} weight="light" />
      )}
      {done ? t("completed") : t("markComplete")}
    </button>
  );
}
