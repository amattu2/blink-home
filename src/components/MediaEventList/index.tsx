import React, { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, List, Skeleton, Tag } from "antd";
import { getChangedMedia } from "@/api/actions";
import {
  formatYYYYMMDD,
  getDateNDaysAgo,
  getEventSource,
} from "@/utils/dashboard";

type Props = {
  since?: Date;
};

/**
 * Basic list of media events (i.e. Clips)
 *
 * @param {Props} { limit }
 * @returns {React.FC<Props>}
 */
const MediaEventList: FC<Props> = ({ since = getDateNDaysAgo(7) }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<MediaEvent[]>([]);

  const sinceDate = formatYYYYMMDD(since);

  const loadMore = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const d = await getChangedMedia(sinceDate, 1);
    if (d.status === "ok") {
      setData([...data, ...d.media]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMore();
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
        dataLength={data.length}
        next={loadMore}
        hasMore={false}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>No more events</Divider>}
        scrollableTarget="mediaEventList"
      >
        <List
          dataSource={data}
          renderItem={(event) => (
            <List.Item key={event.id}>
              <List.Item.Meta
                // TODO: include the thumbnail and live player
                title={event.device_name}
                description={
                  <>
                    <p>{`Recorded at ${event.created_at}`}</p>
                    <Tag>{event.network_name}</Tag>
                    <Tag>{getEventSource(event.source)}</Tag>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default MediaEventList;
