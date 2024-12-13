import { useState, useMemo } from "react";
import { FaPause, FaPlay, FaHistory } from "react-icons/fa";
import { P } from "@/types/response";
import LogTimeModal from "./log-time-modal";
import { Button } from "@nextui-org/react";
import { ResponseListLogs } from "@/app/_types/ticket/response-list-log";

type Props = {
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
  ticketId: string;
  hidePauseResume?: boolean;
  isPending: any;
  durationTotal: number;
};

const PauseResume = (props: Props) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const isPaused = useMemo(() => props.isPaused, [props]);

  const id = useMemo(() => props.ticketId, [props.ticketId]);

  const { data: logHistory, refetch } = useHttp<ResponseListLogs>(
    `/agent/timelogs/list?ticketId=${id}&page=${currentPage}&limit=${limit}&sort=createdAt&dir=desc`,
  );

  const toggleHistory = async() => {
    await refetch();
    setIsHistoryOpen(!isHistoryOpen);
  };

  const pauseLog = useMemo(() => {
    return logHistory?.data?.list.map((item) => {
      return {
        ...item,
        pauseHistory: item.pauseHistory?.map(
          (h: { durationActive: number }) => {
            return {
              ...h,
              duration: h.durationActive || 0,
            };
          },
        ),
      };
    });
  }, [logHistory]);

  const handlePauseResume = () => {
    if (isPaused) {
      props.onResume();
    } else {
      props.onPause();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex gap-2">
        {!props.hidePauseResume && (
          <Button
            onClick={handlePauseResume}
            isLoading={props.isPending}
            disabled={props.isPending}
            isDisabled={props.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
          >
            {isPaused ? (
              <>
                <FaPlay /> Resume
              </>
            ) : (
              <>
                <FaPause /> Pause
              </>
            )}
          </Button>
        )}
        <Button
          onClick={toggleHistory}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
        >
          <FaHistory /> Log Time History
        </Button>
      </div>
      <LogTimeModal
        isOpen={isHistoryOpen}
        onClose={toggleHistory}
        pauseLog={pauseLog ?? []}
        logHistory={logHistory}
        currentPage={currentPage}
        limit={limit}
        durationTotal={props.durationTotal}
        handlePageChange={handlePageChange}
        handlePauseResume={handlePauseResume}
      />
    </div>
  );
};

export default PauseResume;
