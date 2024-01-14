import React, { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, List, Tag } from "antd";
import { getChangedMedia } from "@/api/actions";
import {
  formatYYYYMMDD,
  getDateNDaysAgo,
  getEventSource,
} from "@/utils/dashboard";
import { useLocalStorage } from "usehooks-ts";
import { STORAGE_KEYS } from "@/config/STORAGE_KEYS";
import Thumbnail from "../Thumbnail";

type Props = {
  since?: Date;
};

const PAGINATION_SIZE = 5;

const ListItem: FC<{ event: MediaEvent }> = ({ event }) => (
  <List.Item key={event.id}>
    <List.Item.Meta
      title={event.device_name}
      description={
        <>
          <p>{`Recorded at ${event.created_at}`}</p>
          <Tag>{event.network_name}</Tag>
          <Tag>{getEventSource(event.source)}</Tag>
        </>
      }
    />
    <Thumbnail src={event.thumbnail} width={200} height={112} alt="Thumbnail" />
  </List.Item>
);

/**
 * Basic list of media events (i.e. Clips)
 *
 * @returns {React.FC<Props>}
 */
const MediaEventList: FC<Props> = ({ since = getDateNDaysAgo(7) }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useLocalStorage<MediaEvent[]>(
    STORAGE_KEYS.media_events,
    [],
  );
  const [paginatedData, setPaginatedData] = useState<MediaEvent[]>(
    data.length > 0 ? data.slice(0, PAGINATION_SIZE) : [],
  );
  const [hasMore, setHasMore] = useState<boolean>(true);

  const sinceDate = formatYYYYMMDD(since);

  const loadMore = async () => {
    if (loading || data.length === 0) {
      return;
    }
    if (paginatedData.length >= data.length) {
      return;
    }

    setPaginatedData(data.slice(0, paginatedData.length + PAGINATION_SIZE));
    setHasMore(paginatedData.length < data.length);
  };

  useEffect(() => {
    setLoading(true);

    (async () => {
      const d = await getChangedMedia(sinceDate, 1);
      if (d.status === "ok") {
        setData(d.media);
        setPaginatedData(d.media.slice(0, PAGINATION_SIZE));
        setHasMore(d.media.length > PAGINATION_SIZE);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div
      id="mediaEventList"
      style={{
        height: 350,
        overflow: "auto",
        padding: "0 16px",
      }}
    >
      <InfiniteScroll
        dataLength={paginatedData.length}
        hasMore={hasMore}
        next={loadMore}
        loader={null}
        endMessage={<Divider plain>Nothing else to see here...</Divider>}
        scrollableTarget="mediaEventList"
      >
        <List
          dataSource={paginatedData}
          renderItem={(event: MediaEvent) => (
            <ListItem key={event.id} event={event} />
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default MediaEventList;
