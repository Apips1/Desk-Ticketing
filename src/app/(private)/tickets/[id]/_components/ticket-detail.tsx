"use client";
import {
  Attachment,
  ResponseDetailTicket,
} from "@/app/_types/ticket/response-detail-ticket";
import {
  ListCommentData,
  ResponseListComment,
} from "@/app/_types/ticket/response-list-comment";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Input,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { DateTime } from "luxon";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiArrowUp, HiCheck, HiTrash, HiUserCircle } from "react-icons/hi";

import { LuClock, LuSearch } from "react-icons/lu";
import {
  RiArrowLeftLine,
  RiAttachment2,
  RiHistoryLine,
  RiSendPlane2Line,
} from "react-icons/ri";
import ImageViewModal from "./image-view-modal";
import { ChangeEvent, Fragment, ReactNode } from "react";
import { ResponseUploadAttachment } from "@/app/_types/ticket/response-upload-attachment";
import PauseResume from "./pause-resume";
import { ResponseAttachment } from "@/app/_types/ticket/response-attachment";
import {
  IoArrowBackCircleOutline,
  IoPauseOutline,
  IoPlayOutline,
  IoSearchCircleOutline,
} from "react-icons/io5";
import { FiArrowLeftCircle } from "react-icons/fi";
import { BiStopwatch } from "react-icons/bi";
import { useRouter } from "next/navigation";

interface DetailProps {
  params: string;
}

type FileList = {
  url: string;
  size: number;
  fileName: string;
  id: string;
  isUploaded: boolean;
  file: File;
};

type Status = {
  id: string;
  name: string;
};

