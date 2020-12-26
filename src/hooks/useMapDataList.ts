// if userId defined - posts of user

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getFeedMapData, getMapDataForUser } from "../api/post.api";
import { MaporyMapItem } from "../types/MaporyMapItem";

interface MapDataListReturnType {
  mapories: MaporyMapItem[];
  loading: boolean;
  selectedMapory: MaporyMapItem | null;
  setSelectedMapory(m: MaporyMapItem | null): void;
  dateRange: [Date, Date] | [];
  setDateRange(range: [Date, Date]): void;
  filteredMapories: MaporyMapItem[];
  onMaporyClick(clickedId: string): void;
}

// if userId undefined - feed
export const useMapDataList = (userId?: string): MapDataListReturnType => {
  const [mapories, setMapories] = useState<MaporyMapItem[]>([]);
  const [loadingMapories, setLoadingMapories] = useState<boolean>(true);
  const [selectedMapory, setSelectedMapory] = useState<MaporyMapItem | null>(
    null
  );
  const [dateRange, setDateRange] = useState<[Date, Date] | []>([]);

  useEffect(() => {
    async function fetchMapDataForUser() {
      try {
        if (userId) {
          const fMapories = await getMapDataForUser(userId);
          setMapories(fMapories);
        } else {
          const fMapories = await getFeedMapData();
          setMapories(fMapories);
        }
      } catch (e) {
        console.log(e);
      }

      setLoadingMapories(false);
    }

    fetchMapDataForUser();
  }, [userId]);

  const onMaporyClick = (clickedId: string) => {
    const mapory = mapories.find((m) => m.id === clickedId);
    if (!mapory) {
      return;
    }

    setSelectedMapory(mapory);
  };

  const filteredMapories = useMemo(() => {
    if (dateRange.length < 2) {
      return mapories;
    }

    const start = dayjs(dateRange[0]!);
    const end = dayjs(dateRange[1]!);

    return mapories.filter(
      (m) =>
        dayjs(m.visitDate).isSameOrAfter(start, "day") &&
        dayjs(m.visitDate).isSameOrBefore(end, "day")
    );
  }, [dateRange, mapories]);

  return {
    mapories,
    loading: loadingMapories,
    selectedMapory,
    setSelectedMapory,
    dateRange,
    setDateRange,
    filteredMapories,
    onMaporyClick,
  };
};
