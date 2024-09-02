import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { FaRegCopy, FaShareNodes, FaShare } from "react-icons/fa6";
import { storyScript, videoData } from "./data";
import TextContent from "./TextContent";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

function App() {
  const url = window.location.href;
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyUrl = () => {
    const text = window.location.href;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  const [videoId, setVideoId] = useState("");
  const [curVideo, setCurVideo] = useState({
    id: 0,
    video_url:
      "https://b95fc3df6c28147d85917ac2eb07e8b5.r2.cloudflarestorage.com/digiwaveshow2023/test_video.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Credential=2a50fe2e5bc44c0046d4d51730271ca0%2F20230919%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20230919T093333Z&X-Amz-Signature=3d5c8848a079f075a855429a04346dc5cfb6774b6212567640cda2bc17a91e76",
    image_url: "https://digiwave.tw/images/main_bg_2vh.jpg",
    StoryType: 0,
    qcht: [
      ["預設", "預設", "預設"],
      ["預設", "預設", "預設"],
      ["預設", "預設", "預設"],
    ],
    qen: [
      ["Default", "Default", "Default"],
      ["Default", "Default", "Default"],
      ["Default", "Default", "Default"],
    ],
  });
  useEffect(() => {
    // 从 URL 查询参数中获取 "v" 参数的值
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    // const video = videoData.find((item) => item.id === params.v);

    if (params.v) {
      setVideoId(params.v);
      const apiUrl = `https://expo.moondreamreality.com/api/digiwave_videos/${params.v}`;
      // const apiUrl = `https://expo.moondreamreality.com/api/digiwave_videos/8ko0Q90e2a`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // 处理从 API 获取的数据，例如设置 curVideo 状态
          setCurVideo(data);
        })
        .catch((error) => {
          // 处理请求错误
          console.error("Error fetching data:", error);
        });
    }
  }, [videoId]);

  if (!curVideo) {
    return (
      <div
        className="bg-[#1e2023] min-h-screen bg-cover bg-center bg-no-repeat z-10 relative bg-fixed flex justify-center items-center text-white"
        style={{
          backgroundImage: `url(${"https://moonshine.b-cdn.net/msweb/digiwave/main_bg01.jpg"})`,
        }}
      >
        <div className="bg-black fixed w-full h-screen -z-10 opacity-80 top-0 left-0"></div>
        id:{videoId}，沒有資料，請確認輸入的網址是否正確。
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-[#1e2023] min-h-screen bg-cover bg-center bg-no-repeat z-10 relative bg-fixed"
        style={{
          backgroundImage: `url(${"https://moonshine.b-cdn.net/msweb/digiwave/main_bg01.jpg"})`,
        }}
      >
        <div className="bg-black fixed w-full h-screen -z-10 opacity-80 top-0 left-0"></div>
        <div className="flex flex-col justify-center items-center p-6 ">
          <div className="w-full md:max-w-4xl">
            {videoId && (
              <div className="w-full  aspect-video drop-shadow-xl rounded-lg overflow-hidden">
                <ReactPlayer
                  url={
                    curVideo
                      ? curVideo.video_url
                      : "https://www.youtube.com/watch?v=kvKSi5_pnjk"
                  }
                  className="w-full "
                  width="100%"
                  height="100%"
                  controls={true}
                />
              </div>
            )}

            <div className="text-white my-3 rounded-sm space-y-4 ">
              <div className="text-sm font-normal text-white/90 leading-6">
                {curVideo && (
                  <TextContent
                    storyScript={storyScript}
                    data={curVideo}
                    type="zh"
                  />
                )}
              </div>

              <div className="text-sm font-normal text-white/90 leading-6">
                {curVideo && (
                  <TextContent
                    storyScript={storyScript}
                    data={curVideo}
                    type="en"
                  />
                )}
              </div>
            </div>

            <div className="flex w-full items-end gap-4 justify-end mt-14 border-t border-white/30 py-5">
              <Button
                onClick={handleOpen}
                color="white"
                className="flex items-center gap-3"
              >
                Share <FaShareNodes />
              </Button>
              <a href="https://digiwave.tw/" target="_blank">
                <Button className="flex items-center gap-3 " color="white">
                  Home <FaShare />
                </Button>
              </a>
            </div>
          </div>
        </div>
        <Dialog
          open={open}
          handler={handleOpen}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          className="bg-gray-900 text-white"
        >
          <DialogHeader className="text-white">Share.</DialogHeader>
          <DialogBody>
            <div className="flex gap-4 justify-center">
              <FacebookShareButton url={url}>
                <FacebookIcon size={40} round={true} />
              </FacebookShareButton>
              <LineShareButton url={url}>
                <LineIcon size={40} round={true} />
              </LineShareButton>
              <TwitterShareButton url={url}>
                <TwitterIcon size={40} round={true} />
              </TwitterShareButton>
              <div>
                <IconButton
                  className="rounded-full flex justify-between  relative"
                  color="white"
                  onClick={handleCopyUrl}
                >
                  <FaRegCopy size={15} />
                </IconButton>
                {isCopied && (
                  <div className=" absolute z-20  text-xs text-white mt-3">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="white"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
}

export default App;