export default function TicketDetail(props: DetailProps) {
  const limit = 5;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [time, setTime] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [attachment, setAttachment] = useState<Attachment>({
    id: "",
    size: 0,
    url: "",
    name: "",
    type: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    sort: "createdAt",
    dir: "desc",
  });
  const { control, handleSubmit, setValue, setError } = useForm<{
    comment: string;
  }>({
    mode: "all",
  });
  const router = useRouter();
  const [comment, setComment] = useState<ListCommentData[]>([]);
  const [fileList, setFileList] = useState<FileList[]>([]);
  const [selectedAttachments, setSelectedAttachment] = useState<string>("");

  const handleClickBack = () => {
    router.push("/tickets");
  };

  useEffect(() => {
    setComment([]);
  }, []);

  const {
    data: detail,
    isLoading,
    isFetching,
    refetch,
  } = useHttp<ResponseDetailTicket>(`/agent/ticket/detail/${props.params}`);

  useEffect(() => {
    if (detail?.data?.logTime?.status === "running") {
      const pauseHistory = detail.data?.logTime.pauseHistory;
      const lastPause = pauseHistory[pauseHistory.length - 1];
      const startTime = lastPause?.resumedAt ?? detail.data?.logTime.startAt;
      const timeDiff =
        dateDiff(startTime, DateTime.now().toString(), "seconds") ?? 0;
      setTime(typeof timeDiff === "number" ? timeDiff * 1000 : 0);
      setIsTracking(true);
    } else if (detail?.data?.logTime?.status === "paused") {
      setTime(detail.data?.logTime.durationInSeconds);
      setIsTracking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isTracking && !isFetching) {
      intervalId = setInterval(
        () => setTime((prevTime) => prevTime + 1000),
        1000,
      );
    }
    return () => clearInterval(intervalId);
  }, [isTracking, isFetching]);

  const data = useMemo(() => {
    if (detail?.data?.status == "open") {
      return [
        {
          id: "open",
          name: "Open",
        },
        {
          id: "in_progress",
          name: "In Progress",
        },
      ];
    } else if (
      detail?.data?.status == "in_progress" ||
      detail?.data?.status == "resolve"
    ) {
      return [
        {
          id: "resolve",
          name: "Resolve",
        },
        {
          id: "in_progress",
          name: "In Progress",
        },
      ];
    } else if (detail?.data?.status == "close") {
      return [
        {
          id: "close",
          name: "Close",
        },
      ];
    }
  }, [detail]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (e.target.files) {
      var data = await Promise.all(
        Array.from(e.target.files).map((item) => {
          const file = item;

          if (file.size > MAX_FILE_SIZE) {
            toast.error(`File ${file.name} is too large. Maximum size is 2 MB`);
            return null;
          }

          return {
            file,
            url: URL.createObjectURL(file),
            size: file.size,
            fileName: `Attachment-${DateTime.now().toMillis().toString()}`,
            id: "",
            isUploaded: false,
          };
        }),
      );

      data = data?.filter((item) => item !== null);

      if (data?.length > 0) {
        setFileList((prev) => [
          ...prev,
          ...(data?.filter((item) => item !== null) as FileList[]),
        ]);
        onUploadAttachment(data?.filter((item) => item !== null) as FileList[]);
      }
    }
  };

  const onUploadAttachment = (data: FileList[]) => {
    data?.map((item) => {
      if (!item.isUploaded) {
        const formData = new FormData();
        formData?.append("file", item.file);
        formData?.append("title", item.fileName);
        uploadAttachment(formData);
      }
    });
  };

  const onDeleteItem = (index: number) => {
    var list = [...fileList];
    list.splice(index, 1);
    setFileList(list);
  };

  const { mutate: uploadAttachment } =
    useHttpMutation<ResponseUploadAttachment>("/agent/attachment/upload", {
      method: "POST",
      queryOptions: {
        onSuccess: (data) => {
          toast.success("Attachment uploaded");
          setFileList((prev) =>
            prev.map((item) =>
              item.fileName === data?.data?.name
                ? { ...item, isUploaded: true, id: data?.data?.id }
                : item,
            ),
          );
        },
        onError: (e) => {
          console.log(e);
          toast.error(e.data?.message);
        },
      },
    });

  const { mutate: submitComment, isPending } = useHttpMutation(
    "/agent/ticket/comments/add",
    {
      method: "POST",
      queryOptions: {
        onSuccess: (data) => {
          setSelectedStatus("");
          setComment(() => []);
          setPagination((prev) => ({
            ...prev,
            limit: pagination.limit + 1,
          }));
          setValue("comment", "");
          setFileList([]);
          refetchComments();
          refetch();
          toast.success("Comment submitted");
        },
        onError: (e) => {
          toast.error(e.data?.message);
        },
      },
    },
  );

  const { mutate: getAttachment, isPending: isPendingAttachment } =
    useHttpMutation<ResponseAttachment>(
      `/agent/attachment/detail/${selectedAttachments}`,
      {
        method: "GET",
        queryOptions: {
          onSuccess: (data) => {
            setAttachment({
              id: data?.data?.id,
              size: data?.data?.size,
              url: data?.data?.url,
              name: data?.data?.name,
              type: data?.data?.type,
            });
            setOpen(true);
          },
          onError: (e) => {
            toast.error(e.data?.message);
          },
        },
      },
    );

  const {
    data: comments,
    isLoading: loadingComment,
    refetch: refetchComments,
  } = useHttp<ResponseListComment>(
    `/agent/ticket/comments/list/${props.params}`,
    { params: pagination },
  );

  const { mutate: pauseMutate, isPending: isPendingPause } = useHttpMutation(
    "/agent/ticket/logging/pause",
    {
      method: "POST",
      queryOptions: {
        onSuccess: () => {
          refetch();
          setTime(0);
        },
        onError: (e) => {
          toast.error(e.data?.message);
          refetch();
          setTime(0);
        },
      },
    },
  );

  const { mutate: resumeMutate, isPending: isPendingResume } = useHttpMutation(
    "/agent/ticket/logging/resume",
    {
      method: "POST",
      queryOptions: {
        onSuccess: () => {
          refetch();
        },
        onError: (e) => {
          toast.error(e.data?.message);
          refetch();
        },
      },
    },
  );

  useEffect(() => {
    var dataComment: ListCommentData[] = comments?.data?.list ?? [];
    if (dataComment) {
      let reversed = dataComment.reverse();
      setComment(() => reversed);
      return;
    }
  }, [comments]);

  const onSubmit = handleSubmit((data) => {
    if (data?.comment === "") {
      toast.error("Comment cannot be empty");
      setError("comment", { message: "Comment cannot be empty" });
      return;
    }
    if (selectedStatus === "") {
      toast.error("Please select status");
      return;
    }
    let arr: string[] = [];
    if (fileList.length > 0) {
      arr = fileList.map((item) => item.id);
    }
    submitComment({
      ticketId: detail?.data?.id,
      content: data?.comment,
      attachIds: arr,
      status: selectedStatus,
    });
  });

  const onLoadMore = () => {
    setPagination((prev) => ({ ...prev, limit: prev.limit + limit }));
  };

  const secondsToHms = (d: number) => {
    const hours = Math.floor(d / 3600);
    const minutes = Math.floor((d % 3600) / 60);
    const seconds = Math.floor(d % 60);
    const formatTime = (unit: number) => (unit < 10 ? `0${unit}` : unit);
    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  };

  const dateDiff = (
    date?: string,
    endDate: string = DateTime.now().toString(),
    type: string = "diff",
  ) => {
    const now = endDate ? DateTime.fromISO(endDate) : DateTime.now();
    const created = DateTime.fromISO(date ?? now.toString());
    const diff = now
      .diff(created, ["second", "minutes", "hours", "days"])
      .toObject();

    if (type === "seconds") {
      return Math.floor(diff.seconds ?? 0);
    }

    if (type !== "diff") {
      return `${Math.floor(diff.hours ?? 0)}h : ${Math.floor(diff.minutes ?? 0)}m : ${Math.floor(diff.seconds ?? 0)}s`;
    }

    if ((diff.days ?? 0) > 2) {
      return created.toFormat("DDDD");
    } else if (diff.days) {
      return `${Math.floor(diff.days)} day(s) ago`;
    } else if (diff.hours) {
      return `${Math.floor(diff.hours)} hour(s) ago`;
    } else if (diff.minutes) {
      return `${Math.floor(diff.minutes)} minute(s) ago`;
    } else if (diff.seconds) {
      return `${Math.floor(diff.seconds)} second(s) ago`;
    }
    return "Just now";
  };

  const renderStatus = (status: string) => {
    let color = "";
    switch (status) {
      case "open":
        color = "bg-green-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
        break;
      case "resolve":
        color = "bg-orange-400";
        break;
      case "cancel":
        color = "bg-red-400";
        break;
      default:
        color = "bg-blue-500";
    }
    return (
      <Chip
        startContent={
          <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
        }
        className="capitalize"
        size="sm"
        variant="bordered"
      >
        {detail?.data?.status.replace("_", " ")}
      </Chip>
    );
  };

  const renderComment = useCallback(() => {
    return (
      <>
        {comment?.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-slate-100 border-slate-200 border-[1px] rounded-md p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HiUserCircle size={25} className="text-gray-400" />
                  <div>
                    <p className="font-semibold text-xs text-default-600">
                      {item.sender == "agent"
                        ? item.agent.name
                        : item.customer.name}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {DateTime.fromISO(item.createdAt ?? DateTime.now().toString())
                    .toLocal()
                    .toFormat("dd LLL yyyy, HH:mm")}
                </p>
              </div>
              <p className="text-xs text-slate-600 pl-3 whitespace-break-spaces">
                {item.content}
              </p>
              {item.attachments.length > 0 && (
                <>
                  <Divider />
                  <div className="space-y-1 mt-1">
                    {item.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex justify-start items-center p-1 space-x-2"
                      >
                        <p className="text-xs text-slate-600">
                          {attachment.name}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          {attachment.size} Kb
                        </p>
                        <div
                          onClick={() => {
                            setSelectedAttachment(attachment.id);
                            getAttachment({});
                          }}
                          role="button"
                          className="text-success-600 text-xs font-semibold"
                        >
                          View
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </>
    );
  }, [comment, getAttachment]);

  const renderStatusSelection = (status: Status) => {
    let color = "";
    switch (status.id) {
      case "open":
        color = "bg-green-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
        break;
      case "resolve":
        color = "bg-orange-400";
        break;
      default:
        color = "bg-blue-500";
    }
    return (
      <Fragment key={status.id}>
        <Chip
          onClick={() => {
            if (status.id == selectedStatus) {
              setSelectedStatus("");
              return;
            }
            setSelectedStatus(status.id);
          }}
          startContent={
            <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
          }
          endContent={
            status.id == selectedStatus && (
              <div className="ml-1 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
                <HiCheck className="h-3 w-3 text-white" />
              </div>
            )
          }
          className="capitalize"
          size="sm"
          variant="bordered"
          color={status.id == selectedStatus ? "primary" : "default"}
        >
          {status.name}
        </Chip>
      </Fragment>
    );
  };

  const renderTime = useCallback(
    (props: { children: ReactNode }) => {
      const hours = Math.floor(Math.abs(time / 3600000));
      const minutes = Math.floor(Math.abs((time % 3600000) / 60000));
      const seconds = Math.floor(Math.abs((time % 60000) / 1000));
      const formatTime = (unit: number) => (unit < 10 ? `0${unit}` : unit);
      return (
        <div className="p-3 bg-slate-100 rounded-lg flex justify-between items-center w-full">
          <div className="flex items-center">
            <LuClock />
            {isTracking ? (
              <p className="font-semibold text-md font-mono ml-3">{`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</p>
            ) : (
              <p className="font-semibold text-md font-mono ml-3">
                {secondsToHms(detail?.data?.logTime.durationInSeconds ?? 0)}
              </p>
            )}
          </div>
          {props.children}
        </div>
      );
    },
    [time, detail?.data?.logTime.durationInSeconds, isTracking],
  );

  const [messages, setMessages] = useState<any[]>([]);

  const handleSent = (evt: React.KeyboardEvent) => {
    if (evt.key !== "Enter") return;
    const target = evt.target as HTMLInputElement;
    const message = target.value;

    setMessages((val) => [
      ...val,
      { isSent: val.length % 2 == 0, message, createdAt: new Date() },
    ]);

    setTimeout(() => {
      target.value = "";
      const el = document.querySelector(".message-body");
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 10);
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto flex space-x-2">
        <Spinner size="sm" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          href="/tickets"
          onClick={() => router.push("/tickets")}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">Ticket Detail</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {false ? (
          <Card shadow="sm">
            <CardBody>
              <p className="font-semibold text-lg">{detail?.data?.subject}</p>
              <p className="text-gray-500 text-sm">
                Ticket ID:{" "}
                <span className="font-semibold">{detail?.data?.code}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Created on{" "}
                {DateTime.fromISO(
                  detail?.data?.createdAt ?? DateTime.now().toString(),
                )
                  .toLocal()
                  .toFormat("dd MMM yyyy, HH:mm")}
              </p>
              {detail?.data?.logTime.durationInSeconds != 0 &&
                detail?.data?.logTime.status == "running" && (
                  <p className="text-xs">
                    Total tracked time{" "}
                    <span className="font-semibold text-xs font-mono ml-3">
                      {secondsToHms(
                        detail?.data?.logTime.durationInSeconds ?? 0,
                      )}
                    </span>
                  </p>
                )}
              <div className="relative z-50 pt-5">
                {detail?.data?.logTime.status == "not_started" && (
                  <div className="flex items-center">
                    <LuClock />
                    <p className="ml-1 text-sm">
                      Start tracking the time you spend on this ticket
                    </p>
                  </div>
                )}
                {["paused", "running"].includes(
                  detail?.data?.logTime.status || "",
                ) && (
                  <div className="flex w-full">
                    {renderTime({
                      children: (
                        <div className="flex gap-2.5">
                          <PauseResume
                            isPaused={
                              detail?.data?.logTime?.status === "paused"
                            }
                            ticketId={detail?.data?.id || ""}
                            durationTotal={
                              detail?.data?.logTime?.durationInSeconds || 0
                            }
                            isPending={isPendingPause || isPendingResume}
                            onPause={() => {
                              pauseMutate({
                                id: detail?.data?.id || "",
                              });
                            }}
                            onResume={() => {
                              resumeMutate({
                                id: detail?.data?.id || "",
                              });
                            }}
                            hidePauseResume={false}
                          />
                        </div>
                      ),
                    })}
                  </div>
                )}
                {detail?.data?.logTime.status == "done" && (
                  <div className="p-3 bg-slate-100 rounded-lg flex justify-between items-center">
                    <p className="text-sm">
                      Total time tracked{" "}
                      <span className="font-semibold text-md font-mono ml-3">
                        {secondsToHms(
                          detail?.data?.logTime.durationInSeconds ?? 0,
                        )}
                      </span>
                    </p>
                    <PauseResume
                      isPaused={false}
                      ticketId={detail?.data?.id || ""}
                      isPending={false}
                      durationTotal={
                        detail?.data?.logTime?.durationInSeconds || 0
                      }
                      onPause={() => {}}
                      onResume={() => {}}
                      hidePauseResume={true}
                    />
                  </div>
                )}
              </div>
              <div className="pt-5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <HiUserCircle size={40} className="text-gray-400" />
                    <div>
                      <p className="font-semibold text-default-600">
                        {detail?.data?.customer.name}
                      </p>
                      <p className="text-xs text-default-500">
                        {detail?.data?.customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <p className="text-sm">
                      Open {dateDiff(detail?.data?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative z-0 pt-3">
                <div className="p-3 rounded-lg">
                  <p className="text-sm text-gray-500">
                    {detail?.data?.content}
                  </p>
                </div>
                <div className="px-4 space-y-2">
                  {(detail?.data?.attachments.length ?? 0) > 0 && (
                    <>
                      <p className="text-xs">Attachments</p>
                      <div className="grid grid-cols-3 gap-1">
                        {detail?.data?.attachments.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center border-[1px] border-slate-300 rounded-md p-2 space-x-2"
                          >
                            <div>
                              <p className="text-sm text-slate-600">
                                {item.name}
                              </p>
                              <p className="text-[9px] text-slate-400">
                                {item.size} Kb
                              </p>
                            </div>
                            <div
                              onClick={() => {
                                setSelectedAttachment(item.id);
                                getAttachment({});
                              }}
                              role="button"
                              className="text-success-600 text-xs font-semibold"
                            >
                              View
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-2 px-4 mt-4">
                  {loadingComment ? (
                    <div className="w-full mx-auto flex justify-center items-center">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <>
                      {(comments?.data?.totalPage ?? 0) > pagination.page && (
                        <div className="w-full mx-auto flex justify-center items-center">
                          <Button
                            onClick={() => {
                              onLoadMore();
                            }}
                            className="bg-white"
                          >
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-blue-400">
                                Load More Older Comment
                              </p>
                              <HiArrowUp size={15} className="text-blue-500" />
                            </div>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  {renderComment()}
                </div>
                {detail?.data?.status !== "closed" && (
                  <Fragment>
                    <input
                      accept="image/*, application/pdf, video/*"
                      multiple
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <form
                      onSubmit={onSubmit}
                      className="space-x-2 px-4 mt-4 items-end"
                    >
                      <Controller
                        name="comment"
                        rules={{
                          required: {
                            value: true,
                            message: "Comment cannot be empty",
                          },
                        }}
                        control={control}
                        render={({ field, fieldState: { invalid, error } }) => (
                          <Textarea
                            type="text"
                            placeholder="Type your message here..."
                            variant="bordered"
                            classNames={{
                              input: "bg-white text-xs",
                              innerWrapper: "flex items-end",
                              inputWrapper:
                                "bg-white border-[1px] rounded-md border-default-300",
                            }}
                            errorMessage={error?.message}
                            isInvalid={invalid}
                            {...field}
                          />
                        )}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="space-x-1">
                          {data?.map((status) => renderStatusSelection(status))}
                        </div>
                        <div className="flex items-end h-full bottom-0 space-x-2">
                          <Button
                            aria-label="attachment"
                            isIconOnly
                            variant="bordered"
                            onClick={(event) => {
                              event.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="cursor-pointer border-primary"
                          >
                            <RiAttachment2 size={20} className="text-primary" />
                          </Button>
                          <Button
                            aria-label="send"
                            isIconOnly
                            type="submit"
                            className="cursor-pointer bg-primary"
                          >
                            <RiSendPlane2Line
                              size={20}
                              className="text-white"
                            />
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Fragment>
                )}
                {fileList.length > 0 && (
                  <div className="space-y-1 px-4">
                    {fileList.map((item, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <div className="text-xs font-semibold">
                          {item.fileName}
                        </div>
                        <div className="text-xs text-default-500">
                          ({item.size}Kb)
                        </div>
                        {item.isUploaded ? (
                          <div
                            onClick={() => {
                              onDeleteItem(index);
                            }}
                          >
                            <HiTrash className="text-red-500" />
                          </div>
                        ) : (
                          <div className="text-xs text-default-500">
                            Uploading...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ) : (
          <></>
        )}

        <div>
          <Card shadow="sm">
            <CardHeader className="justify-between">
              <div className="flex gap-2 items-center">
                <Avatar isBordered src="/assets/logo-square.png" />
                <div>Customer</div>
              </div>

              <Button
                className="flex-none"
                isIconOnly
                radius="full"
                variant="light"
              >
                <LuSearch size={24} />
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="bg-slate-700 h-[560px] overflow-auto message-body">
              {messages.length == 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-white">
                  <p className="font-semibold">
                    You’re starting a new conversation
                  </p>
                  <p>Type your first message below.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-4">
                  {messages.map((item, i) => (
                    <>
                      {item.isSent ? (
                        <div className="flex flex-col items-start">
                          <div className="text-xs text-gray-400 mb-0.5">
                            {item.createdAt.toLocaleString()}
                          </div>
                          <div className="max-w-[80%] bg-white border border-gray-500 p-2 rounded-lg">
                            <div>{item.message}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <div className="text-xs text-gray-400 mb-0.5">
                            {item.createdAt.toLocaleString()}
                          </div>
                          <div className="max-w-[80%] bg-primary border border-gray-500 p-2 rounded-lg">
                            <div>{item.message}</div>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              )}

              {/* <pre>{JSON.stringify(messages, null, 2)}</pre> */}

              <div className="sticky bg-slate-700 bottom-0 flex flex-col gap-4 mt-4">
                <Input
                  placeholder="Type your message here..."
                  onKeyDown={(evt) => handleSent(evt)}
                />
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    className="flex-none h-6 px-1 gap-1 bg-white"
                    size="sm"
                    radius="full"
                    variant="bordered"
                  >
                    <div className="p-1 rounded-full bg-blue-300"></div>
                    Open
                  </Button>
                  <Button
                    className="flex-none h-6 px-1 gap-1 bg-white"
                    size="sm"
                    radius="full"
                    variant="bordered"
                  >
                    <div className="p-1 rounded-full bg-orange-300"></div>
                    In Progress
                  </Button>
                  <Button
                    className="flex-none h-6 px-1 gap-1 bg-white"
                    size="sm"
                    radius="full"
                    variant="bordered"
                  >
                    <div className="p-1 rounded-full bg-green-300"></div>
                    Resolve
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="p-4">
          <h3 className="text-center mb-4 font-semibold text-lg">
            Ticket Information
          </h3>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Subject</h6>
            <p>Unable to log in to account</p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Description</h6>
            <p className="text-justify">
              The customer is unable to log in to their account despite entering
              the correct email and password. They have tried resetting their
              password but still encounter the same issue. The error message
              displayed is: &quot;Invalid credentials, please try again.&quot;
            </p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Ticket ID</h6>
            <p>ID-1234567</p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Assigned On</h6>
            <p>10 Oct 2024, 3:55 AM</p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Customer</h6>
            <div>
              <div className="rounded bg-slate-200 py-1 px-3 inline-flex gap-2 items-center">
                <Image
                  width={16}
                  height={16}
                  alt="LOGO"
                  className="flex-none"
                  src="/assets/cust-sm-1.png"
                />
                <span className="text-sm font-semibold">BRI</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Status</h6>
            <div className="flex gap-2 items-center ">
              <div className="rounded-full p-1.5 flex-none bg-orange-300"></div>
              <div>In Progress</div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Priority</h6>
            <p>High</p>
          </div>

          <div className="rounded-lg bg-slate-200 p-2 flex items-center gap-2">
            <BiStopwatch className="flex-none" size={20} />
            <div className="text-sm whitespace-nowrap">Total time tracked</div>
            <div className="m-auto whitespace-nowrap">00 : 07 : 00</div>
            <div className="flex flex-wrap gap-2 justify-end items-center">
              <Button
                className="bg-white"
                size="sm"
                startContent={<IoPlayOutline size={20} />}
              >
                Resume
              </Button>
              {/* <Button
                className="flex-none bg-white"
                size="sm"
                startContent={<IoPauseOutline size={20} />}
              >
                Pause
              </Button> */}
              <Button
                className="flex-none bg-white"
                size="sm"
                startContent={<RiHistoryLine size={20} />}
              >
                Log Time History
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ImageViewModal
        isOpen={open}
        data={attachment}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
}
