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
import icon_home from "./assets/icon_home.png";
import icon_share from "./assets/icon_share.png";
import web_bg from "./assets/web_bg.png";
import mb_bg from "./assets/mb_bg.png";
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

  const downloadFile = async (url, id, fileName, mediaType) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Origin: "*",
        Authorization: `${localStorage.getItem("idToken")}`,
      },
    })
      .then((res) => {
        const contentLength = res.headers.get("content-length");
        let loaded = 0;

        return new Response(
          new ReadableStream({
            start(controller) {
              const reader = res.body.getReader();

              read();
              function read() {
                reader.read().then((progressEvent) => {
                  if (progressEvent.done === true) {
                    controller.close();
                    return;
                  }
                  loaded += progressEvent.value.byteLength;
                  let downloadedPercent =
                    Math.round((loaded / contentLength) * 100) + "%";
                  // console.log(downloadedPercent);
                  controller.enqueue(progressEvent.value);
                  read();
                });
              }
            },
          })
        );
      })
      .then(async (response) => {
        const blob = await response.blob();
        const url1 = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url1;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url1);
      });
  };

  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState("w-[40%]");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      const aspectRatio = window.innerWidth / window.innerHeight;

      if (aspectRatio > 1.77) {
        // 16:9 寬螢幕比例或更寬
        setContainerWidth("w-[41%]");
        console.log("16:9");
      } else if (aspectRatio > 1.5) {
        // 1.5:1 比例
        setContainerWidth("w-[47%]");
        console.log("1.5:1");
      } else if (aspectRatio > 1.33) {
        // 4:3 比例
        setContainerWidth("w-[47%]");
        console.log("4:3");
      } else {
        // 更窄的比例
        setContainerWidth("w-[47%]");
        console.log("other");
      }
    };

    // 初次渲染時執行一次
    handleResize();

    // 監聽視窗大小變化
    window.addEventListener("resize", handleResize);

    // 清除事件監聽器
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!curVideo) {
    return (
      <div
        className="bg-[#1e2023] min-h-screen bg-cover bg-center bg-no-repeat z-10 relative bg-fixed flex justify-center items-center text-white"
        style={{
          backgroundImage: `url(${isMobile ? mb_bg : web_bg})`,
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
        className="bg-[#000] min-h-screen bg-contain bg-top bg-no-repeat z-10 relative bg-fixed"
        style={{
          backgroundImage: `url(${isMobile ? mb_bg : web_bg})`,
        }}
      >
        <div className="bg-black fixed w-full h-screen -z-10 opacity-10 top-0 left-0"></div>
        <div
          className={`flex flex-col items-center  h-screen   ${
            isMobile
              ? "h-screen px-6 -mt-5 justify-center"
              : "pt-[3%] justify-start "
          } `}
        >
          <div
            className={` ${isMobile ? "w-full" : `pt-[2%] ${containerWidth}`} `}
          >
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

            <div className="text-white my-5 rounded-sm space-y-4 ">
              <div
                className={`text-base font-normal text-white/90 leading-6 ${
                  isMobile
                    ? "pt-[3%] px-[3%]  leading-relaxed "
                    : "pt-[2%] px-[3%]"
                }`}
              >
                Hello 歡迎大家來到隆田chacha園區，
                體驗「四鐵迴憶、沈浸AI劇院」， 透過AI技術一銅搭乘時空列車，
                到未來的臺南500隆田chacha園區！
              </div>
              <div className={`flex w-full items-end gap-2 justify-end   `}>
                <div
                  className={`${
                    isMobile ? "w-2/3 pt-[4%]" : "w-[25%]"
                  }  flex ml-auto justify-end`}
                >
                  <div onClick={handleOpen} className=" cursor-pointer ">
                    <img src={icon_share} alt="" />
                  </div>
                  <div
                    className="btn-download"
                    onClick={() =>
                      downloadFile(
                        curVideo.video_url,
                        curVideo.id,
                        "video.mp4",
                        "video/mp4"
                      )
                    }
                  >
                    <img src={icon_home} alt="" />
                  </div>
                </div>
              </div>
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
