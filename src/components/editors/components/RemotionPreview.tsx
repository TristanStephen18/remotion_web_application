import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";

export interface RemotionPreviewHandle {
  play: () => void;
  pause: () => void;
  seekTo: (frame: number) => void;
  getCurrentFrame: () => number;
}

export interface RemotionPreviewProps {
  component: React.ComponentType<any>;
  inputProps: any;
  durationInFrames: number;
  compositionWidth: number;
  compositionHeight: number;
  fps: number;
  currentFrame?: number;
  isPlaying?: boolean;
  onFrameUpdate?: (frame: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  showPhoneFrame?: boolean;
  phoneFrameWidth?: string;
  phoneFrameHeight?: string;
  interactiveMode?: boolean;
}

export const RemotionPreview = forwardRef<RemotionPreviewHandle, RemotionPreviewProps>(
  (props, ref) => {
    const {
      component: Component,
      inputProps,
      durationInFrames,
      compositionWidth,
      compositionHeight,
      fps,
      showPhoneFrame = true,
      phoneFrameWidth = "100%",
      phoneFrameHeight = "100%",
      interactiveMode = false,
    } = props;

    const playerRef = useRef<PlayerRef>(null);

    useImperativeHandle(ref, () => ({
      play: () => {
        playerRef.current?.play();
      },
      pause: () => {
        playerRef.current?.pause();
      },
      seekTo: (frame: number) => {
        playerRef.current?.seekTo(frame);
      },
      getCurrentFrame: () => {
        return playerRef.current?.getCurrentFrame() ?? 0;
      },
    }));

    return (
      <div
        style={{
          width: phoneFrameWidth,
          height: phoneFrameHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showPhoneFrame ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "32px",
              overflow: "hidden",
              backgroundColor: "#000",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <Player
              ref={playerRef}
              component={Component}
              inputProps={inputProps}
              durationInFrames={durationInFrames}
              compositionWidth={compositionWidth}
              compositionHeight={compositionHeight}
              fps={fps}
              style={{
                width: "100%",
                height: "100%",
              }}
              controls={false}
              loop={false}
              clickToPlay={interactiveMode}
            />
          </div>
        ) : (
          <Player
            ref={playerRef}
            component={Component}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            fps={fps}
            style={{
              width: "100%",
              height: "100%",
            }}
            controls={false}
            loop={false}
            clickToPlay={interactiveMode}
          />
        )}
      </div>
    );
  }
);

RemotionPreview.displayName = "RemotionPreview";