import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React from "react";
import { DateRangePicker } from "rsuite";
import { useMapDataList } from "../../hooks/useMapDataList";
import { Loading } from "../Loading";
import { Map } from "../map/Map";
import { MaporyModal } from "./MaporyModal";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface UserMapProps {
  userId?: string;
}

export const UserMap: React.FC<UserMapProps> = ({ userId }) => {
  const {
    mapories,
    loading,
    selectedMapory,
    setSelectedMapory,
    dateRange,
    setDateRange,
    filteredMapories,
    onMaporyClick,
  } = useMapDataList(userId);

  if (loading) {
    return <Loading />;
  }

  if (mapories.length === 0) {
    return (
      <div className="d-flex justify-content-center">
        <p>No mapories yet.</p>
      </div>
    );
  }

  return (
    <>
      {selectedMapory && (
        <MaporyModal
          open={selectedMapory != null}
          maporyId={selectedMapory.id}
          onClose={() => setSelectedMapory(null)}
        />
      )}

      <div className="d-flex justify-content-start mb-3">
        <DateRangePicker
          value={dateRange}
          onChange={(value) => {
            setDateRange(value as [Date, Date]);
          }}
          placeholder="Select visit date range"
        />
      </div>

      <Map
        markers={filteredMapories.map((m) => ({
          id: m.id,
          location: m.location,
        }))}
        onMarkerClick={onMaporyClick}
        height="500px"
      />
    </>
  );
};
